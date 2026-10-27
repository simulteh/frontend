// Прежняя главная страница. Чтобы вернуть её, в App.js поставьте USE_NEW_HOME = false
import React from 'react';
import { Link } from 'react-router-dom';
import { AboutCard } from '../components/AboutCard';
import { aboutCardsData } from '../constants/data';
import faviconImage from '../assets/images/favicon.jpg';

const FEEDBACK_FORM_URL = 'https://forms.yandex.ru/u/6aa12364493639304c1c5ef1/';
const VK_GROUP_URL = 'https://vk.ru/simultech';

const OldHomePage = () => (
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
        <div className="news-vk">
          <p>
            Обновления игры, анонсы и новости проекта мы публикуем
            в нашей группе ВКонтакте. Подписывайтесь, чтобы ничего не пропустить.
          </p>
          <a
            href={VK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="news-vk-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <rect width="24" height="24" rx="6" fill="#FFFFFF" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0077FF">VK</text>
            </svg>
            Перейти в группу
          </a>
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
);

export default OldHomePage;
