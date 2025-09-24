import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const API_URL = "http://212.67.12.82:8080"; // URL бэкенда

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // ← Для редиректа

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Проверка совпадения паролей при регистрации
    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 🔑 Вход
        const res = await axios.post(`${API_URL}/auth/sign-in`, {
          email,
          password,
        });
        console.log(res.data)
        if (res.data) {
          localStorage.setItem('token', res.data);
          localStorage.setItem('email', email);
          setSuccess('Успешный вход!');
          navigate('/profile'); // ← Редирект на профиль
        }
      } else {
        // 📝 Регистрация
        const res = await axios.post(`${API_URL}/auth/sign-up`, {
          firstName,
          lastName,
          middleName,
          email,
          password,
        });
        console.log(res.data);

        if (res.data) {
          setSuccess(res.data); // backend возвращает строку: "Пользователь зарегистрирован"
        } else {
          setSuccess('Регистрация успешна!');
        }
      }
    } catch (err) {
      console.error(err);

      // 👇 Обрабатываем ошибки бэка
      if (!isLogin && err.response?.status === 400) {
        setError('Пользователь с таким email уже существует');
      } else if (err.response?.status === 500) {
        setError('Внутренняя ошибка сервера. Попробуйте позже.');
      } else {
        setError(err.response?.data || 'Ошибка при отправке запроса');
      }
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

        <div className="form-group password-group">
          <label htmlFor="password">Пароль</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="form-group password-group">
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        )}

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
