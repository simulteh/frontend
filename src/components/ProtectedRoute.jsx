// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/session';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Сохраняем URL куда хотел попасть пользователь (в том числе код приглашения в группу)
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

export default ProtectedRoute;