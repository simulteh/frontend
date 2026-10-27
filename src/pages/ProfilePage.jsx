import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getProfile,
  getVerificationStatus,
  requestStudentStatus,
  requestTeacherStatus,
  resendConfirmation,
  logout,
  errorText,
  ROLE_LABELS
} from '../services/api';
import { isAuthenticated } from '../services/session';
import { copyText } from '../utils/copyText';
import CabinetModal from '../components/CabinetModal';
import {
  UserFilledIcon,
  LockIcon,
  CopyIcon,
  CheckIcon,
  TeacherIcon,
  UserIcon
} from '../components/CabinetIcons';
import '../style/Cabinet.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILES = ['pdf', 'jpg', 'jpeg', 'png', 'doc'];

const REQUEST_LABELS = { STUDENT: 'студента', TEACHER: 'преподавателя' };

// Поле только для чтения: данные профиля приходят с сервера и не редактируются
const LockedField = ({ label, value, onCopy, copied }) => (
  <div className="lk-field">
    <label>{label}</label>
    <div className="lk-input-wrap">
      <input type="text" value={value ?? ''} placeholder="—" readOnly />
      {onCopy ? (
        <button
          type="button"
          className="lk-input-action"
          onClick={onCopy}
          title="Скопировать"
          aria-label="Скопировать"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      ) : (
        <span className="lk-input-icon"><LockIcon /></span>
      )}
    </div>
  </div>
);

