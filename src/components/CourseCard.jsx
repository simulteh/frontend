import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const getLevelClass = (level) => {
  if (level === 'Для новичков') return 'level level-beginner';
  if (level === 'Для продвинутых') return 'level level-advanced';
  return 'level';
};

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-image-wrapper">
        <div className="discount-badge">Скидка 15% для студентов и школьников</div>
        <img 
          src={course.image} 
          alt={course.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x180?text=No+Image';
          }}
        />
      </div>
      <div className={`course-level-badge ${getLevelClass(course.level)}`}>{course.level}</div>
      <div className={`course-duration-badge ${getLevelClass(course.level)}`}>Длительность: {course.duration}</div>
      <div className="course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <Link to={`/courses/${course.id}`} className="enroll-button">
        Подробнее
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
