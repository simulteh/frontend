import React from 'react';

const TeacherGradesTable = () => {
  const grades = [
    { student: 'Иванов Иван', group: 'Группа 1', score: 90, date: '01.01.2024' },
    { student: 'Петров Петр', group: 'Группа 1', score: 85, date: '05.01.2024' },
    { student: 'Сидоров Сидор', group: 'Группа 2', score: 95, date: '10.01.2024' },
  ];

  return (
    <div className="grades-section">
      <h3>Оценки студентов</h3>
      <table>
        <thead>
          <tr>
            <th>Студент</th>
            <th>Группа</th>
            <th>Оценка</th>
            <th>Дата завершения</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.student}</td>
              <td>{grade.group}</td>
              <td>{grade.score}</td>
              <td>{grade.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherGradesTable;