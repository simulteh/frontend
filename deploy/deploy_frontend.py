#!/usr/bin/env python3
"""Publish a CRA build through a restricted SSH key; never run uploaded code."""
import contextlib
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
from urllib.parse import unquote, urlsplit

MAX_ARCHIVE_BYTES = 256 * 1024 * 1024
MAX_EXTRACTED_BYTES = 512 * 1024 * 1024
MAX_FILES = 20000
SHA_PATTERN = r"[0-9a-fA-F]{40}"
CONTROL_FILES = ("asset-manifest.json", "index.html", "deploy-version.txt")


class DeploymentError(RuntimeError):
    pass


def requested_revision(args, environment):
    if "SSH_ORIGINAL_COMMAND" in environment:
        match = re.fullmatch(r"deploy (" + SHA_PATTERN + r")", environment["SSH_ORIGINAL_COMMAND"])
        if args or not match:
            raise DeploymentError("SSH command must be deploy followed by one full commit SHA")
        return match.group(1).lower()
    if len(args) != 1 or not re.fullmatch(SHA_PATTERN, args[0]):
        raise DeploymentError("supply one full commit SHA and the build archive on stdin")
    return args[0].lower()


def run(*args):
    result = subprocess.run(args, capture_output=True)
    if result.returncode:
        # Git remotes and tool errors can contain credentials. Keep them on the
        # server instead of copying arbitrary command output to public Actions.
        raise DeploymentError(f"{Path(args[0]).name} {args[1]} failed (exit {result.returncode})")
    return result.stdout


def git(repo, *args):
    return run("git", "-C", str(repo), *args).decode().strip()


def check_checkout(repo):
    if git(repo, "symbolic-ref", "--quiet", "--short", "HEAD") != "main":
        raise DeploymentError("frontend checkout must be on main")
    if git(repo, "status", "--porcelain", "--untracked-files=all"):
        raise DeploymentError("frontend has local changes; preserve them in Git before deploying")


def safe_path(name):
    path = PurePosixPath(name)
    if path.is_absolute() or ".." in path.parts or "\\" in name or "\x00" in name:
        raise DeploymentError("unsafe path in build archive")
    if any(part == ".git" or part.startswith(".env") for part in path.parts):
        raise DeploymentError("Git metadata and environment files cannot be published")
    return path


def receive_archive(source, archive):
    size = 0
    with archive.open("xb") as target:
        while True:
            chunk = source.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > MAX_ARCHIVE_BYTES:
                raise DeploymentError("compressed build archive exceeds 256 MiB")
            target.write(chunk)
    if not size:
        raise DeploymentError("build archive is empty")


def extract_build(archive, staging):
    files, seen = [], set()
    total = 0
    with tarfile.open(archive, "r:gz") as bundle:
        for member in bundle:
            relative = safe_path(member.name)
            if not (member.isdir() or member.isfile()):
                raise DeploymentError("only regular files and directories are allowed in the build")
            if relative == PurePosixPath("."):
                if not member.isdir():
                    raise DeploymentError("invalid archive root")
                continue
            if relative in seen:
                raise DeploymentError("duplicate path in build archive")
            seen.add(relative)
            if len(seen) > MAX_FILES:
                raise DeploymentError("build archive has too many entries")
            target = staging.joinpath(*relative.parts)
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            total += member.size
            if member.size < 0 or total > MAX_EXTRACTED_BYTES:
                raise DeploymentError("extracted build exceeds 512 MiB")
            target.parent.mkdir(parents=True, exist_ok=True)
            with bundle.extractfile(member) as source, target.open("xb") as output:
                shutil.copyfileobj(source, output)
            if target.stat().st_size != member.size:
                raise DeploymentError("truncated file in build archive")
            files.append(relative)
    return files


def validate_build(staging, revision):
    for name in CONTROL_FILES:
        path = staging / name
        if not path.is_file() or not path.stat().st_size:
            raise DeploymentError(f"build is missing {name}")
    if (staging / "deploy-version.txt").read_text().strip() != revision:
        raise DeploymentError("build revision differs from the requested commit")
    manifest = json.loads((staging / "asset-manifest.json").read_text())
    if not isinstance(manifest, dict) or not isinstance(manifest.get("files"), dict) or not manifest["files"]:
        raise DeploymentError("asset manifest is empty")
    for asset in manifest["files"].values():
        if not isinstance(asset, str):
            raise DeploymentError("invalid asset path in manifest")
        url = urlsplit(asset)
        if url.scheme or url.netloc:
            raise DeploymentError("build must use assets served from the site root")
        path = safe_path(unquote(url.path).lstrip("/"))
        if not staging.joinpath(*path.parts).is_file():
            raise DeploymentError("asset manifest references a missing file")


