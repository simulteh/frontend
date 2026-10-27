import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import { errorText } from '../services/api';
import { isAuthenticated } from '../services/session';
import '../components/AuthForm.css';

// Ссылка одноразовая, а React в режиме разработки запускает эффект дважды —
// поэтому один запрос на токен
const confirmRequests = new Map();
const confirmOnce = (token) => {
  if (!confirmRequests.has(token)) confirmRequests.set(token, authService.confirmEmail(token));
  return confirmRequests.get(token);
};

const ConfirmEmailPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // Ссылка неверная или устарела — можно запросить новое письмо
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [email, setEmail] = useState('');
  const [resendState, setResendState] = useState('');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('В ссылке нет кода подтверждения');
      setLinkInvalid(true);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    confirmOnce(token)
      .then((data) => {
        if (!cancelled) setMessage(data?.message || 'Email подтверждён');
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Ошибка при подтверждении email:', err);
        const status = err.response?.status;
        if (status === 400 || status === 404) {
          setError('Ссылка недействительна: срок её действия истёк или она уже использована');
          setLinkInvalid(true);
        } else {
          setError(errorText(err, 'Не удалось подтвердить email. Попробуйте позже'));
        }
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
        // Убираем токен из адресной строки, чтобы он не попал в скопированную ссылку
        window.history.replaceState(null, '', window.location.pathname);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendState('sending');
    try {
      await authService.resendConfirmation(email);
      setResendState('sent');
    } catch (err) {
      console.error('Ошибка отправки письма:', err);
      setResendState('error');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-container">
        <h2>Подтверждение Email</h2>

        {isLoading && <p>Подтверждение email...</p>}
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {linkInvalid && (
          resendState === 'sent' ? (
            <p className="success">
              Если адрес зарегистрирован и ещё не подтверждён, мы отправили на него новое письмо
            </p>
          ) : (
            <form onSubmit={handleResend}>
              <div className="form-group">
                <label htmlFor="email">Отправить новое письмо на email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {resendState === 'error' && (
                <p className="error">Не удалось отправить письмо. Попробуйте позже</p>
              )}
              <button type="submit" className="submit-btn" disabled={resendState === 'sending'}>
                {resendState === 'sending' ? 'Отправка...' : 'Отправить письмо'}
              </button>
            </form>
          )
        )}

        {!isLoading && (
          <div className="auth-links">
            {isAuthenticated() ? (
              <Link to="/profile" className="auth-link">Перейти в личный кабинет</Link>
            ) : (
              <Link to="/auth" className="auth-link">Перейти ко входу</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
