import React, { useRef, useState, useEffect } from 'react';
import '../style/VideoPlayer.css';

export const VideoPlayer = ({ videoUrl, videoId }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Загрузка сохраненного прогресса
  useEffect(() => {
    const savedTime = localStorage.getItem(`videoProgress_${videoId}`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, [videoId]);

  // Обработчик готовности видео
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    setIsReady(true);
    
    // Восстановление прогресса после загрузки метаданных
    const savedTime = localStorage.getItem(`videoProgress_${videoId}`);
    if (savedTime) {
      videoRef.current.currentTime = parseFloat(savedTime);
      setCurrentTime(parseFloat(savedTime));
      setProgress((parseFloat(savedTime) / videoRef.current.duration) * 100);
    }
  };

  // Переключение воспроизведения
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Обновление прогресса
  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    
    setCurrentTime(currentTime);
    setProgress((currentTime / duration) * 100);
    
    // Сохранение прогресса
    localStorage.setItem(`videoProgress_${videoId}`, currentTime.toString());
  };

  // Обработчик завершения видео
  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Можно добавить дополнительные действия при завершении
  };

  // Форматирование времени (секунды в MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Перемотка по клику на прогресс-бар
  const handleProgressBarClick = (e) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekPercentage = clickPosition / progressBarWidth;
    const seekTime = seekPercentage * videoRef.current.duration;
    
    videoRef.current.currentTime = seekTime;
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoUrl}
        onClick={togglePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        preload="metadata"
      />
      
      <div className="video-controls">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          )}
        </button>
        
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div 
          className="progress-bar"
          onClick={handleProgressBarClick}
        >
          <div 
            className="progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

