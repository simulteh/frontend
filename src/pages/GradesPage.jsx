import React from 'react';
import StudentGrades from '../components/StudentGrades';
import '../style/Cabinet.css';

const GradesPage = () => (
  <div className="lk-page">
    <div className="lk-container">
      <h1 className="lk-title">Мои оценки</h1>
      <StudentGrades />
    </div>
  </div>
);

export default GradesPage;
