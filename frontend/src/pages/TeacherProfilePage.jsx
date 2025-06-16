import React from 'react';
import TeacherProfileForm from '../components/TeacherProfileForm';
import TeacherDownloadSection from '../components/TeacherDownloadSection';
import TeacherGradesTable from '../components/TeacherGradesTable';
import './TeacherProfilePage.css'; // Подключение стилей

const TeacherProfilePage = () => {
  return (
    <div className="teacher-profile">
      <div className="container">
        <h2>Личный кабинет преподавателя</h2>
        <TeacherProfileForm />
        <TeacherDownloadSection />
        <TeacherGradesTable />
      </div>
    </div>
  );
};

export default TeacherProfilePage;