// Понятный текст ошибки заявки по HTTP-статусу
const requestErrorText = (err) => {
  switch (err.response?.status) {
    case 403: return 'Сначала подтвердите почту по ссылке из письма';
    case 409: return 'У вас уже есть заявка на рассмотрении или назначенный статус';
    case 413: return 'Файл слишком большой — максимум 5 МБ';
    case 503: return 'Не удалось отправить заявку. Попробуйте ещё раз позже';
    default: return errorText(err, 'Не удалось отправить заявку');
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [resendState, setResendState] = useState('');

  // 'student' | 'teacher' | null
  const [modal, setModal] = useState(null);
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [faculty, setFaculty] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [course, setCourse] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [modalError, setModalError] = useState('');
  const navigate = useNavigate();

  const loadProfile = useCallback(async () => {
    const data = await getProfile();
    setProfile(data);
    // Заявки нужны только пока статус не подтверждён
    setRequests(data.role === 'USER' ? await getVerificationStatus().catch(() => []) : []);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Войдите в аккаунт, чтобы открыть личный кабинет');
      setLoading(false);
      return;
    }

    loadProfile()
      .catch((err) => {
        console.error("Ошибка загрузки профиля:", err);
        setError(err.response?.status === 401
          ? 'Сессия истекла. Войдите в аккаунт снова'
          : errorText(err, 'Ошибка загрузки данных'));
      })
      .finally(() => setLoading(false));
  }, [loadProfile]);

  // Роль и статус заявки могли измениться — перечитываем без перезагрузки страницы
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProfile();
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyId = async () => {
    if (await copyText(String(profile.id))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResend = async () => {
    setResendState('sending');
    try {
      await resendConfirmation(profile.email);
      setResendState('sent');
    } catch (err) {
      console.error("Ошибка отправки письма:", err);
      setResendState('error');
    }
  };

  const openModal = (type) => {
    setFullName([profile.lastName, profile.firstName, profile.middleName].filter(Boolean).join(' '));
    setOrganization('');
    setFaculty('');
    setSpeciality('');
    setCourse('');
    setFile(null);
    setModalError('');
    setModal(type);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0] || null;
    setModalError('');
    if (selected) {
      const ext = selected.name.split('.').pop().toLowerCase();
      const problem = !ALLOWED_FILES.includes(ext)
        ? 'Подходят только файлы PDF, JPG, PNG или DOC'
        : selected.size > MAX_FILE_SIZE ? 'Файл слишком большой — максимум 5 МБ' : '';
      if (problem) {
        setModalError(problem);
        e.target.value = '';
        setFile(null);
        return;
      }
    }
    setFile(selected);
  };

  const handleSubmitRequest = async () => {
    setSending(true);
    setModalError('');
    try {
      if (modal === 'teacher') {
        await requestTeacherStatus({
          fullName: fullName.trim(),
          organization: organization.trim(),
          file
        });
      } else {
        await requestStudentStatus({
          fullName: fullName.trim(),
          faculty: faculty.trim(),
          speciality: speciality.trim(),
          course: course ? Number(course) : null
        });
      }
      setModal(null);
      await loadProfile();
    } catch (err) {
      console.error("Ошибка отправки заявки:", err);
      setModalError(requestErrorText(err));
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="lk-page">
        <div className="lk-container"><p className="lk-state">Загрузка профиля...</p></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="lk-page">
        <div className="lk-container">
          <h1 className="lk-title">Личный кабинет</h1>
          <p className="lk-message lk-message-error">{error}</p>
          <Link to="/auth" className="lk-btn lk-btn-primary">Войти</Link>
        </div>
      </div>
    );
  }

  const isUser = profile.role === 'USER';
  const lastRequest = requests[0];
  const pending = lastRequest?.status === 'PENDING';
  const canRequest = isUser && profile.emailConfirmed && !pending;

  return (
    <div className="lk-page">
      <div className="lk-container">
        <div className="lk-head">
          <h1 className="lk-title">Личный кабинет</h1>
          <button type="button" className="lk-btn lk-btn-outline" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        <div className="lk-tabs">
          <span className="lk-tab lk-tab-active">Профиль</span>
        </div>

        {!profile.emailConfirmed && (
          <div className="lk-notice lk-notice-warning">
            <div>
              <strong>Почта не подтверждена.</strong> Перейдите по ссылке из письма, которое мы
              отправили на {profile.email}. Без этого нельзя подать заявку на статус.
            </div>
            {resendState === 'sent' ? (
              <span className="lk-notice-note">Письмо отправлено, проверьте почту</span>
            ) : (
              <button
                type="button"
                className="lk-btn lk-btn-outline lk-btn-small"
                onClick={handleResend}
                disabled={resendState === 'sending'}
              >
                {resendState === 'sending' ? 'Отправка...' : 'Отправить письмо ещё раз'}
              </button>
            )}
            {resendState === 'error' && (
              <span className="lk-message lk-message-error">
                Не удалось отправить письмо, попробуйте позже
              </span>
            )}
          </div>
        )}

        <div className="lk-profile-grid">
          <div>
            <div className="lk-avatar">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Фото профиля" />
              ) : (
                <UserFilledIcon size={48} />
              )}
            </div>

            <div className="lk-role-head">
              <span className="lk-section-label">Ваша роль</span>
              {canRequest && (
                <div className="lk-role-actions">
                  <button
                    type="button"
                    className="lk-btn lk-btn-outline lk-btn-small"
                    onClick={() => openModal('student')}
                  >
                    <UserIcon size={18} />
                    Получить статус студента
                  </button>
                  <button
                    type="button"
                    className="lk-btn lk-btn-outline lk-btn-small"
                    onClick={() => openModal('teacher')}
                  >
                    <TeacherIcon size={18} />
                    Получить статус преподавателя
                  </button>
                </div>
              )}
            </div>
            <div className="lk-input-wrap">
              <input type="text" value={ROLE_LABELS[profile.role] || profile.role} readOnly />
              <span className="lk-input-icon"><LockIcon /></span>
            </div>

            {isUser && (
              <div className="lk-role-status">
                {pending ? (
                  <p className="lk-message">
                    Заявка на статус {REQUEST_LABELS[lastRequest.requestType]} на рассмотрении.
                  </p>
                ) : lastRequest?.status === 'REJECTED' ? (
                  <p className="lk-message lk-message-error">
                    Заявка на статус {REQUEST_LABELS[lastRequest.requestType]} отклонена
                    {lastRequest.comment ? `: ${lastRequest.comment}` : '.'}
                  </p>
                ) : (
                  <p className="lk-hint">
                    {profile.emailConfirmed
                      ? 'Подайте заявку на статус студента или преподавателя, чтобы пользоваться группами.'
                      : 'Подтвердите почту, чтобы подать заявку на статус студента или преподавателя.'}
                  </p>
                )}
                {pending && (
                  <button
                    type="button"
                    className="lk-btn lk-btn-outline lk-btn-small"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? 'Проверяем...' : 'Проверить статус'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <LockedField
              label="Ваш уникальный ID"
              value={profile.id}
              onCopy={profile.id != null ? handleCopyId : undefined}
              copied={copied}
            />
            <LockedField label="Фамилия" value={profile.lastName} />
            <LockedField label="Имя" value={profile.firstName} />
            <LockedField label="Отчество" value={profile.middleName} />
            <LockedField label="Почта" value={profile.email} />
          </div>
        </div>
      </div>

      {modal && (
        <CabinetModal
          title={modal === 'teacher' ? 'Заявка на статус преподавателя' : 'Заявка на статус студента'}
          submitText="Отправить"
          onClose={() => setModal(null)}
          onSubmit={handleSubmitRequest}
          loading={sending}
          error={modalError}
        >
          <div className="lk-field">
            <label htmlFor="requestFullName">ФИО</label>
            <div className="lk-input-wrap">
              <input
                id="requestFullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={255}
                required
              />
            </div>
          </div>

          {modal === 'teacher' ? (
            <>
              <div className="lk-field">
                <label htmlFor="requestOrganization">Юридическое название вуза</label>
                <div className="lk-input-wrap">
                  <input
                    id="requestOrganization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    maxLength={255}
                    required
                  />
                </div>
              </div>
              <div className="lk-field">
                <label htmlFor="requestFile">Выписка из трудовой книжки</label>
                <input
                  id="requestFile"
                  className="lk-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc"
                  onChange={handleFileChange}
                  required
                />
                <p className="lk-hint">PDF, JPG, PNG или DOC, до 5 МБ</p>
              </div>
            </>
          ) : (
            <>
              <div className="lk-field">
                <label htmlFor="requestFaculty">Факультет</label>
                <div className="lk-input-wrap">
                  <input
                    id="requestFaculty"
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    maxLength={255}
                  />
                </div>
              </div>
              <div className="lk-field">
                <label htmlFor="requestSpeciality">Специальность</label>
                <div className="lk-input-wrap">
                  <input
                    id="requestSpeciality"
                    type="text"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    maxLength={255}
                  />
                </div>
              </div>
              <div className="lk-field">
                <label htmlFor="requestCourse">Курс</label>
                <div className="lk-input-wrap">
                  <input
                    id="requestCourse"
                    type="number"
                    min="1"
                    max="6"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </CabinetModal>
      )}
    </div>
  );
};

export default ProfilePage;
