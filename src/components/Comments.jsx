import React from 'react';
import  '../style/Comments.css'; // Импортируем файл стилей

const Comments = () => {
    const comments = [
        {
            author: 'Алексей',
            text: 'Отличная статья! Очень полезная информация.',
            date: '2023-10-01T12:00:00Z'
        },
        {
            author: 'Мария',
            text: 'Согласна с предыдущим комментарием. Спасибо за труд!',
            date: '2023-10-02T14:30:00Z'
        },
        {
            author: 'Иван',
            text: 'Не совсем согласен. Есть некоторые неточности.',
            date: '2023-10-03T09:15:00Z'
        },
        {
            author: 'Елена',
            text: 'Интересно, но хотелось бы больше примеров.',
            date: '2023-10-04T11:45:00Z'
        }
    ];

    return (
        <div className="comments-container">
            <h2 className="comments-title">Комментарии ({comments.length})</h2>
            {comments.length === 0 ? (
                <p className="no-comments">Нет комментариев.</p>
            ) : (
                <ul className="comments-list">
                    {comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                            <strong className="comment-author">{comment.author}</strong>: {comment.text} <br />
                            <small className="comment-date">{new Date(comment.date).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Comments;