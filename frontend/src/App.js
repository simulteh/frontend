import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NewsItem } from './components/NewsItem';
import { AboutCard } from './components/AboutCard';
import { Footer } from './components/Footer';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import LabWorksPage from './pages/LabWorksPage';
import CoursesPage from './pages/CoursesPage'; // 👇️ Импортируем страницу курсов
import { Weather } from './components/Weather';
import './style/fonts.css';
import './style/global.css';

// Данные для новостей и карточек "О компании"
import { newsData, aboutCardsData } from './constants/data';

function App() {
  return (
    <>
      <Header /> {/* Шапка сайта */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection 
                title="Добро пожаловать в наше приложение" 
                subtitle="Создайте свою виртуальную сеть прямо сейчас!" 
                buttonText="Начать"
              />

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
                      <p>Наша компания разрабатывает инновационное приложение...</p>
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

        {/* Страница авторизации */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Страница авторизации */}
        <Route path="/weather" element={<Weather />} />

        {/* Страница профиля */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Страница профиля преподавателя */}
        <Route path="/teacher-profile" element={<TeacherProfilePage />} />

        {/* Страница с лабораторными работами */}
        <Route path="/lab-works" element={<LabWorksPage />} />

        {/* 👇️ Новый маршрут для страницы курсов */}
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>

      <Footer /> {/* Подвал сайта */}
    </>
  );
}

export default App;