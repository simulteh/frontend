import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../components/AuthForm.css';

const ConfirmEmailPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setError('Неверная или отсутствующая ссылка подтверждения');
        setIsLoading(false);
        return;
      }

      try {
        await authService.confirmEmail(token);
        setMessage('Email успешно подтвержден!');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } catch (err) {
        console.error('Ошибка при подтверждении email:', err);
        setError(err.response?.data?.message || 'Ошибка при подтверждении email. Ссылка может быть устаревшей.');
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="auth-page-container">
      <div className="auth-container">
        <h2>Подтверждение Email</h2>
        
        {isLoading && <p>Подтверждение email...</p>}
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <div className="auth-links">
          {error && (
            <Link to="/auth" className="auth-link">
              Перейти к авторизации
            </Link>
          )}
          {message && (
            <p>Перенаправление на страницу входа...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;