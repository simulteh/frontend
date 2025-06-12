import React from 'react';

const containerStyle = {
  maxWidth: '900px',
  margin: '40px auto',
  padding: '30px 40px',
  borderRadius: '12px',
  backgroundColor: '#4439DE',
  color: '#DFDCF8',
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
};

const textContainerStyle = {
  flex: '1 1 0',
};

const imageStyle = {
  width: '360px',      // увеличенная ширина
  height: 'auto',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  objectFit: 'cover',
  flexShrink: 0,
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: '900',
  marginBottom: '20px',
  color: '#FFFFFF',
};

const labelStyle = {
  fontWeight: '700',
  marginTop: '20px',
  marginBottom: '6px',
  fontSize: '1.2rem',
  color: '#DFDCF8',
  opacity: 0.85,
};

const textStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.5',
  margin: 0,
  color: '#DFDCF8',
};

const buttonStyle = {
  marginTop: '30px',
  padding: '12px 25px',
  fontSize: '1.3rem',
  fontWeight: '700',
  backgroundColor: '#4864EC',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#364FC7',
};

export default function CourseDetail({
  title,
  duration,
  preview,
  description,
  author,
  level,
  onClose,
}) {
  const [hover, setHover] = React.useState(false);

  return (
    <div style={containerStyle}>
      <div style={textContainerStyle}>
        <h1 style={titleStyle}>{title}</h1>

        <p style={labelStyle}>Длительность:</p>
        <p style={textStyle}>{duration}</p>

        <p style={labelStyle}>Превью:</p>
        <p style={textStyle}>{preview}</p>

        <p style={labelStyle}>Описание:</p>
        <p style={textStyle}>{description}</p>

        <p style={labelStyle}>Автор:</p>
        <p style={textStyle}>{author}</p>

        <p style={labelStyle}>Уровень:</p>
        <p style={textStyle}>{level}</p>

        <button
          style={hover ? {...buttonStyle, ...buttonHoverStyle} : buttonStyle}
          onClick={onClose}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Закрыть
        </button>
      </div>

      <img
        src="https://i.postimg.cc/GtY3sXMc/Screenshot-8.jpg"
        alt={title}
        style={imageStyle}
      />
    </div>
  );
}

