import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import '../components/AuthForm.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setMessage('Ссылка для сброса пароля отправлена на вашу почту');
      setEmail('');
    } catch (err) {
      console.error('Ошибка при запросе сброса пароля:', err);
      setError(err.response?.data?.message || 'Ошибка при отправке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-container">
        <h2>Восстановление пароля</h2>
        <p className="auth-subtitle">
          Введите ваш email для получения ссылки сброса пароля
        </p>
        
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить ссылку'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/auth" className="auth-link">
            Вернуться к авторизации
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;