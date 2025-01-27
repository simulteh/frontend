import React from 'react';
import arrow from '../assets/images/arrow.png';

export const HeroSection = ({ title, subtitle, buttonText }) => (
  <section className="hero">
    <div className="container">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <a href="#" className="btn">{buttonText}</a>
    </div>
    <div className="scroll-to-top" id="scrollToTop">
      <img src={arrow} alt="Scroll to top" />
    </div>
  </section>
);