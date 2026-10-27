import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getGroup,
  updateGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  errorText
} from '../services/api';
import { copyText } from '../utils/copyText';
import { LEVELS, scoreAt, averageScore } from '../utils/levels';
import CabinetModal from '../components/CabinetModal';
import {
  BackIcon,
  UserIcon,
  UserPlusIcon,
  LinkIcon,
  EditIcon,
  CheckIcon,
  CloseIcon
} from '../components/CabinetIcons';
import '../style/Cabinet.css';

const studentName = (student) => [student.lastName, student.firstName].filter(Boolean).join(' ');

const GroupDetailPage = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // 'student' | 'edit' | null
  const [modal, setModal] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadGroup = useCallback(async () => {
    try {
      setGroup(await getGroup(id));
      setError('');
    } catch (err) {
      console.error("Ошибка загрузки группы:", err);
      setError(errorText(err, 'Не удалось загрузить группу'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const openStudentModal = () => {
    setStudentId('');
    setModalError('');
    setModal('student');
  };

  const openEditModal = () => {
    setName(group.name || '');
    setOrganization(group.organization || '');
    setModalError('');
    setModal('edit');
  };

  const handleAddStudent = async () => {
    if (!/^\d+$/.test(studentId.trim())) {
      setModalError('ID состоит только из цифр — его можно скопировать в личном кабинете студента');
      return;
    }
    setSaving(true);
    setModalError('');
    try {
      await addStudentToGroup(id, studentId.trim());
      setModal(null);
      await loadGroup();
    } catch (err) {
      console.error("Ошибка добавления студента:", err);
      const status = err.response?.status;
      setModalError(
        status === 404 ? 'Пользователь с таким ID не найден'
          : status === 409 ? 'У этого пользователя нет статуса студента — добавить можно только студентов'
            : errorText(err, 'Не удалось добавить студента. Проверьте ID')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    setSaving(true);
    setModalError('');
    try {
      await updateGroup(id, name.trim(), organization.trim());
      setModal(null);
      await loadGroup();
    } catch (err) {
      console.error("Ошибка сохранения группы:", err);
      setModalError(errorText(err, 'Не удалось сохранить изменения'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveStudent = async (student) => {
    if (!window.confirm(`Удалить студента ${studentName(student)} из группы?`)) return;
    try {
      await removeStudentFromGroup(id, student.id);
      await loadGroup();
    } catch (err) {
      console.error("Ошибка удаления студента:", err);
      setError(errorText(err, 'Не удалось удалить студента'));
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/join/${group.inviteCode}`;
    if (await copyText(link)) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const students = [...(group?.students || [])].sort((a, b) =>
    studentName(a).localeCompare(studentName(b), 'ru')
  );

  if (loading) {
    return (
      <div className="lk-page">
        <div className="lk-container"><p className="lk-state">Загрузка группы...</p></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="lk-page">
        <div className="lk-container">
          <p className="lk-message lk-message-error">{error}</p>
          <Link to="/groups" className="lk-btn lk-btn-outline">К списку групп</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="lk-page">
      <div className="lk-container lk-container-wide">
        <div className="lk-group-head">
          <Link to="/groups" className="lk-back" aria-label="К списку групп">
            <BackIcon size={28} />
          </Link>
          <div>
            <h1 className="lk-title">{group.name}</h1>
            <div className="lk-group-subtitle">
              {[group.organization, `студентов: ${students.length}`].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>

        <div className="lk-actions">
          <button type="button" className="lk-btn lk-btn-primary" onClick={openStudentModal}>
            <UserPlusIcon /> Добавить студента
          </button>
          <button type="button" className="lk-btn lk-btn-outline" onClick={handleCopyLink}>
            {linkCopied ? <CheckIcon /> : <LinkIcon />}
            {linkCopied ? 'Ссылка скопирована' : 'Копировать ссылку для приглашения'}
          </button>
          <button type="button" className="lk-btn lk-btn-outline" onClick={openEditModal}>
            <EditIcon /> Редактировать группу
          </button>
        </div>

        {error && <p className="lk-message lk-message-error">{error}</p>}

        {students.length === 0 ? (
          <p className="lk-state">В группе пока нет студентов</p>
        ) : (
          <div className="lk-table-wrap">
            <table className="lk-table">
              <thead>
                <tr>
                  <th>Фамилия</th>
                  {LEVELS.map((level) => (
                    <th key={level}>{level}</th>
                  ))}
                  <th>Средний балл</th>
                  <th aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="lk-student">
                        <span className="lk-student-avatar"><UserIcon /></span>
                        {studentName(student)}
                      </div>
                    </td>
                    {LEVELS.map((level, index) => (
                      <td key={level}>{scoreAt(student.scores, index) ?? '—'}</td>
                    ))}
                    <td className="lk-table-strong">{averageScore(student.scores) ?? '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="lk-icon-btn"
                        onClick={() => handleRemoveStudent(student)}
                        title="Удалить из группы"
                        aria-label={`Удалить ${studentName(student)} из группы`}
                      >
                        <CloseIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === 'student' && (
        <CabinetModal
          title="Добавить студента"
          submitText="Добавить"
          onClose={() => setModal(null)}
          onSubmit={handleAddStudent}
          loading={saving}
          error={modalError}
        >
          <div className="lk-field">
            <label htmlFor="studentId">Уникальный ID студента</label>
            <div className="lk-input-wrap">
              <input
                id="studentId"
                type="text"
                placeholder="Введите ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                autoFocus
              />
            </div>
            <p className="lk-hint">Студент может скопировать свой ID в личном кабинете</p>
          </div>
        </CabinetModal>
      )}

      {modal === 'edit' && (
        <CabinetModal
          title="Редактировать группу"
          submitText="Сохранить"
          onClose={() => setModal(null)}
          onSubmit={handleEdit}
          loading={saving}
          error={modalError}
        >
          <div className="lk-field">
            <label htmlFor="editGroupName">Название группы</label>
            <div className="lk-input-wrap">
              <input
                id="editGroupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="lk-field">
            <label htmlFor="editGroupOrganization">Учебное заведение</label>
            <div className="lk-input-wrap">
              <input
                id="editGroupOrganization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
          </div>
        </CabinetModal>
      )}
    </div>
  );
};

export default GroupDetailPage;
