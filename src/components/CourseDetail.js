import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseDetail = ({
  title,
  duration,
  description,
  author,
  position,
  level,
  image,
}) => {
  const navigate = useNavigate();

  const containerStyle = {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#222',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    position: 'relative',
    textAlign: 'center',
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#0047ab',
  };

  const imgStyle = {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '20px',
  };

  const labelStyle = {
    fontSize: '1.6rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#0047ab',
    marginBottom: '10px',
  };

  const titleStyle = {
    fontSize: '2.8rem',
    fontWeight: '900',
    marginBottom: '10px',
  };

  const durationStyle = {
    fontSize: '1.6rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#555',
  };

  const descriptionStyle = {
    fontSize: '1.4rem',
    lineHeight: 1.5,
    marginBottom: '25px',
  };

  const authorStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '4px',
  };

  const positionStyle = {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#666',
    marginBottom: '10px',
  };

  const levelStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#0047ab',
  };

  return (
    <div style={containerStyle} role="dialog" aria-modal="true" aria-labelledby="course-title">
      <button
        onClick={() => navigate(-1)}
        style={closeBtnStyle}
        aria-label="Закрыть"
      >
        ×
      </button>
      <img src={image} alt={title} style={imgStyle} />
      <p style={labelStyle}>КУРС</p>
      <h1 id="course-title" style={titleStyle}>{title}</h1>
      <p style={durationStyle}>Длительность: {duration}</p>
      <p style={descriptionStyle}>{description}</p>
      <p style={authorStyle}>Автор: {author}</p>
      <p style={positionStyle}>{position}</p>
      <p style={levelStyle}>Уровень: {level}</p>
    </div>
  );
};

export default CourseDetail;
