import React from 'react';
import styles from './CourseCard.module.css';

function CourseCard() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Название курса</h2>
      <p className={styles.description}>
        Краткое описание курса, раскрывающее его основные темы и содержание.
      </p>
      <button
        className={styles.button}
        onClick={() => console.log('Перейти к курсу')}
      >
        Перейти к курсу
      </button>
    </div>
  );
}

export default CourseCard;
