// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Компоненты
import ConsentModal from './components/ConsentModal';
import { Header } from './components/Header';
import { NewsItem } from './components/NewsItem';
import { AboutCard } from './components/AboutCard';
import { Footer } from './components/Footer';
import SupportModal from './components/SupportModal';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import LabWorksPage from './pages/LabWorksPage';
import SupportAdminPage from './components/SupportAdminPage';
import { Comments } from './components/Comments';
import NotFoundPage from './pages/NotFoundPage';
import { Preloader } from './components/Preloader';
import Game from './components/Game';
import ConstructorPage from './pages/ConstructorPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';

// Страницы восстановления пароля
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Страницы курсов
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

// Данные
import { newsData, aboutCardsData, courses } from './constants/data';

// Импорт картинки
import faviconImage from './assets/images/favicon.jpg';

// Стили
import './style/fonts.css';
import './style/global.css';

const FEEDBACK_FORM_URL = 'https://forms.yandex.ru/u/6aa12364493639304c1c5ef1/';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader hidden={!loading} />;

  return (
    <>
      {/* Модальное окно согласия на обработку персональных данных */}
      <ConsentModal />

      <Header />
      <Routes>
        {/* Главная страница */}
        <Route
          path="/"
          element={
            <>
              <section className="hero">
                <div className="container">
                  <h1>Добро пожаловать в наше приложение</h1>
                  <p>Создайте свою виртуальную сеть прямо сейчас!</p>
                  <div className="favicon-container">
                    <Link to="/game" className="favicon-link">
                      <img 
                        src={faviconImage} 
                        alt="Начать игру" 
                        className="favicon-image"
                      />
                    </Link>
                    <p className="click-me-text">Нажми меня!</p>
                  </div>

                  {/* Кнопка обратной связи */}
                  <div className="feedback-container">
                    <a
                      href={FEEDBACK_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="feedback-btn"
                    >
                      Обратная связь
                    </a>
                  </div>
                </div>
              </section>

              <section id="news" className="news">
                <div className="container">
                  <h2>Новости</h2>
                  <div className="news-grid">
                    {newsData.map((item, index) => (
                      <NewsItem key={index} {...item} />
                    ))}
                  </div>
                </div>
              </section>

              <section id="about" className="about">
                <div className="container">
                  <h2>О компании</h2>
                  <div className="about-content">
                    <div className="about-text">
                      <p>
                        Компания Симултех основана в 2024 году и создаёт образовательные продукты с геймификацией, которые делают обучение увлекательным, эффективным и мотивирующим. 
                        Мы превращаем сложные знания в интерактивный опыт, позволяя пользователям осваивать новые навыки легко и с удовольствием.
                        <br />
                        Сегодня у нас есть компьютерная игра, которая способствует обучению через игру. А впереди — целая линейка продуктов, которые расширят возможности интерактивного обучения в разных сферах. 
                        Мы делаем образование доступным, захватывающим и результативным для каждого.
                      </p>
                    </div>
                    <div className="about-cards">
                      {aboutCardsData.map((card, index) => (
                        <AboutCard key={index} {...card} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>
          }
        />
        
        {/* Маршруты аутентификации */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Маршруты восстановления пароля */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route 
          path="/construct" 
          element={
            <ConstructorPage />
          } 
        />
        
        {/* Остальные маршруты */}
        <Route path="/comments" element={<Comments />} />
        <Route path="/teacher-profile" element={<TeacherProfilePage />} />
        <Route path="/lab-works" element={<LabWorksPage />} />
        <Route path="/admin" element={<SupportAdminPage />} />
        <Route path="/courses" element={<CoursesPage courses={courses} />} />
        <Route path="/courses/:id" element={<CourseDetailPage courses={courses} />} />
        <Route path="/game" element={<Game />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <SupportModal />
      <Footer />
    </>
  );
}

export default App;