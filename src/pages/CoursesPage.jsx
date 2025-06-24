import React from 'react';
import CourseList from '../components/CourseList/CourseList';
import './CoursesPage.css';

const courses = [
  {
    id: 1,
    title: 'Основы программирования',
    description: 'Базовый курс для начинающих программистов. Изучите основы Python и создайте свои первые программы.',
    duration: '2 месяца',
    level: 'Для новичков',
    image: 'https://blog.geekbrains.by/wp-content/uploads/2024/01/geekbrains.by-yazyk-programmirovaniya-python-osobennosti-i-perspektivy.png'
  },
  {
    id: 2,
    title: 'Веб-разработка',
    description: 'Научитесь создавать современные веб-сайты с использованием HTML, CSS и JavaScript.',
    duration: '3 месяца',
    level: 'Для продвинутых',
    image: 'https://checkroi.ru/wp-content/uploads/2022/05/kurs-veb-dizajn-3-0-ot-skillbox-1024x685.jpeg'
  },
  {
    id: 3,
    title: 'Базы данных',
    description: 'Изучите основы работы с базами данных, SQL и проектирование баз данных.',
    duration: '2 месяца',
    level: 'Для продвинутых',
    image: 'https://webonto.ru/wp-content/uploads/2020/01/Database.jpg'
  }
];

const CoursesPage = () => {
  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Наши курсы</h1>
        <p>Выберите курс, который подходит именно вам</p>
      </div>
      <CourseList courses={courses} />
    </div>
  );
};

export default CoursesPage; 