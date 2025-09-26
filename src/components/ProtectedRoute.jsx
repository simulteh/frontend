// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Сохраняем URL куда хотел попасть пользователь
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

export default ProtectedRoute;