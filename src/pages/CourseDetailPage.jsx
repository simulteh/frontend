import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetailPage.css';
import CourseComments from '../components/CourseComments';
import Survey from '../components/Survey';

const courseQuestions = [
  {
    id: 1,
    text: 'Насколько полезен этот курс?',
    options: ['Очень полезен', 'Полезен', 'Нейтрально', 'Не полезен']
  },
  {
    id: 2,
    text: 'Вы бы порекомендовали этот курс друзьям?',
    options: ['Да, обязательно', 'Возможно', 'Нет']
  }
];

const CourseDetailPage = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find(c => c.id === Number(id));

  // Прогресс видеоплеера
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Загружаем прогресс из localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course-progress-${id}`);
    if (savedProgress) setProgress(Number(savedProgress));
  }, [id]);

  // Синхронизация прогресса с видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const percent = Math.floor((video.currentTime / video.duration) * 100);
      if (!isNaN(percent)) {
        setProgress(percent);
        localStorage.setItem(`course-progress-${id}`, percent);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [id]);

  if (!course) return <p>Курс не найден</p>;

  return (
    <div className="course-detail container">
      <h1>{course.title}</h1>
      <img src={course.image} alt={course.title} />
      <p><b>Уровень:</b> {course.level}</p>
      <p><b>Длительность:</b> {course.duration}</p>
      <p>{course.description}</p>

      {/* Видеоплеер с прогрессбаром */}
      <div className="video-wrapper">
        <h3>Видеоматериалы</h3>
        <video
          ref={videoRef}
          width="100%"
          controls
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />
      </div>

      <div className="progress-section">
        <h3>Прогресс прохождения</h3>
        <progress value={progress} max="100"></progress>
        <p>{progress}%</p>
      </div>

      {/* Комментарии */}
      <CourseComments courseId={course.id} />

      {/* Опрос курса */}
      <Survey questions={courseQuestions} courseId={course.id} />

      <Link to="/courses" className="back-button">Назад к курсам</Link>
    </div>
  );
};

export default CourseDetailPage;
