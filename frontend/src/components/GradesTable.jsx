import React from 'react';
import '../style/GradesTable.css';

const GradesTable = () => {
  const grades = [
    { level: 'Уровень 1', score: 90, date: '01.01.2024' },
    { level: 'Уровень 2', score: 85, date: '05.01.2024' },
    { level: 'Уровень 3', score: 95, date: '10.01.2024' },
  ];

  return (
    <div className="grades-section">
      <h3>Таблица оценок</h3>
      <table>
        <thead>
          <tr>
            <th>Уровень</th>
            <th>Оценка</th>
            <th>Дата завершения</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.level}</td>
              <td>{grade.score}</td>
              <td>{grade.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradesTable;