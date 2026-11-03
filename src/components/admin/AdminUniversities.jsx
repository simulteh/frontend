import React, { useCallback, useEffect, useState } from 'react';
import {
  adminGetUniversityRequests,
  adminApproveUniversityRequest,
  adminRejectUniversityRequest,
  getUniversities,
  adminCreateUniversity,
  adminUpdateUniversity,
  adminDeleteUniversity,
  errorText
} from '../../services/api';
import CabinetModal from '../CabinetModal';
import StatusFilter from './StatusFilter';
import { STATUS_LABELS, formatDate } from './adminUtils';
import { EditIcon, CloseIcon, PlusIcon } from '../CabinetIcons';

const EMPTY_FORM = { name: '', faculty: '', speciality: '', direction: '' };

const FIELDS = [
  { key: 'name', label: 'Название вуза', required: true },
  { key: 'faculty', label: 'Факультет' },
  { key: 'speciality', label: 'Специальность' },
  { key: 'direction', label: 'Направление' }
];

const actionErrorText = (err, fallback) => {
  switch (err.response?.status) {
    case 404: return 'Не найдено — обновите список';
    case 409: return errorText(err, 'Конфликт: запись уже изменена или такой вуз уже есть');
    default: return errorText(err, fallback);
  }
};

// Заявки преподавателей на добавление вуза и справочник вузов
const AdminUniversities = () => {
  const [status, setStatus] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState('');

  const [universities, setUniversities] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');

  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');

  // null — закрыто, { id: null } — новый вуз, { id } — редактирование
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const data = await adminGetUniversityRequests(status);
      setRequests(Array.isArray(data) ? data : []);
      setRequestsError('');
    } catch (err) {
      console.error('Ошибка загрузки заявок на вузы:', err);
      setRequestsError(errorText(err, 'Не удалось загрузить заявки'));
    } finally {
      setRequestsLoading(false);
    }
  }, [status]);

  const loadUniversities = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await getUniversities();
      setUniversities(Array.isArray(data) ? data : []);
      setListError('');
    } catch (err) {
      console.error('Ошибка загрузки вузов:', err);
      setListError(errorText(err, 'Не удалось загрузить список вузов'));
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  const handleRequest = async (item, approve) => {
    const question = approve
      ? `Одобрить заявку №${item.id}? Будет создан вуз «${item.universityName}».`
      : `Отклонить заявку №${item.id} на вуз «${item.universityName}»?`;
    if (!window.confirm(question)) return;
    setBusyId(`r${item.id}`);
    setNotice('');
    try {
      if (approve) {
        await adminApproveUniversityRequest(item.id);
        setNotice(`Вуз «${item.universityName}» создан`);
        loadUniversities();
      } else {
        await adminRejectUniversityRequest(item.id);
        setNotice(`Заявка №${item.id} отклонена`);
      }
      await loadRequests();
    } catch (err) {
      console.error('Ошибка обработки заявки на вуз:', err);
      setRequestsError(actionErrorText(err, 'Не удалось обработать заявку'));
    } finally {
      setBusyId(null);
    }
  };

  const openForm = (university) => {
    setForm(university
      ? FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: university[f.key] || '' }), {})
      : EMPTY_FORM);
    setModalError('');
    setEditing(university ? { id: university.id } : { id: null });
  };

  const handleSave = async () => {
    const fields = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    setSaving(true);
    setModalError('');
    try {
      if (editing.id) {
        await adminUpdateUniversity(editing.id, fields);
        setNotice(`Вуз «${fields.name}» сохранён`);
      } else {
        await adminCreateUniversity(fields);
        setNotice(`Вуз «${fields.name}» добавлен`);
      }
      setEditing(null);
      await loadUniversities();
    } catch (err) {
      console.error('Ошибка сохранения вуза:', err);
      setModalError(actionErrorText(err, 'Не удалось сохранить вуз'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (university) => {
    if (!window.confirm(`Удалить вуз «${university.name}»? Это действие нельзя отменить.`)) return;
    setBusyId(`u${university.id}`);
    setNotice('');
    try {
      await adminDeleteUniversity(university.id);
      setNotice(`Вуз «${university.name}» удалён`);
      await loadUniversities();
    } catch (err) {
      console.error('Ошибка удаления вуза:', err);
      setListError(actionErrorText(err, 'Не удалось удалить вуз'));
    } finally {
      setBusyId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = universities.filter((u) =>
    [u.name, u.faculty, u.speciality, u.direction].join(' ').toLowerCase().includes(query)
  );

  return (
    <div>
      {notice && <p className="lk-message lk-message-ok">{notice}</p>}

      {/* Заявки на добавление вуза */}
      <section className="ad-block">
        <div className="ad-block-head">
          <h2>Заявки на добавление вуза</h2>
          <StatusFilter value={status} onChange={setStatus} />
        </div>
        {requestsError && <p className="lk-message lk-message-error">{requestsError}</p>}
        {requestsLoading ? (
          <p className="lk-state">Загрузка заявок...</p>
        ) : requests.length === 0 ? (
          <p className="lk-state">{status === 'PENDING' ? 'Новых заявок нет' : 'Заявок не найдено'}</p>
        ) : (
          <div className="lk-table-wrap">
            <table className="lk-table ad-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Вуз</th>
                  <th>Факультет, специальность, направление</th>
                  <th>Преподаватель</th>
                  <th>Подана</th>
                  <th>Статус</th>
                  <th aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item.id}>
                    <td className="lk-table-strong">{item.id}</td>
                    <td className="ad-cell-wrap lk-table-strong">{item.universityName}</td>
                    <td className="ad-cell-wrap ad-details">
                      {[item.faculty, item.speciality, item.direction].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td>ID {item.teacherId}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <span className={`ad-status ad-status-${item.status?.toLowerCase()}`}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'PENDING' && (
                        <div className="ad-row-actions">
                          <button
                            type="button"
                            className="lk-btn lk-btn-primary lk-btn-small"
                            onClick={() => handleRequest(item, true)}
                            disabled={busyId === `r${item.id}`}
                          >
                            Одобрить
                          </button>
                          <button
                            type="button"
                            className="lk-btn ad-btn-danger lk-btn-small"
                            onClick={() => handleRequest(item, false)}
                            disabled={busyId === `r${item.id}`}
                          >
                            Отклонить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Справочник вузов */}
      <section className="ad-block">
        <div className="ad-block-head">
          <h2>Вузы <span className="ad-count">{universities.length}</span></h2>
          <button type="button" className="lk-btn lk-btn-primary lk-btn-small" onClick={() => openForm(null)}>
            <PlusIcon size={18} /> Добавить вуз
          </button>
        </div>
        <input
          type="search"
          className="ad-search"
          placeholder="Поиск по названию, факультету, специальности"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {listError && <p className="lk-message lk-message-error">{listError}</p>}
        {listLoading ? (
          <p className="lk-state">Загрузка вузов...</p>
        ) : filtered.length === 0 ? (
          <p className="lk-state">{universities.length === 0 ? 'Вузов пока нет' : 'Ничего не найдено'}</p>
        ) : (
          <div className="lk-table-wrap">
            <table className="lk-table ad-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Факультет</th>
                  <th>Специальность</th>
                  <th>Направление</th>
                  <th aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="ad-cell-wrap lk-table-strong">{u.name}</td>
                    <td className="ad-cell-wrap">{u.faculty || '—'}</td>
                    <td className="ad-cell-wrap">{u.speciality || '—'}</td>
                    <td className="ad-cell-wrap">{u.direction || '—'}</td>
                    <td>
                      <div className="ad-row-actions">
                        <button
                          type="button"
                          className="lk-icon-btn ad-icon-edit"
                          onClick={() => openForm(u)}
                          title="Изменить"
                          aria-label={`Изменить ${u.name}`}
                        >
                          <EditIcon size={18} />
                        </button>
                        <button
                          type="button"
                          className="lk-icon-btn"
                          onClick={() => handleDelete(u)}
                          disabled={busyId === `u${u.id}`}
                          title="Удалить"
                          aria-label={`Удалить ${u.name}`}
                        >
                          <CloseIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <CabinetModal
          title={editing.id ? 'Изменить вуз' : 'Новый вуз'}
          submitText={editing.id ? 'Сохранить' : 'Добавить'}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
          loading={saving}
          error={modalError}
        >
          {FIELDS.map((f, i) => (
            <div className="lk-field" key={f.key}>
              <label htmlFor={`uni-${f.key}`}>{f.label}{f.required ? '' : ' (необязательно)'}</label>
              <div className="lk-input-wrap">
                <input
                  id={`uni-${f.key}`}
                  type="text"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  maxLength={255}
                  autoFocus={i === 0}
                />
              </div>
            </div>
          ))}
        </CabinetModal>
      )}
    </div>
  );
};

export default AdminUniversities;
