import React, { useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { getMyScores, saveLevelResult } from "../services/api";
import { isAuthenticated } from "../services/session";
import "../style/Game.css";

// Версия сборки Unity — меняется в одном месте
const BUILD_VERSION = "NGv1.2.1";
// Файлы лежат в public/NetGenius/Build/, значит доступны по URL от корня сайта
const BUILD_PATH = `/NetGenius/Build/${BUILD_VERSION}`;

// Связь с игрой для синхронизации прогресса:
// игра -> сайт: событие LevelCompleted с JSON { level, score }
// сайт -> игра: ProgressManager.LoadProgress с JSON { scores: [...] }, -1 — уровень не пройден
const PROGRESS_OBJECT = "ProgressManager";

function Game() {
  const {
    unityProvider,
    requestPointerLock,
    isLoaded,
    loadingProgression,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: `${BUILD_PATH}.loader.js`,
    dataUrl: `${BUILD_PATH}.data`,
    frameworkUrl: `${BUILD_PATH}.framework.js`,
    codeUrl: `${BUILD_PATH}.wasm`,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // ---- Синхронизация прогресса с аккаунтом ----

  // Игра сообщила о пройденном уровне — сохраняем результат в аккаунт
  useEffect(() => {
    const handleLevelCompleted = (json) => {
      if (!isAuthenticated()) return;
      try {
        const { level, score } = JSON.parse(json);
        // Сервер принимает только целые числа от 0 до 10
        const valid = (n) => Number.isInteger(n) && n >= 0 && n <= 10;
        if (!valid(level) || !valid(score)) {
          console.error("Игра прислала некорректный результат:", json);
          return;
        }
        saveLevelResult(level, score).catch((error) =>
          console.error("Не удалось сохранить результат уровня:", error)
        );
      } catch (error) {
        console.error("Некорректные данные от игры:", json, error);
      }
    };

    addEventListener("LevelCompleted", handleLevelCompleted);
    return () => removeEventListener("LevelCompleted", handleLevelCompleted);
  }, [addEventListener, removeEventListener]);

  // Игра загрузилась — передаём ей сохранённый прогресс аккаунта
  useEffect(() => {
    if (!isLoaded || !isAuthenticated()) return;

    getMyScores()
      .then((scores) => {
        const list = Array.isArray(scores) ? scores.map((s) => s ?? -1) : [];
        sendMessage(PROGRESS_OBJECT, "LoadProgress", JSON.stringify({ scores: list }));
      })
      .catch((error) => console.error("Не удалось загрузить прогресс:", error));
  }, [isLoaded, sendMessage]);

  // ---- Полноэкранный режим ----
  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error("Ошибка при входе в полноэкранный режим:", error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        console.error("Ошибка при выходе из полноэкранного режима:", error);
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // ESC — выход из полного экрана
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  // ---- Pointer Lock ----
  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("pointerlockerror", handlePointerLockChange);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("pointerlockerror", handlePointerLockChange);
    };
  }, []);

  const handleRequestPointerLock = useCallback(() => {
    if (isLoaded) {
      try {
        requestPointerLock();
      } catch (error) {
        console.error("Ошибка при запросе Pointer Lock:", error);
      }
    }
  }, [isLoaded, requestPointerLock]);

  return (
    <div className={`game-container ${isFullscreen ? "fullscreen" : ""}`}>
      {!isLoaded && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">
            Загрузка игры... {Math.round(loadingProgression * 100)}%
          </p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${loadingProgression * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Панель управления НАД игрой */}
      {isLoaded && !isFullscreen && (
        <div className="game-controls">
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            title="На весь экран"
          >
            <span className="icon-fullscreen"></span>
            Полный экран
          </button>
        </div>
      )}

      <div className="unity-wrapper">
        <Unity
          unityProvider={unityProvider}
          className="unity-container"
          style={{
            visibility: isLoaded ? "visible" : "hidden",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Оверлей для запроса Pointer Lock по клику */}
        {isLoaded && !isPointerLocked && (
          <div
            className="pointer-lock-overlay"
            onClick={handleRequestPointerLock}
          >
            <div className="pointer-lock-message">
              <span className="pointer-lock-icon">🖱️</span>
              <p>Нажмите здесь, чтобы начать управление</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;