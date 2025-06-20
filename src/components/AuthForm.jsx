import React, { useState } from 'react';
import './AuthForm.css'; // Подключаем стили
import { useNavigate } from 'react-router-dom';


const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Переключатель между входом и регистрацией
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (email === 'testemail@simulteh.com' && password === '12345test') {
        navigate('/profile'); // если логин/пароль совпадают
      } else {
        alert('Неверный логин или пароль');
      }
    } else {
      alert('Регистрация пока не реализована');
    }
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