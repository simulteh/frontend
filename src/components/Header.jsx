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
                <Link to="/game">Игра NetGenius</Link>
              </li>
              <li>
                <Link to="/courses">Курсы</Link>
              </li>
              <li>
                <Link to="/construct">Конструктор</Link>
              </li>
              <li>
                <Link to="/update">Обновления</Link>
              </li>
              <li>
                <Link to="/partner">Партнеры</Link>
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