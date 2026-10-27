import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { joinGroup, errorText } from '../services/api';
import '../style/Cabinet.css';

const teacherName = (teacher) =>
  [teacher?.lastName, teacher?.firstName, teacher?.middleName].filter(Boolean).join(' ');

const joinErrorText = (err) => {
  switch (err.response?.status) {
    case 403: return 'Вступить в группу можно только со статусом студента. Подайте заявку в личном кабинете';
    case 404: return 'Группа не найдена — проверьте ссылку-приглашение';
    case 409: return 'Эта группа относится к другому учебному заведению';
    default: return errorText(err, 'Не удалось вступить в группу');
  }
};

// Страница, на которую ведёт ссылка-приглашение в группу.
// Вступление — только по кнопке: открытие ссылки само ничего не меняет
const JoinGroupPage = () => {
  const { code } = useParams();
  const [group, setGroup] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setJoining(true);
    setError('');
    try {
      setGroup(await joinGroup(code));
    } catch (err) {
      console.error("Ошибка вступления в группу:", err);
      setError(joinErrorText(err));
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="lk-page">
      <div className="lk-container">
        <h1 className="lk-title">Приглашение в группу</h1>

        {group ? (
          <>
            <p className="lk-message lk-message-ok">Вы вступили в группу</p>
            <div className="lk-group-card lk-group-card-static lk-join-card">
              <div>
                <div className="lk-group-name">{group.name}</div>
                <div className="lk-group-org">{group.organization}</div>
              </div>
              <div className="lk-teacher">
                <span>Преподаватель</span>
                {teacherName(group.teacher) || '—'}
              </div>
            </div>
            <Link to="/grades" className="lk-btn lk-btn-primary">Мои оценки</Link>
          </>
        ) : (
          <>
            <p className="lk-state">
              Преподаватель пригласил вас в учебную группу. После вступления он будет
              видеть ваши результаты в игре.
            </p>
            {error && <p className="lk-message lk-message-error">{error}</p>}
            <div className="lk-actions">
              <button
                type="button"
                className="lk-btn lk-btn-primary"
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? 'Вступаем...' : 'Вступить в группу'}
              </button>
              <Link to="/profile" className="lk-btn lk-btn-outline">В личный кабинет</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinGroupPage;
