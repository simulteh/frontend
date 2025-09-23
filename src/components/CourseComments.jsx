import React, { useState } from "react";
import "./CourseComments.css"; // отдельный файл с CSS

const CourseComments = () => {
  const [comments, setComments] = useState([
    { id: 1, name: "Алексей", text: "Очень полезный курс!" },
    { id: 2, name: "Марина", text: "Спасибо за материал, все понятно." }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    const comment = {
      id: Date.now(),
      name: "Вы", // можно подключить имя пользователя, если есть
      text: newComment
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="comments-section container">
      <h2>Комментарии</h2>

      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <p className="comment-author">{c.name}</p>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Напишите комментарий..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
        />
        <button type="submit" className="btn">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default CourseComments;
