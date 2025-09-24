import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // проверяем, есть ли токен
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, [location]); // пересчитываем при изменении маршрута

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <div className="container">
        <div className="left-section">
          <Link to="/" className="logo">
            <h1>Симултех</h1>
          </Link>
          <nav>
            <ul>
              <li>
                <Link to="/#news" onClick={scrollToSection('news')}>Новости</Link>
              </li>
              <li>
                <Link to="/#about" onClick={scrollToSection('about')}>О компании</Link>
              </li>
              <li>
                <Link to="/courses">Курсы</Link>
              </li>
              <li>
                <Link to="/game">Игра</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="right-section">
          {isAuth ? (
            <Link to="/profile" className="btn">Личный кабинет</Link>
          ) : (
            <Link to="/auth" className="btn">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
};
