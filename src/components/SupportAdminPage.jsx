
import React, { useState } from 'react';
import '../style/SupportAdminPage.css';

const SupportAdminPage = () => {
  const [tickets, setTickets] = useState([
    { id: 1, user: 'Иван Иванов', email: 'ivan@example.com', subject: 'Проблема с авторизацией', message: 'Не могу войти в систему.' },
    { id: 2, user: 'Анна Петрова', email: 'anna@example.com', subject: 'Вопрос по тарифу', message: 'Подскажите по тарифам.' },
    { id: 3, user: 'Сергей Сидоров', email: 'sergey@example.com', subject: 'Ошибка в приложении', message: 'Приложение выдает ошибку.' },
  ]);

  const [showReplyModal, setShowReplyModal] = useState(null);


  const handleReplyClick = (ticketId) => {
    setShowReplyModal(ticketId);
  };

  const handleCloseModal = () => {
    setShowReplyModal(null);
  };

  const handleSendReply = () => {
    // Здесь нужно добавить логику отправки ответа на сервер
    console.log('Ответ отправлен!');
    handleCloseModal();
  };


  return (
    <div className="support-admin-page">
      <h1>Панель администратора поддержки</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пользователь</th>
            <th>Email</th>
            <th>Тема</th>
            <th>Сообщение</th>
            <th>Ответить</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.user}</td>
              <td>{ticket.email}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.message}</td>
              <td><button onClick={() => handleReplyClick(ticket.id)}>Ответить</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showReplyModal && (
        <div className="reply-modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h2>Ответить пользователю</h2>
            <textarea placeholder="Напишите ваш ответ..." />
            <button onClick={handleSendReply}>Отправить</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportAdminPage;
