import React from 'react';
import AddCommentForm from './AddCommentForm';

function CommentsPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Комментарии</h1>
      <AddCommentForm />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '4rem 1rem',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#111',
  },
};

export default CommentsPage;
