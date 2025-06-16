import React from 'react';
import news from '../assets/images/news.jpg';

export const NewsItem = ({ title, description, image = news }) => (
  <article className="news-item">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
  </article>
);