import React from 'react';

const containerStyle = {
  maxWidth: '700px',
  margin: '20px auto',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
  background: 'linear-gradient(135deg, #61dafb 0%, #21a1f1 100%)',
  color: '#fff',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const textBlockStyle = {
  flex: '1',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '700',
  marginBottom: '8px',
  color: '#ffeb3b',
  textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
};

const subtitleStyle = {
  fontSize: '22px',
  fontWeight: '600',
  marginBottom: '12px',
  color: '#ffffffcc',
};

const descriptionStyle = {
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '20px',
  color: '#e0f7fa',
};

const infoLabelStyle = {
  fontWeight: '700',
  color: '#ffe082',
};

const infoValueStyle = {
  color: '#fff',
  marginLeft: '6px',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '12px 24px',
  backgroundColor: '#ffeb3b',
  color: '#000',
  fontWeight: '700',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(255, 235, 59, 0.6)',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
};

const imageStyle = {
  width: '300px',
  borderRadius: '12px',
  objectFit: 'cover',
  flexShrink: 0,
};

export default function CourseCard() {
  const course = {
    title: 'Введение в React',
    description: 'Изучите основы React, включая компоненты, хуки и маршрутизацию.',
    author: 'Салимзода Мирзо',
    duration: '4 недели',
    level: 'Начальный',
    image:
      'https://avatars.mds.yandex.net/i?id=7050631ec0f1268f0a3a4dee20aabcc9479fb433-5451533-images-thumbs&n=13',
    url: 'https://example.com/courses/react-intro',
  };

  const handleClick = () => {
    window.open(course.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={containerStyle}>
      <div style={textBlockStyle}>
        <h1 style={titleStyle}>Курс {course.title}</h1>
        <h2 style={subtitleStyle}>{course.title}</h2>
        <p style={{marginBottom: '8px'}}>
          Превью курса <strong>{course.title}</strong>
        </p>
        <p style={descriptionStyle}>{course.description}</p>
        <p>
          <span style={infoLabelStyle}>Автор:</span>
          <span style={infoValueStyle}>{course.author}</span>
        </p>
        <p>
          <span style={infoLabelStyle}>Длительность:</span>
          <span style={infoValueStyle}>{course.duration}</span>
        </p>
        <p>
          <span style={infoLabelStyle}>Уровень:</span>
          <span style={infoValueStyle}>{course.level}</span>
        </p>
        <button type="button" style={buttonStyle} onClick={handleClick}>
          Перейти к курсу
        </button>
      </div>
      <img
        src={course.image}
        alt={`Превью курса ${course.title}`}
        style={imageStyle}
      />
    </div>
  );
}
