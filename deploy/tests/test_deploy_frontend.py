import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location("frontend_deploy", Path(__file__).parents[1] / "deploy_frontend.py")
deployment = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deployment)


class FrontendDeploymentTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.origin = self.root / "origin"
        self.project = self.root / "net-genius"
        self.repo = self.project / "frontend"
        self.lock = self.root / "deployment.lock"
        self.project.mkdir()
        (self.project / "docker-compose.yml").write_text("services: {}\n")
        self.git("init", "-b", "main", str(self.origin))
        (self.origin / ".gitignore").write_text("/build\n")
        (self.origin / "app.txt").write_text("old source")
        self.commit(self.origin, "initial")
        self.old_revision = self.git("-C", str(self.origin), "rev-parse", "HEAD")
        self.git("clone", str(self.origin), str(self.repo))
        (self.origin / "app.txt").write_text("new source")
        self.commit(self.origin, "new frontend")
        self.revision = self.git("-C", str(self.origin), "rev-parse", "HEAD")
        self.build = self.repo / "build"
        (self.build / "static/js").mkdir(parents=True)
        (self.build / "index.html").write_text("old HTML")
        (self.build / "static/js/old.js").write_text("old cached script")
        self.commands = []
        self.real_run = deployment.run
        self.index = b'<html><script src="/static/js/main.new.js"></script></html>'
        self.bad_mount = False
        self.bad_site = False
        self.addCleanup(patch.stopall)
        patch.object(deployment.time, "sleep").start()
        patch.object(deployment, "run", side_effect=self.run_command).start()

    def git(self, *args):
        result = subprocess.run(["git", *args], capture_output=True, text=True, check=True)
        return result.stdout.strip()

    def commit(self, repo, message):
        self.git("-C", str(repo), "add", ".")
        self.git("-C", str(repo), "-c", "user.name=Deployment Test", "-c", "user.email=test@example.test",
                 "commit", "-m", message)

    def run_command(self, *args):
        self.commands.append(args)
        if args[0] == "git":
            return self.real_run(*args)
        if args[:2] == ("docker", "compose"):
            self.assertEqual(args[-3:], ("ps", "--quiet", "nginx"))
            return b"existing-nginx\n"
        if args[:2] == ("docker", "inspect"):
            return json.dumps([{"Type": "bind", "Source": str(self.build if not self.bad_mount else self.root),
                                "Destination": "/usr/share/nginx/html"}]).encode()
        if args[0] == "curl":
            if "deploy-version.txt" in args[-1]:
                return ("incorrect revision" if self.bad_site else self.revision).encode()
            return self.index
        self.fail("Unexpected external command: " + repr(args))

    def archive(self, revision=None, overrides=None, extra_members=()):
        files = {
            "static/js/main.new.js": b"new script",
            "static/new-dir/new.txt": b"new public asset",
            "asset-manifest.json": json.dumps({"files": {"main.js": "/static/js/main.new.js",
                                                           "index.html": "/index.html"}}).encode(),
            "index.html": self.index,
            "deploy-version.txt": ((revision or self.revision) + "\n").encode(),
        }
        files.update(overrides or {})
        buffer = io.BytesIO()
        with tarfile.open(fileobj=buffer, mode="w:gz") as bundle:
            for name, contents in files.items():
                entry = tarfile.TarInfo(name)
                entry.size = len(contents)
                bundle.addfile(entry, io.BytesIO(contents))
            for entry, contents in extra_members:
                bundle.addfile(entry, io.BytesIO(contents) if contents is not None else None)
        buffer.seek(0)
        return buffer

    def deploy(self, archive=None, revision=None):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            deployment.deploy(revision or self.revision, archive or self.archive(), self.project,
                              self.lock, "https://site.example.test")
        return output.getvalue()

    def assert_unpublished(self):
        self.assertEqual((self.build / "index.html").read_text(), "old HTML")
        self.assertEqual(self.git("-C", str(self.repo), "rev-parse", "HEAD"), self.old_revision)
        self.assertFalse((self.build / "deploy-version.txt").exists())

    def test_publishes_assets_before_html_without_replacing_bind_mount(self):
        inode = self.build.stat().st_ino
        order = []
        publish_file = deployment.publish_file
        def record(source, destination):
            order.append(str(destination.relative_to(self.build)))
            if destination.name == "index.html":
                self.assertEqual((self.build / "static/js/main.new.js").read_bytes(), b"new script")
                self.assertTrue((self.build / "asset-manifest.json").exists())
            publish_file(source, destination)
        with patch.object(deployment, "publish_file", side_effect=record):
            output = self.deploy()
        self.assertIn("Frontend deployment succeeded: " + self.revision, output)
        self.assertEqual(self.build.stat().st_ino, inode)
        self.assertEqual((self.build / "index.html").read_bytes(), self.index)
        self.assertEqual(order[-3:], list(deployment.CONTROL_FILES))
        self.assertTrue((self.build / "static/js/old.js").exists())
        self.assertEqual(self.git("-C", str(self.repo), "rev-parse", "HEAD"), self.revision)
        self.assertFalse(any("up" in command or "restart" in command or "build" in command
                             for command in self.commands if command[0] == "docker"))

    def test_public_files_and_new_directories_are_readable_despite_private_umask(self):
        previous = os.umask(0o077)
        try:
            self.deploy()
        finally:
            os.umask(previous)
        self.assertEqual((self.build / "static/new-dir").stat().st_mode & 0o777, 0o755)
        self.assertEqual((self.build / "static/new-dir/new.txt").stat().st_mode & 0o777, 0o644)

    def test_redeployment_of_current_main_is_idempotent(self):
        self.deploy()
        self.assertIn("succeeded", self.deploy())
        self.assertEqual((self.build / "index.html").read_bytes(), self.index)

    def test_stale_workflow_skips_without_checkout_or_publication(self):
        result = self.deploy(self.archive(revision=self.old_revision), self.old_revision)
        self.assertIn("Skipping", result)
        self.assert_unpublished()
        self.assertFalse(any(command[0] in ("docker", "curl") for command in self.commands))

    def test_dirty_tracked_source_blocks_deployment(self):
        (self.repo / "app.txt").write_text("unpublished work")
        with self.assertRaisesRegex(deployment.DeploymentError, "local changes"):
            self.deploy()
        self.assert_unpublished()
        self.assertEqual((self.repo / "app.txt").read_text(), "unpublished work")

    def test_untracked_source_blocks_deployment(self):
        (self.repo / "unpublished.js").write_text("important work")
        with self.assertRaisesRegex(deployment.DeploymentError, "local changes"):
            self.deploy()
        self.assert_unpublished()

    def test_wrong_branch_is_rejected(self):
        self.git("-C", str(self.repo), "switch", "-c", "local-work")
        with self.assertRaisesRegex(deployment.DeploymentError, "must be on main"):
            self.deploy()
        self.assert_unpublished()

    def test_diverged_main_is_not_reset(self):
        (self.repo / "app.txt").write_text("local committed work")
        self.commit(self.repo, "local work")
        local = self.git("-C", str(self.repo), "rev-parse", "HEAD")
        with self.assertRaises(deployment.DeploymentError):
            self.deploy()
        self.assertEqual(self.git("-C", str(self.repo), "rev-parse", "HEAD"), local)
        self.assertEqual((self.build / "index.html").read_text(), "old HTML")

    def test_archive_revision_must_match_requested_main(self):
        with self.assertRaisesRegex(deployment.DeploymentError, "build revision differs"):
            self.deploy(self.archive(revision=self.old_revision))
        self.assert_unpublished()

    def test_missing_manifest_asset_blocks_publication(self):
        with self.assertRaisesRegex(deployment.DeploymentError, "missing file"):
            self.deploy(self.archive(overrides={"asset-manifest.json": b'{"files":{"main.js":"/missing.js"}}'}))
        self.assert_unpublished()

    def test_traversal_absolute_paths_and_secret_files_are_rejected(self):
        for name in ("../outside.txt", "/absolute.txt", "static/../../outside.txt", ".env", ".git/config"):
            with self.subTest(path=name):
                entry = tarfile.TarInfo(name)
                entry.size = 1
                with self.assertRaises(deployment.DeploymentError):
                    self.deploy(self.archive(extra_members=[(entry, b"x")]))
                self.assert_unpublished()
        self.assertFalse((self.root / "outside.txt").exists())

    def test_archive_symlinks_hardlinks_and_devices_are_rejected(self):
        for kind in (tarfile.SYMTYPE, tarfile.LNKTYPE, tarfile.CHRTYPE):
            with self.subTest(kind=kind):
                entry = tarfile.TarInfo("unsafe")
                entry.type = kind
                entry.linkname = "/outside"
                with self.assertRaisesRegex(deployment.DeploymentError, "only regular files"):
                    self.deploy(self.archive(extra_members=[(entry, None)]))
                self.assert_unpublished()

    def test_compressed_and_extracted_limits_are_enforced(self):
        for setting in ("MAX_ARCHIVE_BYTES", "MAX_EXTRACTED_BYTES", "MAX_FILES"):
            with self.subTest(setting=setting), patch.object(deployment, setting, 1):
                with self.assertRaises(deployment.DeploymentError):
                    self.deploy()
                self.assert_unpublished()

    def test_destination_symlink_cannot_write_outside_build(self):
        outside = self.root / "outside"
        outside.mkdir()
        (self.build / "static/new-dir").symlink_to(outside, target_is_directory=True)
        with self.assertRaisesRegex(deployment.DeploymentError, "symbolic link"):
            self.deploy()
        self.assertFalse((outside / "new.txt").exists())
        self.assert_unpublished()

    def test_unexpected_nginx_mount_blocks_publication(self):
        self.bad_mount = True
        with self.assertRaisesRegex(deployment.DeploymentError, "nginx must mount"):
            self.deploy()
        self.assert_unpublished()

    def test_backend_and_frontend_deploys_share_an_exclusive_lock(self):
        with deployment.deployment_lock(self.lock):
            with self.assertRaisesRegex(deployment.DeploymentError, "holds the lock"):
                with deployment.deployment_lock(self.lock, timeout=0):
                    self.fail("A second deployment acquired the same lock")

    def test_failed_public_health_is_not_reported_as_success_and_is_bounded(self):
        self.bad_site = True
        with self.assertRaisesRegex(deployment.DeploymentError, "public HTTPS site"):
            self.deploy()
        self.assertEqual(sum(command[0] == "curl" for command in self.commands), 20)

    def test_ssh_command_parser_rejects_shell_injection_and_other_commands(self):
        for value in ("", "bash", "deploy main", "deploy " + self.revision[:8],
                      "deploy " + self.revision + "; id", "deploy " + self.revision + "\n",
                      "deploy $(id)", "deploy " + self.revision + " extra"):
            with self.subTest(command=value):
                with self.assertRaises(deployment.DeploymentError):
                    deployment.requested_revision([], {"SSH_ORIGINAL_COMMAND": value})
        self.assertEqual(deployment.requested_revision([], {"SSH_ORIGINAL_COMMAND": "deploy " + self.revision}),
                         self.revision)
        with self.assertRaises(deployment.DeploymentError):
            deployment.requested_revision([self.revision], {"SSH_ORIGINAL_COMMAND": "deploy " + self.revision})


if __name__ == "__main__":
    unittest.main()
