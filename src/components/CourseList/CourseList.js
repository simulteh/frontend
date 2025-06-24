import React from 'react';
import CourseCard from './CourseCard';
import './CourseList.css';

const CourseList = ({ courses }) => {
  return (
    <div className="course-list">
      {/* <div className="big-discount-banner">Скидка <span className="red-accent">15%</span> для студентов и школьников</div> */}
      <div className="course-grid">
        {courses && courses.length > 0 ? (
          courses.map(course => (
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