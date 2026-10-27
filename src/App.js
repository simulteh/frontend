// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Компоненты
import ConsentModal from './components/ConsentModal';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import SupportModal from './components/SupportModal';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import JoinGroupPage from './pages/JoinGroupPage';
import GradesPage from './pages/GradesPage';
import PartnerPage from './pages/PartnerPage';
import HomePage from './pages/HomePage';
import OldHomePage from './pages/OldHomePage';
import ProtectedRoute from './components/ProtectedRoute';
import LabWorksPage from './pages/LabWorksPage';
import SupportAdminPage from './components/SupportAdminPage';
import { Comments } from './components/Comments';
import NotFoundPage from './pages/NotFoundPage';
import { Preloader } from './components/Preloader';
import Game from './components/Game';
import ConstructorPage from './pages/ConstructorPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';

// Страницы восстановления пароля
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Страницы курсов
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

// Данные
import { courses } from './constants/data';

// Стили
import './style/fonts.css';
import './style/global.css';

// Новая главная. false — вернуть прежнюю (pages/OldHomePage.jsx)
const USE_NEW_HOME = true;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader hidden={!loading} />;

  return (
    <>
      {/* Модальное окно согласия на обработку персональных данных */}
      <ConsentModal />

      <Header />
      <Routes>
        {/* Главная страница */}
        <Route
          path="/"
          element={USE_NEW_HOME ? <HomePage /> : <OldHomePage />}
        />
        
        {/* Маршруты аутентификации */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Маршруты восстановления пароля */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route 
          path="/construct" 
          element={
            <ConstructorPage />
          } 
        />
        
        {/* Остальные маршруты */}
        <Route path="/comments" element={<Comments />} />
        <Route path="/teacher-profile" element={<Navigate to="/groups" replace />} />
        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
        <Route path="/groups/:id" element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} />
        <Route path="/join/:code" element={<ProtectedRoute><JoinGroupPage /></ProtectedRoute>} />
        <Route path="/grades" element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/lab-works" element={<LabWorksPage />} />
        <Route path="/admin" element={<SupportAdminPage />} />
        <Route path="/courses" element={<CoursesPage courses={courses} />} />
        <Route path="/courses/:id" element={<CourseDetailPage courses={courses} />} />
        <Route path="/game" element={<Game />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <SupportModal />
      <Footer />
    </>
  );
}

export default App;