import React, { useState } from 'react';
import '../style/SupportAdminPage.css';

const SupportAdminPage = () => {
  const [tickets, setTickets] = useState([
    { 
      id: 1, 
      user: 'Иван Иванов', 
      email: 'ivan@example.com', 
      subject: 'Проблема с авторизацией', 
      message: 'Не могу войти в систему, хотя ввожу правильные данные. Получаю ошибку 401.', 
      status: 'new',
      date: '15.05.2023 14:30'
    },
    { 
      id: 2, 
      user: 'Анна Петрова', 
      email: 'anna@example.com', 
      subject: 'Вопрос по тарифу', 
      message: 'Подскажите, какие возможности предоставляет премиум тариф? Есть ли пробный период?', 
      status: 'in-progress',
      date: '16.05.2023 10:15'
    },
    { 
      id: 3, 
      user: 'Сергей Сидоров', 
      email: 'sergey@example.com', 
      subject: 'Ошибка в приложении', 
      message: 'Приложение выдает ошибку при попытке создать новую лабораторную работу. Код ошибки: ERR_502.', 
      status: 'resolved',
      date: '14.05.2023 16:45'
    },
  ]);

  const [showReplyModal, setShowReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleReplyClick = (ticketId) => {
    setShowReplyModal(ticketId);
    setReplyText('');
  };

  const handleCloseModal = () => {
    setShowReplyModal(null);
    setReplyText('');
  };

  const handleSendReply = () => {
    // Здесь нужно добавить логику отправки ответа на сервер
    console.log('Ответ отправлен!', replyText);
    
    // Обновляем статус тикета на "отвечено"
    setTickets(tickets.map(ticket => 
      ticket.id === showReplyModal ? {...ticket, status: 'resolved'} : ticket
    ));
    
    handleCloseModal();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'new': 'badge-new',
      'in-progress': 'badge-progress',
      'resolved': 'badge-resolved'
    };
    
    const statusText = {
      'new': 'Новый',
      'in-progress': 'В работе',
      'resolved': 'Решено'
    };
    
    return <span className={`badge ${statusClasses[status]}`}>{statusText[status]}</span>;
  };

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filterStatus);

  return (
    <div className="support-admin">
      <div className="support-admin__header">
        <h1 className="support-admin__title">Панель администратора поддержки</h1>
        <div className="support-admin__filters">
          <span>Фильтр: </span>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="support-admin__filter"
          >
            <option value="all">Все обращения</option>
            <option value="new">Новые</option>
            <option value="in-progress">В работе</option>
            <option value="resolved">Решенные</option>
          </select>
        </div>
      </div>
      
      <div className="support-admin__table-container">
        <table className="support-admin__table">
          <thead className="support-admin__thead">
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Тема</th>
              <th>Сообщение</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody className="support-admin__tbody">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="support-admin__row">
                <td className="support-admin__cell">{ticket.id}</td>
                <td className="support-admin__cell">{ticket.user}</td>
                <td className="support-admin__cell">{ticket.email}</td>
                <td className="support-admin__cell">{ticket.subject}</td>
                <td className="support-admin__cell support-admin__message">
                  {ticket.message}
                </td>
                <td className="support-admin__cell">
                  {getStatusBadge(ticket.status)}
                </td>
                <td className="support-admin__cell">{ticket.date}</td>
                <td className="support-admin__cell">
                  <button 
                    className="support-admin__button btn"
                    onClick={() => handleReplyClick(ticket.id)}
                  >
                    Ответить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showReplyModal && (
        <div className="support-admin__modal">
          <div className="support-admin__modal-content">
            <span 
              className="support-admin__modal-close"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2 className="support-admin__modal-title">Ответить пользователю</h2>
            <textarea 
              className="support-admin__modal-textarea"
              placeholder="Напишите ваш ответ..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="support-admin__modal-actions">
              <button 
                className="support-admin__modal-cancel btn btn--secondary"
                onClick={handleCloseModal}
              >
                Отмена
              </button>
              <button 
                className="support-admin__modal-send btn"
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportAdminPage;