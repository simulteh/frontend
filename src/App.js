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
import ProtectedRoute from './components/ProtectedRoute';
import ConstructorPage from './pages/ConstructorPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';

// Страницы восстановления пароля - ДОБАВЬТЕ ЭТИ ИМПОРТЫ
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
                        Наша компания разрабатывает инновационное приложение...
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
        
        {/* Маршруты восстановления пароля - ДОБАВЬТЕ ЭТИ ДВА МАРШРУТА */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Защищенные маршруты */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
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
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      </Routes>

      <SupportModal />
      <Footer />
    </>
  );
}

export default App;