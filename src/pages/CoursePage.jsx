import React from 'react';
import CourseItem from '../components/CourseItem';
import './CoursePage.css';

// Пример данных курсов
const coursesData = [
  {
    title: 'React для начинающих',
    description: 'Изучите основы React и создайте свое первое приложение!',
    image: 'https://img.youtube.com/vi/dGcsHMXbSOA/maxresdefault.jpg',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: 'Веб-дизайн с нуля',
    description: 'Научитесь создавать красивые и современные сайты.',
    image: 'https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg',
    video: '',
  },
  {
    title: 'JavaScript продвинутый',
    description: 'Углубленное изучение JavaScript для реальных проектов.',
    image: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
    video: 'https://www.w3schools.com/html/movie.mp4',
  },
];

const CoursesPage = () => (
  <div className="courses-page">
    <div className="container">
      <h2>Курсы</h2>
      <div className="courses-grid">
        {coursesData.map((course, idx) => (
          <CourseItem key={idx} {...course} />
        ))}
      </div>
    </div>
  </div>
);

export default CoursesPage;
