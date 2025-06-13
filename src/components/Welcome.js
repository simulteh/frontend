import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);

  const handleEnterClick = () => {
    navigate('/course');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      setIsPressed(true);
      setTimeout(() => {
        setIsPressed(false);
        handleEnterClick();
      }, 150);
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <div
      style={{
        height: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        backgroundColor: '#DFDCF8', // светлый фон страницы
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '2rem',
        overflow: 'hidden', // чтобы ничего не выходило за экран
      }}
    >
      <div
        style={{
          backgroundColor: '#4439DE',
          color: '#FFFFFF',
          maxWidth: '600px',
          padding: '2rem',
          borderRadius: '12px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <h1 style={{ marginBottom: '0.5rem' }}>
          Добро пожаловать в наш курс
        </h1>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>
          Курс Введение в React
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: 0 }}>
          Изучите основы React — популярной библиотеки для создания интерфейсов.
          Узнайте, как создавать компоненты, управлять состоянием и работать с событиями.
        </p>
        <p style={{ marginTop: '2rem' }}>
          Чтобы войти, нажмите на картинку справа
        </p>
      </div>

      <img
        src="https://i.postimg.cc/GtY3sXMc/Screenshot-8.jpg"
        alt="Войти"
        role="button"
        tabIndex={0}
        onClick={handleEnterClick}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          width: '250px',
          height: 'auto',
          maxHeight: 'calc(100vh - 4rem)', // чтобы не выходила за высоту контейнера с padding
          borderRadius: '8px',
          backgroundColor: 'transparent',
          userSelect: 'none',
          transform: isPressed ? 'translateY(2px) scale(0.97)' : 'none',
          transition: 'transform 0.1s ease',
          outline: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          flexShrink: 0,
          alignSelf: 'flex-start',
        }}
        onFocus={(e) => (e.currentTarget.style.outline = '2px solid #fff')}
        onBlur={(e) => (e.currentTarget.style.outline = 'none')}
      />
    </div>
  );
};

export default Welcome;
