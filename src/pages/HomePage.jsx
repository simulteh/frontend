import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/session';
import heroShot from '../assets/images/game/hero.webp';
import './HomePage.css';

// Яндекс Форма с отзывами об игре (не путать с контактами в футере)
const FEEDBACK_FORM_URL = 'https://forms.yandex.ru/u/6aa12364493639304c1c5ef1/';
const VK_GROUP_URL = 'https://vk.ru/simultech';

const STEPS = [
  { title: 'Пройдите обучение', text: 'Освойте управление и познакомьтесь с офисом и наставником.' },
  { title: 'Выполняйте уровни', text: 'Десять уровней с сетевыми задачами — от простых к сложным.' },
  { title: 'Получайте баллы', text: 'До 10 баллов за уровень. Результаты видны вам и вашему преподавателю.' }
];

// Плавное появление блоков при прокрутке
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll('.hp-reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
};

const HomePage = () => {
  const pageRef = useReveal();
  const authorized = isAuthenticated();

  return (
    <div className="hp-page" ref={pageRef}>
      {/* Первый экран */}
      <section className="hp-hero">
        <div className="hp-container hp-hero-grid">
          <div className="hp-hero-text">
            <span className="hp-eyebrow">Игра-симулятор компьютерных сетей</span>
            <h1>Собери сеть. Пройди уровень. Разберись в&nbsp;сетях.</h1>
            <p className="hp-lead">
              NetGenius — 3D-симулятор, в котором вы работаете сетевым инженером:
              выполняете задания наставника, разбираетесь с оборудованием и получаете
              баллы за каждый уровень.
            </p>
            <div className="hp-hero-actions">
              <Link to="/game" className="hp-btn hp-btn-primary hp-btn-large">Играть в браузере</Link>
              <a
                href={FEEDBACK_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hp-btn hp-btn-ghost"
              >
                Оставить отзыв об игре
              </a>
            </div>
          </div>
          <div className="hp-hero-visual">
            <div className="hp-screen">
              <img src={heroShot} alt="Кадр из игры NetGenius: квартира, заявка наставника и телефон с текущей задачей" />
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="hp-section hp-section-tinted">
        <div className="hp-container">
          <div className="hp-section-head hp-reveal">
            <h2>Как это работает</h2>
          </div>
          <ol className="hp-steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="hp-step hp-reveal">
                <span className="hp-step-num">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Студентам и преподавателям */}
      <section className="hp-section">
        <div className="hp-container hp-audience">
          <div className="hp-audience-card hp-reveal">
            <span className="hp-audience-tag">Студентам</span>
            <h3>Учитесь в своём темпе</h3>
            <ul>
              <li>Проходите уровни в браузере, когда удобно</li>
              <li>Смотрите свои баллы в разделе «Мои оценки»</li>
              <li>Вступайте в группу преподавателя по ссылке-приглашению</li>
            </ul>
            <Link to={authorized ? '/grades' : '/auth'} className="hp-btn hp-btn-outline">
              {authorized ? 'Мои оценки' : 'Войти или зарегистрироваться'}
            </Link>
          </div>
          <div className="hp-audience-card hp-audience-accent hp-reveal">
            <span className="hp-audience-tag">Преподавателям</span>
            <h3>Видите прогресс всей группы</h3>
            <ul>
              <li>Создавайте учебные группы в личном кабинете</li>
              <li>Добавляйте студентов по ID или ссылке-приглашению</li>
              <li>Смотрите баллы каждого студента по всем уровням</li>
            </ul>
            <Link to="/partner" className="hp-btn hp-btn-white">Сотрудничество с вузами</Link>
          </div>
        </div>
      </section>

      {/* Новости */}
      <section className="hp-section hp-section-tinted" id="news">
        <div className="hp-container">
          <div className="hp-news hp-reveal">
            <div>
              <h2>Новости</h2>
              <p>
                Обновления игры, анонсы и новости проекта мы публикуем в нашей группе
                ВКонтакте. Подписывайтесь, чтобы ничего не пропустить.
              </p>
            </div>
            <a
              href={VK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hp-btn hp-btn-vk"
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

      {/* О компании */}
      <section className="hp-section" id="about">
        <div className="hp-container">
          <div className="hp-about-card hp-reveal">
            <h2>О компании</h2>
            <p>
              Компания Симултех основана в 2024 году и создаёт образовательные продукты
              с геймификацией. Мы превращаем сложные знания в интерактивный опыт: сегодня это
              игра NetGenius, а впереди — линейка продуктов для интерактивного обучения
              в разных сферах.
            </p>
          </div>
        </div>
      </section>

      {/* Финальный призыв */}
      <section className="hp-final">
        <div className="hp-container">
          <div className="hp-cta hp-reveal">
            <div>
              <h2>Готовы собрать свою первую сеть?</h2>
              <p>Начните с обучения — это займёт несколько минут.</p>
            </div>
            <Link to="/game" className="hp-btn hp-btn-white hp-btn-large">Играть в браузере</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
