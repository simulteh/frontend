import React, { useCallback, useEffect, useState } from 'react';
import {
  adminGetVerifications,
  adminApproveVerification,
  adminRejectVerification,
  errorText
} from '../../services/api';
import CabinetModal from '../CabinetModal';
import StatusFilter from './StatusFilter';
import { STATUS_LABELS, REQUEST_TYPE_LABELS, formatDate } from './adminUtils';

const actionErrorText = (err) => {
  switch (err.response?.status) {
    case 404: return 'Заявка не найдена — возможно, её уже удалили';
    case 409: return 'Заявка уже рассмотрена другим администратором';
    default: return errorText(err, 'Не удалось выполнить действие');
  }
};

// Заявки пользователей на статус студента или преподавателя
const AdminVerifications = () => {
  const [status, setStatus] = useState('PENDING');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');

  const [rejecting, setRejecting] = useState(null);
  const [comment, setComment] = useState('');
  const [modalError, setModalError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetVerifications(status);
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
      setError(errorText(err, 'Не удалось загрузить заявки'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (item) => {
    const role = REQUEST_TYPE_LABELS[item.requestType]?.toLowerCase();
    if (!window.confirm(`Подтвердить заявку №${item.id}? Пользователь №${item.userId} получит роль «${role}».`)) return;
    setBusyId(item.id);
    setNotice('');
    try {
      await adminApproveVerification(item.id);
      setNotice(`Заявка №${item.id} подтверждена`);
      await load();
    } catch (err) {
      console.error('Ошибка подтверждения заявки:', err);
      setError(actionErrorText(err));
      if (err.response?.status === 409) load();
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (item) => {
    setRejecting(item);
    setComment('');
    setModalError('');
  };

  const handleReject = async () => {
    setBusyId(rejecting.id);
    setModalError('');
    try {
      await adminRejectVerification(rejecting.id, comment.trim());
      setNotice(`Заявка №${rejecting.id} отклонена`);
      setRejecting(null);
      await load();
    } catch (err) {
      console.error('Ошибка отклонения заявки:', err);
      setModalError(actionErrorText(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="ad-toolbar">
        <StatusFilter value={status} onChange={setStatus} />
        <button type="button" className="lk-btn lk-btn-outline lk-btn-small" onClick={load} disabled={loading}>
          Обновить
        </button>
      </div>

      {notice && <p className="lk-message lk-message-ok">{notice}</p>}
      {error && <p className="lk-message lk-message-error">{error}</p>}

      {loading ? (
        <p className="lk-state">Загрузка заявок...</p>
      ) : items.length === 0 ? (
        <p className="lk-state">{status === 'PENDING' ? 'Новых заявок нет' : 'Заявок не найдено'}</p>
      ) : (
        <div className="lk-table-wrap">
          <table className="lk-table ad-table">
            <thead>
              <tr>
                <th>№ заявки</th>
                <th>Пользователь</th>
                <th>Роль</th>
                <th>Подана</th>
                <th>Статус</th>
                <th>Решение</th>
                <th aria-label="Действия" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="lk-table-strong">{item.id}</td>
                  <td>ID {item.userId}</td>
                  <td>{REQUEST_TYPE_LABELS[item.requestType] || item.requestType}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <span className={`ad-status ad-status-${item.status?.toLowerCase()}`}>
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </td>
                  <td className="ad-cell-wrap">
                    {item.reviewedAt ? formatDate(item.reviewedAt) : '—'}
                    {item.comment && <div className="ad-comment">{item.comment}</div>}
                  </td>
                  <td>
                    {item.status === 'PENDING' && (
                      <div className="ad-row-actions">
                        <button
                          type="button"
                          className="lk-btn lk-btn-primary lk-btn-small"
                          onClick={() => handleApprove(item)}
                          disabled={busyId === item.id}
                        >
                          Подтвердить
                        </button>
                        <button
                          type="button"
                          className="lk-btn ad-btn-danger lk-btn-small"
                          onClick={() => openReject(item)}
                          disabled={busyId === item.id}
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

      {rejecting && (
        <CabinetModal
          title={`Отклонить заявку №${rejecting.id}`}
          submitText="Отклонить"
          onClose={() => setRejecting(null)}
          onSubmit={handleReject}
          loading={busyId === rejecting.id}
          error={modalError}
        >
          <div className="lk-field">
            <label htmlFor="rejectComment">Причина отказа (необязательно)</label>
            <textarea
              id="rejectComment"
              className="ad-textarea"
              rows={4}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Например: документ не читается"
              autoFocus
            />
            <p className="lk-hint">Пользователь увидит причину в личном кабинете</p>
          </div>
        </CabinetModal>
      )}
    </div>
  );
};

export default AdminVerifications;
