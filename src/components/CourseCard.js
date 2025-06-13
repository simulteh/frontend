import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = () => {
  const navigate = useNavigate();

  const handleExitClick = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#DFDCF8', // светло-фиолетовый фон
        color: '#4439DE', // тёмно-синий текст
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#4439DE' }}>КУРС</h1>
      <h2 style={{ color: '#4864EC' }}>Введение в React</h2>
      <p><strong>Длительность:</strong> 4 недели</p>
      <p>Это базовый курс по React для начинающих.</p>
      <p><strong>Автор:</strong> Салимзода Мирзо</p>
      <p><strong>Уровень:</strong> Начальный</p>

      <p style={{ marginTop: '2rem', fontSize: '1.1rem' }}>
        Добро пожаловать в нашем<br />
        Курс Введение в React<br />
        Изучите основы React — популярной библиотеки для создания интерфейсов. Узнайте, как создавать компоненты, управлять состоянием и работать с событиями.
      </p>

      <button
        onClick={handleExitClick}
        style={{
          marginTop: '2rem',
          backgroundColor: '#4439DE',
          color: '#FFFFFF',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4864EC')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4439DE')}
      >
        Выйти
      </button>
    </div>
  );
};

export default CourseCard;
