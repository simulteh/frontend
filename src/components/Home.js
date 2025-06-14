import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const course = {
    title: 'Введение в React',
    duration: '4 недели',
    description:
      'Изучите основы React — популярной библиотеки для создания интерфейсов. Узнайте, как создавать компоненты, управлять состоянием и работать с событиями.',
    author: 'Салимзода Мирзо',
    level: 'Начальный',
    image: 'https://i.postimg.cc/GtY3sXMc/Screenshot-8.jpg',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 800,
        margin: 'auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
        color: '#333',
      }}
    >
      <div style={{ maxWidth: '60%' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#4864EC' }}>Информация о курсе</h2>
        <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>{course.title}</h1>
        <p style={{ marginTop: 0, marginBottom: '1rem', fontWeight: '500' }}>Длительность: {course.duration}</p>
        <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>{course.description}</p>
        <p style={{ marginBottom: '0.5rem' }}><b>Автор:</b> {course.author}</p>
        <p style={{ marginBottom: '1.5rem' }}><b>Уровень:</b> {course.level}</p>

        <div
          style={{
            backgroundColor: '#4864EC',
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(72, 100, 236, 0.3)',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Расписание курса</h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: 0, marginBottom: 0 }}>
            <li>1 неделя: Введение и основы React (6 часов)</li>
            <li>2 неделя: Компоненты и пропсы (8 часов)</li>
            <li>3 неделя: Состояние и события (8 часов)</li>
            <li>4 неделя: Маршрутизация и проект (10 часов)</li>
          </ul>
          <p style={{ marginTop: '1rem', fontWeight: '600' }}>Итого: 32 часа интенсивного обучения</p>
        </div>

        <p style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#666' }}>
          Чтобы войти, нажмите на картинку справа
        </p>
      </div>
      <div
        style={{ cursor: 'pointer', alignSelf: 'center' }}
        onClick={() => navigate('/course')}
        aria-label={`Перейти к курсу ${course.title}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate('/course');
          }
        }}
      >
        <img src={course.image} alt={course.title} style={{ maxWidth: 200, borderRadius: 8 }} />
      </div>
    </div>
  );
}

export default Home;
