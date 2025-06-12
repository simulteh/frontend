import React from 'react';
import styles from './CourseCard.module.css';

const CourseCard = ({
  title,
  description,
  image,
  author,
  duration,
  level,
  courseUrl
}) => {

  const handleButtonClick = () => {
    console.log(`Переход к курсу: ${title}`);
    window.location.href = courseUrl;
  };

  return (
    <div className={styles.card}>
      <img src={image} alt={`Курс ${title}`} className={styles.image} />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <p className={styles.info}><strong>Автор:</strong> {author}</p>
        <p className={styles.info}><strong>Длительность:</strong> {duration}</p>
        <p className={styles.info}><strong>Уровень:</strong> {level}</p>
        <button className={styles.button} onClick={handleButtonClick}>
          Перейти к курсу
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
