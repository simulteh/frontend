import React from 'react';

const CourseGreeting = () => {
  const handleClick = () => {
    alert('Кнопка нажата');
  };

  return (
    <div style={{ position: 'relative', maxWidth: '600px', margin: '20px auto' }}>
      {/* Кнопка с картинкой — позиционируется поверх блока */}
      <button
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="Войти"
      >
        <img
          src="https://via.placeholder.com/40" // замените на вашу картинку
          alt="Войти"
          style={{ display: 'block' }}
        />
      </button>

      {/* Блок с синим фоном и текстом */}
      <div
        style={{
          backgroundColor: '#4439DE',
          color: 'white',
          padding: '40px 20px 20px 20px',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.5,
        }}
      >
        <h1 style={{ color: '#DFDCFB', marginBottom: '0.5rem' }}>
          Добро пожаловать в наш курс
        </h1>
        <h2 style={{ color: '#4864EC', fontStyle: 'italic', marginTop: 0, marginBottom: '1rem' }}>
          «Введение в React»!
        </h2>
        <p>
          Изучите основы React — популярной библиотеки для создания интерфейсов. Узнайте, как создавать компоненты, управлять состоянием и работать с событиями.
        </p>
        <p style={{ marginTop: '1.5rem', color: '#DFDCFB', fontWeight: 'bold' }}>
          Чтобы войти, нажмите на картинку справа.
        </p>
      </div>
    </div>
  );
};

export default CourseGreeting;
