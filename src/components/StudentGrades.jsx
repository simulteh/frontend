import React, { useEffect, useState } from 'react';
import { getMyGroups, getMyScores, errorText } from '../services/api';
import { LEVELS, MAX_SCORE, scoreAt, averageScore, passedCount } from '../utils/levels';

const teacherName = (teacher) =>
  [teacher?.lastName, teacher?.firstName, teacher?.middleName].filter(Boolean).join(' ');

// Группы студента с преподавателями и его оценки за уровни игры
const StudentGrades = () => {
  const [groups, setGroups] = useState([]);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupsError, setGroupsError] = useState('');
  const [scoresError, setScoresError] = useState('');

  useEffect(() => {
    const loadGroups = getMyGroups()
      .then((data) => setGroups(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Ошибка загрузки групп:", err);
        setGroupsError(err.response?.status === 403
          ? 'Группы доступны после подтверждения статуса студента — подайте заявку в личном кабинете'
          : errorText(err, 'Не удалось загрузить группы'));
      });

    const loadScores = getMyScores()
      .then(setScores)
      .catch((err) => {
        console.error("Ошибка загрузки оценок:", err);
        setScoresError(errorText(err, 'Не удалось загрузить оценки'));
      });

    Promise.all([loadGroups, loadScores]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="lk-state">Загрузка оценок...</p>;

  const average = averageScore(scores);
  const passed = passedCount(scores);

  return (
    <div>
      <h2 className="lk-subtitle">Моя группа</h2>
      {groupsError && <p className="lk-message lk-message-error">{groupsError}</p>}
      {!groupsError && groups.length === 0 && (
        <p className="lk-state">
          Вы пока не состоите в группе. Передайте преподавателю ваш уникальный ID
          из личного кабинета или перейдите по его ссылке-приглашению.
        </p>
      )}
      <div className="lk-group-list">
        {groups.map((group) => (
          <div key={group.id} className="lk-group-card lk-group-card-static">
            <div>
              <div className="lk-group-name">{group.name}</div>
              <div className="lk-group-org">{group.organization}</div>
            </div>
            <div className="lk-teacher">
              <span>Преподаватель</span>
              {teacherName(group.teacher) || '—'}
            </div>
          </div>
        ))}
      </div>

      <h2 className="lk-subtitle">Оценки за уровни</h2>
      {scoresError ? (
        <p className="lk-message lk-message-error">{scoresError}</p>
      ) : (
        <>
          <div className="lk-stats">
            <div className="lk-stat">
              <div className="lk-stat-label">Пройдено уровней</div>
              <div className="lk-stat-value">
                {passed} <span>из {LEVELS.length}</span>
              </div>
              <div className="lk-bar">
                <div style={{ width: `${(passed / LEVELS.length) * 100}%` }} />
              </div>
            </div>
            <div className="lk-stat">
              <div className="lk-stat-label">Средний балл</div>
              <div className="lk-stat-value">
                {average ?? '—'} <span>из {MAX_SCORE}</span>
              </div>
              <div className="lk-bar">
                <div style={{ width: `${((average ?? 0) / MAX_SCORE) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="lk-grade-list">
            {LEVELS.map((level, index) => {
              const score = scoreAt(scores, index);
              const done = score !== null;
              return (
                <div key={level} className={`lk-grade ${done ? '' : 'lk-grade-empty'}`}>
                  <div className="lk-grade-name">{level}</div>
                  <div className="lk-bar">
                    <div style={{ width: `${done ? (Number(score) / MAX_SCORE) * 100 : 0}%` }} />
                  </div>
                  <div className="lk-grade-score">
                    {done ? <>{score} <span>/ {MAX_SCORE}</span></> : <span>не пройден</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentGrades;
