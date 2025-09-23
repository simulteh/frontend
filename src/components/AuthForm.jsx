import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

//const API_URL = "http://localhost:8080"; // URL бэкенда

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // 🔑 Вход
        const res = await axios.post(`/auth/sign-in`, {
          email,
          password,
        });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('email', email); // сохраняем email пользователя
          setSuccess('Успешный вход!');
        }
      } else {
        // 📝 Регистрация
        const res = await axios.post(`/auth/sign-up`, {
          firstName,
          lastName,
          middleName,
          email,
          password,
        });

        if (res.data.message) {
          setSuccess(res.data.message);
        } else {
          setSuccess('Регистрация успешна!');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка при отправке запроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
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

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
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
