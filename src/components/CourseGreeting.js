import React from 'react';

const CourseGreeting = () => {
  return (
    <div
      style={{
        backgroundColor: '#4439DE', // фон
        color: '#FFFFFF',           // основной цвет текста
        fontFamily: 'Arial, sans-serif',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        lineHeight: '1.5',
      }}
    >
      <h1
        style={{
          color: '#DFDCFB',        // цвет заголовков
          marginBottom: '0.5rem',
        }}
      >
        Добро пожаловать в наш курс
      </h1>
      <h2
        style={{
          color: '#4864EC',        // выделенный цвет
          fontStyle: 'italic',
          marginTop: 0,
          marginBottom: '1rem',
        }}
      >
        «Введение в React»!
      </h2>
      <p>
        Изучите основы React — популярной библиотеки для создания интерфейсов. Узнайте, как создавать компоненты, управлять состоянием и работать с событиями.
      </p>
      <p
        style={{
          marginTop: '1.5rem',
          color: '#DFDCFB',        // цвет заголовков для подсказки
          fontWeight: 'bold',
        }}
      >
        Чтобы войти, нажмите на картинку справа.
      </p>
    </div>
  );
};

export default CourseGreeting;
