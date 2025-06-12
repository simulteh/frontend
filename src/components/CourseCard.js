import React from 'react';
import styles from './CourseCard.module.css';

export default function CourseCard() {
  return (
    <div className={styles.card}>
      <div className={styles.textBlock}>
        <h1 className={styles.mainTitle}>Курс Введение в React</h1>
        <h2 className={styles.courseTitle}>Введение в React</h2>
        <h3 className={styles.previewTitle}>Превью курса Введение в React</h3>
        <p className={styles.description}>
          Изучите основы React, включая компоненты, хуки и маршрутизацию.
        </p>
        <p><strong>Автор:</strong> Салимзода Мирзо</p>
        <p><strong>Длительность:</strong> 4 недели</p>
        <p><strong>Уровень:</strong> Начальный</p>
        <a 
          href="#"
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          Перейти к курсу
        </a>
      </div>
      <div className={styles.imageBlock}>
        <img 
          src="https://avatars.mds.yandex.net/i?id=7050631ec0f1268f0a3a4dee20aabcc9479fb433-5451533-images-thumbs&n=13" 
          alt="Введение в React" 
          className={styles.image} 
        />
      </div>
    </div>
  );
}
