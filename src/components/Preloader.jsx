import React from 'react';
import '../style/preLoader.css';
import spinner from '../assets/images/spinner.svg'; // вставь свой спиннер

export const Preloader = ({ hidden }) => (
  <div className={`preloader ${hidden ? 'hidden' : ''}`}>
    <img src={spinner} alt="Loading..." />
    <p>Загрузка...</p>
  </div>
);
