import React, { useState } from 'react';
import './AuthForm.css'; // Подключаем стили

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // Переключатель между входом и регистрацией
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Здесь можно добавить логику для отправки данных на сервер
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="auth-links">
        {isLogin ? (
          <>
            <p>
              <a href="#forgot-password">Забыли пароль?</a>
            </p>
            <p>
              Еще нет аккаунта?{' '}
              <button onClick={() => setIsLogin(false)}>Зарегистрируйтесь</button>
            </p>
          </>
        ) : (
          <p>
            Уже есть аккаунт?{' '}
            <button onClick={() => setIsLogin(true)}>Войдите</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;