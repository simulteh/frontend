import React, { useState } from 'react';
import './AuthForm.css'; // Подключаем ваши стили

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // Переключатель между входом и регистрацией
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      console.log('Вход:');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('Регистрация:');
      console.log('Фамилия:', lastName);
      console.log('Имя:', firstName);
      console.log('Отчество:', middleName);
      console.log('Email:', email);
      console.log('Password:', password);
    }
    // Здесь можно добавить логику для отправки данных на сервер
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Поля для имени, фамилии и отчества (только для регистрации) */}
        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="middleName">Отчество (при наличии)</label>
              <input
                type="text"
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
          </>
        )}
        
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
              <button type="button" onClick={() => setIsLogin(false)}>Зарегистрируйтесь</button>
            </p>
          </>
        ) : (
          <p>
            Уже есть аккаунт?{' '}
            <button type="button" onClick={() => setIsLogin(true)}>Войдите</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;