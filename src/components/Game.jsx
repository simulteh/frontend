import React, { useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "../style/Game.css";

function Game() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "/NetGenius/BuildNetGenius.loader.js",
    dataUrl: "/NetGenius/BuildNetGenius.data",
    frameworkUrl: "/NetGenius/BuildNetGenius.framework.js",
    codeUrl: "/NetGenius/BuildNetGenius.wasm",
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

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
        console.error('Ошибка при входе в полноэкранный режим:', error);
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
        console.error('Ошибка при выходе из полноэкранного режима:', error);
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  return (
    <div className={`game-container ${isFullscreen ? 'fullscreen' : ''}`}>
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
      
      <div className="unity-wrapper">
        {/* Кнопка теперь внутри контейнера игры */}
        {isLoaded && (
          <button 
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Выйти из полноэкранного режима (ESC)" : "На весь экран"}
          >
            <span className={isFullscreen ? "icon-exit-fullscreen" : "icon-fullscreen"}></span>
            {isFullscreen ? "Выйти" : "Полный экран"}
          </button>
        )}
        
        <Unity
          unityProvider={unityProvider}
          className="unity-container"
          style={{ 
            visibility: isLoaded ? "visible" : "hidden",
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        />
      </div>
    </div>
  );
}

export default Game;