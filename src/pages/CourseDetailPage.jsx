import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetailPage.css';
import CourseComments from '../components/CourseComments';
import Survey from '../components/Survey';
import { fullDescription } from '../constants/data';

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

// Программа курса из data.js: первая строка — вступление, строки с «- » — пункты
const parseProgram = (text = '') => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return {
    intro: lines.find((l) => !l.startsWith('-')) || '',
    items: lines.filter((l) => l.startsWith('-')).map((l) => l.replace(/^-\s*/, '').replace(/[;.]$/, ''))
  };
};

const CourseDetailPage = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find(c => c.id === Number(id));
  const program = parseProgram(fullDescription.find(c => c.id === Number(id))?.fullDescription);

  // Прогресс видеоплеера
  const [progress, setProgress] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
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
  }, [id, course]);

  if (!course) {
    return (
      <div className="cd-page">
        <div className="cd-container cd-not-found">
          <h1>Курс не найден</h1>
          <Link to="/courses" className="cd-btn cd-btn-primary">Ко всем курсам</Link>
        </div>
      </div>
    );
  }

  const beginner = course.level === 'Для новичков';

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="cd-page">
      {/* Шапка курса */}
      <section className="cd-hero">
        <div className="cd-container cd-hero-grid">
          <div>
            <Link to="/courses" className="cd-back">← Все курсы</Link>
            <h1>{course.title}</h1>
            <p className="cd-lead">{course.description}</p>
            <div className="cd-chips">
              <span className={`cd-chip ${beginner ? 'cd-chip-green' : 'cd-chip-orange'}`}>{course.level}</span>
              <span className="cd-chip">Длительность: {course.duration}</span>
              <span className="cd-chip cd-chip-accent">Скидка 15% студентам и школьникам</span>
            </div>
          </div>
          <div className="cd-cover">
            {imageFailed ? (
              <div className="cd-cover-placeholder">{course.title}</div>
            ) : (
              <img src={course.image} alt={course.title} onError={() => setImageFailed(true)} />
            )}
          </div>
        </div>
      </section>

      <div className="cd-container cd-layout">
        <main className="cd-main">
          <section className="cd-card">
            <h2>Видеоматериалы</h2>
            <div className="cd-video">
              <video
                ref={videoRef}
                controls
                src={course.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
              />
            </div>
          </section>

          {program.items.length > 0 && (
            <section className="cd-card">
              <h2>Программа курса</h2>
              {program.intro && <p className="cd-muted">{program.intro}</p>}
              <ol className="cd-program">
                {program.items.map((item, i) => (
                  <li key={item}>
                    <span className="cd-program-num">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Комментарии */}
          <CourseComments courseId={course.id} />

          {/* Опрос курса */}
          <Survey questions={courseQuestions} courseId={course.id} />
        </main>

        <aside className="cd-aside">
          <div className="cd-card cd-progress-card">
            <h2>Ваш прогресс</h2>
            <div className="cd-progress-value">{progress}%</div>
            <div className="cd-bar">
              <div style={{ width: `${progress}%` }} />
            </div>
            <p className="cd-muted">
              {progress === 0
                ? 'Вы ещё не начали курс'
                : progress >= 100 ? 'Видеоматериалы просмотрены' : 'Продолжайте в том же духе'}
            </p>
            <button type="button" className="cd-btn cd-btn-primary cd-btn-block" onClick={scrollToVideo}>
              {progress === 0 ? 'Начать обучение' : 'Продолжить обучение'}
            </button>
            <dl className="cd-facts">
              <div>
                <dt>Уровень</dt>
                <dd>{course.level}</dd>
              </div>
              <div>
                <dt>Длительность</dt>
                <dd>{course.duration}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetailPage;
