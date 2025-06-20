import React, { useState } from 'react';
import './CourseItem.css';

const CourseItem = ({ title, description, image, video }) => (
  <article className="course-item">
    {video ? (
      <div className="course-video-wrapper">
        <video controls width="100%" poster={image}>
          <source src={video} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    ) : (
      <img src={image} alt={title} className="course-image" />
    )}
    <h3>{title}</h3>
    <p>{description}</p>
  </article>
);

export default CourseItem;
