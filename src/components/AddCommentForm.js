import React, { useState } from 'react';

function AddCommentForm() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setComments([...comments, comment]);
    setComment('');
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Напиши комментарий..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Отправить</button>
      </form>

      <div style={styles.commentList}>
        {comments.map((text, index) => (
          <div key={index} style={styles.comment}>
            <strong style={styles.user}>👤 Пользователь</strong>
            <p style={styles.commentText}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: '700px',
    margin: '2rem auto',
    textAlign: 'center',
    fontFamily: 'inherit',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  input: {
    flex: '1',
    minWidth: '300px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4F46E5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  comment: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '16px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'left',
  },
  user: {
    color: '#333',
    marginBottom: '6px',
    display: 'block',
  },
  commentText: {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#222',
    margin: 0,
  },
};

export default AddCommentForm;
