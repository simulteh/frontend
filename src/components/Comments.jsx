import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Comments = () => {
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : [
      {
        id: 1,
        author: "Анонимус777",
        text: "Все кайф ставлю 10/10",
        date: new Date('2025-06-18T10:20:05Z').toISOString()
      },
      {
        id: 2,
        author: "ФурриМэн",
        text: "Замуррчательно",
        date: new Date('2025-05-05T14:16:34Z').toISOString()
      }
    ];
  });

  const [newComment, setNewComment] = useState({
    author: '',
    text: ''
  });

  // Стили :(
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#4439DE',
      textAlign: 'center',
      marginBottom: '30px'
    },
    form: {
      backgroundColor: '#DFDCF8',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      marginBottom: '15px',
      border: '2px solid #4864EC',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#FFFFFF'
    },
    textarea: {
      minHeight: '120px',
      resize: 'vertical'
    },
    submitBtn: {
      backgroundColor: '#4864EC',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    submitBtnHover: {
      backgroundColor: '#4439DE'
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    item: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    author: {
      color: '#4439DE',
      margin: '0',
      fontSize: '18px'
    },
    date: {
      color: '#666',
      fontSize: '14px'
    },
    text: {
      margin: '0',
      lineHeight: '1.6',
      color: '#333'
    }
  };

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} часов назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;
    
    const comment = {
      id: Date.now(),
      author: newComment.author,
      text: newComment.text,
      date: new Date().toISOString()
    };
    
    setComments([comment, ...comments]);
    setNewComment({ author: '', text: '' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Комментарии</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={newComment.author}
          onChange={(e) => setNewComment({...newComment, author: e.target.value})}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Ваш комментарий"
          value={newComment.text}
          onChange={(e) => setNewComment({...newComment, text: e.target.value})}
          style={{...styles.input, ...styles.textarea}}
          required
        />
        <button 
          type="submit" 
          style={styles.submitBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.submitBtnHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.submitBtn.backgroundColor}
        >
          Отправить
        </button>
      </form>
      
      <div style={styles.list}>
        {comments.map(comment => (
          <div key={comment.id} style={styles.item}>
            <div style={styles.header}>
              <h3 style={styles.author}>{comment.author}</h3>
              <span style={styles.date}>{formatDate(comment.date)}</span>
            </div>
            <p style={styles.text}>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};