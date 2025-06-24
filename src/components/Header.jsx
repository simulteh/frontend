import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header>
    <div className="container">
      <div className="left-section">
        <Link to="/" className="logo">
          <h1>Симултех</h1>
        </Link>
        <nav>
          <ul>
            <li><a href="#news">Новости</a></li>
            <li><a href="#about">О компании</a></li>
            <li><a href="#workflow">Как мы работаем</a></li>
            <li><Link to="/courses">Курсы</Link></li>
          </ul>
        </nav>
      </div>
      <div className="right-section">
        <Link to="/auth" className="btn">Войти</Link>
      </div>
    </div>
  </header>
);