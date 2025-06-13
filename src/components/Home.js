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
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 800, margin: 'auto', padding: 20 }}>
      <div style={{ maxWidth: '60%' }}>
        <h2>Добро пожаловать в нашем</h2>
        <h1>Курс {course.title}</h1>
        <p>{course.description}</p>
        <p><i>Чтобы войти, нажмите на картинку справа</i></p>
      </div>
      <div style={{ cursor: 'pointer' }} onClick={() => navigate('/course')}>
        <img src={course.image} alt={course.title} style={{ maxWidth: 200, borderRadius: 8 }} />
      </div>
    </div>
  );
}

export default Home;
