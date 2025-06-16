import React from 'react';
import AuthForm from '../components/AuthForm';
import './AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <div className="container">
        <h2>Авторизация/Регистрация</h2>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;