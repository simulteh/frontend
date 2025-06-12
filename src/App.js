import React, { useState } from 'react';
import CourseDetail from './components/CourseDetail';
import teamImg from './style/team.jpg';

function App() {
  const [showDetail, setShowDetail] = useState(false);

  const course = {
    title: 'Введение в React',
    duration: '4 недели',
    preview: 'Превью курса Введение в React',
    description: 'Это базовый курс по React для начинающих.',
    author: 'Салимзода Мирзо',
    level: 'Начальный',
    image: teamImg,
  };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    maxWidth: '700px',
    margin: '30px auto',
    padding: '20px 30px',
    borderRadius: '12px',
    backgroundColor: '#0047ab', // насыщенный синий
    gap: '20px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  };

  const imgStyle = {
    width: '160px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  };

  const labelStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 6px 0',
    textTransform: 'uppercase',
    opacity: 0.85,
  };

  const titleStyle = {
    fontSize: '2.6rem',
    fontWeight: '900',
    margin: '0 0 10px 0',
    lineHeight: 1.1,
  };

  const durationStyle = {
    fontSize: '1.6rem',
    fontWeight: '600',
    margin: 0,
    opacity: 0.9,
  };

  return (
    <div>
      {!showDetail && (
        <div style={cardStyle} onClick={() => setShowDetail(true)}>
          <img src={course.image} alt={course.title} style={imgStyle} />
          <div>
            <p style={labelStyle}>КУРС</p>
            <h2 style={titleStyle}>{course.title}</h2>
            <p style={durationStyle}>Длительность: {course.duration}</p>
          </div>
        </div>
      )}

      {showDetail && (
        <CourseDetail
          {...course}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

export default App;
