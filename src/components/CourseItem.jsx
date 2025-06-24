import React from 'react';
import styles from './CourseItem.module.css';

const CourseItem = ({ course }) => {
  // Ограничиваем описание до 150 символов
  const shortDescription = course.description.length > 150 
    ? `${course.description.substring(0, 150)}...` 
    : course.description;

  return (
    <article className={styles.courseItem}>
      <h3 className={styles.title}>{course.title}</h3>
      <p className={styles.description}>{shortDescription}</p>
      <div className={styles.duration}>
        <span>Длительность: {course.duration}</span>
      </div>
    </article>
  );
};

export default CourseItem; 