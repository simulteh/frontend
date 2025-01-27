import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Импортируем только Routes и Route
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NewsItem } from './components/NewsItem';
import { AboutCard } from './components/AboutCard';
import { Footer } from './components/Footer';
import AuthPage from './pages/AuthPage';
import './main.css';

const newsData = [
  { title: 'Запуск новой версии', description: 'Мы рады сообщить о запуске новой версии нашего приложения...' },
  { title: 'Обновление безопасности', description: 'В новой версии мы улучшили систему безопасности...' },
  // ... остальные новости
];

const aboutCardsData = [
  { title: 'Наша Миссия', description: 'Мы стремимся предоставить пользователям...' },
  { title: 'Наше Видение', description: 'Мы видим будущее в том...' },
  // ... остальные карточки
];

function App() {
  return (
    <>
      <Header />
      
      <Routes>
        {/* Главная страница */}
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
      </Routes>

      <Footer />
    </>
  );
}

export default App;