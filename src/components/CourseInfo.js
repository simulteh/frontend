import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const weeks = [
  {
    title: '1 неделя: Введение и основы React (6 часов)',
    image: 'https://avatars.mds.yandex.net/i?id=d1719db66692e4b3b33ff08dd1db2992_l-5876089-images-thumbs&n=13',
    label: 'Неделя 1',
  },
  {
    title: '2 неделя: Компоненты и пропсы (8 часов)',
    image: 'https://ihatetomatoes.net/wp-content/uploads/2017/08/03-state-vs-props.png',
    label: 'Неделя 2',
  },
  {
    title: '3 неделя: Состояние и события (8 часов)',
    image: 'https://avatars.mds.yandex.net/i?id=0d9e920601f5b5bc1bce76832efdefc5c7b81393-11008180-images-thumbs&n=13',
    label: 'Неделя 3',
  },
  {
    title: '4 неделя: Маршрутизация и проект (10 часов)',
    image: 'https://avatars.mds.yandex.net/i?id=b3957c861eb05e5a20f37eb280144c922156cee5-4483283-images-thumbs&n=13',
    label: 'Неделя 4',
  },
];

const CourseInfo = () => {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

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
          maxWidth: 1000,
          width: '100%',
          borderRadius: 12,
          padding: '2rem',
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.5,
        }}
      >
        {/* Заголовки */}
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', letterSpacing: '0.1em', fontSize: '2.5rem' }}>
          КУРС
        </h3>
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '2.5rem' }}>
          Введение в React
        </h1>

        <p style={{ marginBottom: '1rem', fontWeight: '500' }}>Длительность: 4 недели</p>
        <p style={{ marginBottom: '1rem' }}>Это базовый курс по React для начинающих.</p>
        <p style={{ marginBottom: '0.5rem' }}>Автор: Салимзода Мирзо</p>
        <p style={{ marginBottom: '2rem' }}>Уровень: Начальный</p>

        {/* Расписание */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '1.5rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Расписание курса</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
            }}
          >
            {weeks.map((week, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  padding: '1rem',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{week.title}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={week.image}
                    alt={week.label}
                    style={{
                      width: '160px',
                      height: 'auto',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      marginBottom: '0.5rem',
                    }}
                  />
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>{week.label}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: '2rem', fontWeight: '600', color: '#FFFFFF' }}>
            🧠 Итого: 32 часа интенсивного обучения
          </p>
        </div>

        {/* Кнопка */}
        <button
          onClick={handleExit}
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
            userSelect: 'none',
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default CourseInfo;
