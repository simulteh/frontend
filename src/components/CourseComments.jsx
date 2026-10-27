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
    <section className="cd-card cc-section">
      <h2>
        Комментарии <span className="cc-count">{comments.length}</span>
      </h2>

      <ul className="cc-list">
        {comments.map((c) => (
          <li key={c.id} className="cc-item">
            <span className="cc-avatar">{c.name[0]}</span>
            <div>
              <p className="cc-author">{c.name}</p>
              <p className="cc-text">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <form className="cc-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Напишите комментарий..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button type="submit" className="cd-btn cd-btn-primary" disabled={!newComment.trim()}>
          Отправить
        </button>
      </form>
    </section>
  );
};

export default CourseComments;
