import React, { useState } from 'react';

const CourseInfo = ({ onExit }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#4864EC',
        minHeight: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 12,
          padding: '2rem',
          backgroundColor: 'transparent',
          color: '#DFDCFB',
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.5,
          // ❌ userSelect: 'none', — удалено
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            color: '#FFFFFF',
          }}
        >
          КУРС
        </h3>
        <h1
          style={{
            marginTop: 0,
            marginBottom: '0.5rem',
            color: '#FFFFFF',
          }}
        >
          Введение в React
        </h1>
        <p style={{ marginTop: 0, marginBottom: '1rem', fontWeight: '500' }}>
          Длительность: 4 недели
        </p>

        <p style={{ marginBottom: '1rem' }}>
          Это базовый курс по React для начинающих.
        </p>

        <p style={{ marginBottom: '0.5rem' }}>
          Автор: Салимзода Мирзо
        </p>

        <p style={{ marginBottom: '2rem' }}>
          Уровень: Начальный
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '1.5rem',
            borderRadius: '10px',
            color: '#FFFFFF',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>
            Расписание курса
          </h2>
          <ul style={{ paddingLeft: '1.2rem', marginTop: 0, marginBottom: 0 }}>
            <li>1 неделя: Введение и основы React (6 часов)</li>
            <li>2 неделя: Компоненты и пропсы (8 часов)</li>
            <li>3 неделя: Состояние и события (8 часов)</li>
            <li>4 неделя: Маршрутизация и проект (10 часов)</li>
          </ul>
          <p style={{ marginTop: '1rem', fontWeight: '600' }}>
            Итого: 32 часа интенсивного обучения
          </p>
        </div>

        <button
          onClick={onExit}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          style={{
            backgroundColor: isPressed ? '#FFFFFF' : 'transparent',
            color: isPressed ? '#4864EC' : '#FFFFFF',
            border: '2px solid #FFFFFF',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s, color 0.3s, transform 0.1s',
            transform: isPressed ? 'scale(0.95) translateY(2px)' : 'none',
            userSelect: 'none', // ← оставляем только здесь
          }}
          aria-label="Выйти"
          type="button"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default CourseInfo;
