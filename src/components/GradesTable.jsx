import React from 'react';
import '../style/GradesTable.css';
import { useNavigate } from 'react-router-dom';

const GradesTable = () => {
  const grades = [
    { level: 'Программирование', score: 5, date: '01.01.2024' },
    { level: 'Интформационные технологии', score: 4, date: '05.01.2024' },
    { level: 'Элементы высшей сатематики', score: 5, date: '10.01.2024' },
    { level: 'Русский язык', score: 5, date: '06.06.2024' },
    { level: 'Иностранный язык', score: 5, date: '25.05.2024' },
    { level: 'Элементы высшей математики', score: 5, date: '05.10.2024' },
  ];

  return (
    <div className="grades-section">
      <h3>Оценки Студента</h3>
      <table>
        <thead>
          <tr>
            <th>Предмет</th>
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