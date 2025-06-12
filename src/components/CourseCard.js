import React from 'react';
import styles from './CourseCard.module.css';

function CourseCard({ title, duration, image, onClick }) {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <img src={image} alt={`Изображение курса ${title}`} className={styles.image} />
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.duration}>Длительность: {duration}</p>
      </div>
    </div>
  );
}

export default CourseCard;
