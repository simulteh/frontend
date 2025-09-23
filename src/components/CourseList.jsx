import React, { useState } from 'react';
import CourseCard from './CourseCard';
import './CourseList.css';

const CourseList = ({ courses }) => {
  const [filter, setFilter] = useState('Все');

  const filteredCourses = courses.filter(course => {
    if (filter === 'Все') return true;
    return course.level === filter;
  });

  return (
    <div className="course-list">
      <div className="filters">
        <label>Фильтр по уровню: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Все">Все</option>
          <option value="Для новичков">Для новичков</option>
          <option value="Для продвинутых">Для продвинутых</option>
        </select>
      </div>

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p>Нет доступных курсов</p>
        )}
      </div>
    </div>
  );
};

export default CourseList;
