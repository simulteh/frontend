import React from "react";
import comment from "../style/Comments.css"
// Функция форматирует дату
function formatDate(dateString) {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
}


export const Comments= ()=> {
  const comments = [
  {
    author: "Иван Иванов",
    date: "2023-10-01",
    text: "Мне нравится эта статья!"
  },
  {
    author: "Мария Петрова",
    date: "2023-10-02",
    text: "Полезная информация, спасибо!"
  },
  {
    author: "Анна Смирнова",
    date: "2023-10-03",
    text: "Хотелось бы подробнее узнать о теме."
  }
];
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500">Комментариев пока нет.</p>;
  }

  return (
    <div className="comments-container">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-card">
          <div className="flex justify-between items-center mb-2">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-date">{formatDate(comment.date)}</span>
          </div>
          <p className="comment-text">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