@contextlib.contextmanager
def deployment_lock(path, timeout=900):
    with path.open("a") as lock:
        deadline = time.monotonic() + timeout
        while True:
            try:
                fcntl.flock(lock.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except BlockingIOError:
                if time.monotonic() >= deadline:
                    raise DeploymentError("another deployment still holds the lock")
                time.sleep(0.2)
        try:
            yield
        finally:
            fcntl.flock(lock.fileno(), fcntl.LOCK_UN)


def check_nginx_mount(project, build):
    container = run("docker", "compose", "--project-name", "net-genius", "--project-directory", str(project),
                    "--file", str(project / "docker-compose.yml"), "ps", "--quiet", "nginx").decode().strip()
    if not container or "\n" in container:
        raise DeploymentError("one existing nginx container is required")
    mounts = json.loads(run("docker", "inspect", "--format", "{{json .Mounts}}", container))
    if not any(m.get("Type") == "bind" and m.get("Source") == str(build)
               and m.get("Destination") == "/usr/share/nginx/html" for m in mounts):
        raise DeploymentError("nginx must mount the existing frontend/build directory")


def check_destinations(build, files):
    if build.is_symlink() or not build.is_dir():
        raise DeploymentError("frontend/build must be an existing real directory")
    for relative in files:
        target = build
        for index, part in enumerate(relative.parts):
            target /= part
            if target.is_symlink():
                raise DeploymentError("build destination contains a symbolic link")
            if index < len(relative.parts) - 1 and target.exists() and not target.is_dir():
                raise DeploymentError("build destination parent is not a directory")
        if target.exists() and not target.is_file():
            raise DeploymentError("build destination is not a regular file")


def publish_file(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".frontend-deploy-", dir=destination.parent)
    try:
        with os.fdopen(fd, "wb") as target, source.open("rb") as current:
            shutil.copyfileobj(current, target)
        os.chmod(temporary, 0o644)
        os.replace(temporary, destination)
    finally:
        Path(temporary).unlink(missing_ok=True)


def publish(staging, build, files):
    # Keep the bind-mounted directory itself in place. New assets are copied
    # first; HTML becomes visible only after its files and manifest exist.
    for relative in files:
        parent = build
        for part in relative.parts[:-1]:
            parent /= part
            if not parent.exists():
                parent.mkdir()
                parent.chmod(0o755)
    for relative in files:
        if str(relative) not in CONTROL_FILES:
            publish_file(staging.joinpath(*relative.parts), build.joinpath(*relative.parts))
    for name in CONTROL_FILES:
        publish_file(staging / name, build / name)


def check_public_site(base_url, revision, expected_index, attempts=10):
    for attempt in range(attempts):
        try:
            marker = run("curl", "--fail", "--silent", "--max-time", "5", "-H", "Cache-Control: no-cache",
                         "--", base_url + "/deploy-version.txt?revision=" + revision).decode().strip()
            index = run("curl", "--fail", "--silent", "--max-time", "5", "-H", "Cache-Control: no-cache",
                        "--", base_url + "/?revision=" + revision)
            if marker == revision and hashlib.sha256(index).digest() == hashlib.sha256(expected_index).digest():
                return
        except DeploymentError:
            pass
        if attempt + 1 < attempts:
            time.sleep(2)
    raise DeploymentError("public HTTPS site does not serve the expected build")


def deploy(revision, source, project, lock_file, public_url):
    repo, build = project / "frontend", project / "frontend/build"
    if not (repo / ".git").is_dir() or not (project / "docker-compose.yml").is_file():
        raise DeploymentError("the existing root stack and frontend checkout are required")
    if not project.is_absolute() or not lock_file.is_absolute() or not public_url.startswith("https://"):
        raise DeploymentError("project and lock paths must be absolute; public URL must use HTTPS")
    check_checkout(repo)
    with tempfile.TemporaryDirectory(prefix="simulteh-frontend-") as temporary:
        temporary = Path(temporary)
        archive, staging = temporary / "build.tar.gz", temporary / "build"
        staging.mkdir()
        receive_archive(source, archive)
        files = extract_build(archive, staging)
        validate_build(staging, revision)
        with deployment_lock(lock_file):
            check_checkout(repo)
            git(repo, "fetch", "--no-tags", "origin", "refs/heads/main:refs/remotes/origin/main")
            if git(repo, "rev-parse", "refs/remotes/origin/main") != revision:
                print("Skipping this run: origin/main has a different commit.")
                return
            git(repo, "merge-base", "--is-ancestor", "HEAD", revision)
            check_destinations(build, files)
            check_nginx_mount(project, build)
            if shutil.disk_usage(build).free < sum((staging.joinpath(*p.parts)).stat().st_size for p in files) + 10 * 1024 * 1024:
                raise DeploymentError("not enough free disk space to publish this build")
            git(repo, "merge", "--ff-only", "--no-edit", revision)
            if git(repo, "rev-parse", "HEAD") != revision:
                raise DeploymentError("frontend checkout differs from the requested revision")
            publish(staging, build, files)
            check_public_site(public_url.rstrip("/"), revision, (staging / "index.html").read_bytes())
    print("Frontend deployment succeeded: " + revision)


def main():
    os.umask(0o077)
    try:
        revision = requested_revision(sys.argv[1:], os.environ)
        deploy(revision, sys.stdin.buffer,
               Path(os.environ.get("SIMULTEH_PROJECT_DIR", "/root/net-genius")),
               Path(os.environ.get("SIMULTEH_LOCK_FILE", "/run/lock/simulteh-deploy.lock")),
               os.environ.get("SIMULTEH_FRONTEND_URL", "https://www.simultech.ru"))
    except (DeploymentError, OSError, ValueError, tarfile.TarError) as error:
        print("Frontend deployment failed: " + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
