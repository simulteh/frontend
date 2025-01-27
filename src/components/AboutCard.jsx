import React from 'react';
import team from '. team.jpg';

export const AboutCard = ({ title, description, image = team }) => (
  <div className="card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);