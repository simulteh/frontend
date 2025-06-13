import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);

  const handleEnterClick = () => {
    navigate('/course');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(true);
      setTimeout(() => {
        setIsPressed(false);
        handleEnterClick();
      }, 150);
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        backgroundColor: '#4439DE',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: '12px',
      }}
    >
      {/* Текстовый блок */}
      <div
        style={{
          color: '#FFFFFF',
          maxWidth: '600px',
          boxSizing: 'border-box',
          marginRight: '2rem',
        }}
      >
        <h1 style={{ color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Добро пожаловать в наш курс
        </h1>
        <h2 style={{ color: '#FFFFFF', marginTop: 0, marginBottom: '1rem' }}>
          Курс Введение в React
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: 0 }}>
          Изучите основы React — популярной библиотеки для создания интерфейсов.
          Узнайте, как создавать компоненты, управлять состоянием и работать с событиями.
        </p>
        <p style={{ marginTop: '2rem' }}>
          Чтобы войти, нажмите на картинку справа сверху
        </p>
      </div>

      {/* Картинка-кнопка с эффектом нажатия */}
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
          maxWidth: '300px',
          width: '100%',
          borderRadius: '8px',
          alignSelf: 'flex-start',
          backgroundColor: 'transparent',
          display: 'block',
          outline: 'none',
          userSelect: 'none',
          transform: isPressed ? 'translateY(2px) scale(0.97)' : 'none',
          transition: 'transform 0.1s ease',
        }}
        onFocus={e => (e.currentTarget.style.outline = '2px solid #fff')}
        onBlur={e => (e.currentTarget.style.outline = 'none')}
      />
    </div>
  );
};

export default Welcome;
