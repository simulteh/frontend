import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../assets/images/logosim.svg';

const FEEDBACK_FORM_URL = 'https://forms.yandex.ru/u/6aa12364493639304c1c5ef1/';

export const Header = () => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, [location]);

  return (
    <header>
      <div className="container">
        <div className="left-section">
          <Link to="/" className="logo">
            <LogoSvg className="logo-svg" />
          </Link>
          <nav>
            <ul>
              <li><Link to="/game">Игра NetGenius</Link></li>
              <li><Link to="/courses">Курсы</Link></li>
              <li><Link to="/construct">Конструктор</Link></li>
              <li>
                <a
                  href={FEEDBACK_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Обратная связь
                </a>
              </li>
              <li><Link to="/partner">Партнеры</Link></li>
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