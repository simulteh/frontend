import React, { useCallback, useEffect, useState } from 'react';
import {
  adminGetLicenses,
  adminCreateLicense,
  adminCreateLicenseBatch,
  getUniversities,
  errorText
} from '../../services/api';
import { copyText } from '../../utils/copyText';
import CabinetModal from '../CabinetModal';
import { formatDate, downloadText } from './adminUtils';
import { CopyIcon, CheckIcon, PlusIcon } from '../CabinetIcons';

const STATE_FILTERS = [
  { value: '', label: 'Все' },
  { value: 'free', label: 'Свободные' },
  { value: 'active', label: 'Активированные' }
];

const MAX_BATCH = 1000;

// Ключ с кнопкой копирования
const LicenseKey = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (await copyText(value)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <span className="ad-key">
      <code>{value}</code>
      <button type="button" className="lk-icon-btn ad-icon-edit" onClick={handleCopy} title="Скопировать" aria-label="Скопировать ключ">
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      </button>
    </span>
  );
};

// Название вуза лицензии. Сейчас бэкенд его не отдаёт (только номер партии) —
// колонка заполнится, когда в ответе появится universityName
const universityOf = (license) => license.universityName ?? license.university?.name ?? null;

// Лицензии: список и выпуск новых ключей
const AdminLicenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const [universities, setUniversities] = useState([]);
  // 'single' | 'batch' | null
  const [creating, setCreating] = useState(null);
  const [universityId, setUniversityId] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Выпущенные ключи показываем сразу после создания
  const [issued, setIssued] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetLicenses();
      setLicenses(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки лицензий:', err);
      setError(errorText(err, 'Не удалось загрузить лицензии'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = (type) => {
    setCreating(type);
    setUniversityId('');
    setQuantity('10');
    setModalError('');
    // Список вузов нужен только для выбора в форме
    getUniversities()
      .then((data) => setUniversities(Array.isArray(data) ? data : []))
      .catch(() => setUniversities([]));
  };

  const handleCreate = async () => {
    const uniId = universityId ? Number(universityId) : null;
    setModalError('');
    if (creating === 'batch') {
      const n = Number(quantity);
      if (!Number.isInteger(n) || n < 1 || n > MAX_BATCH) {
        setModalError(`Количество — целое число от 1 до ${MAX_BATCH}`);
        return;
      }
    }
    setSaving(true);
    try {
      if (creating === 'batch') {
        const result = await adminCreateLicenseBatch(uniId, Number(quantity));
        setIssued({ title: `Партия №${result.batchId}: ${result.quantity} шт.`, keys: result.keys || [], batchId: result.batchId });
      } else {
        const result = await adminCreateLicense(uniId);
        setIssued({ title: 'Лицензия выпущена', keys: [result.licenseKey] });
      }
      setAllCopied(false);
      setCreating(null);
      await load();
    } catch (err) {
      console.error('Ошибка выпуска лицензий:', err);
      setModalError(errorText(err, 'Не удалось выпустить лицензии'));
    } finally {
      setSaving(false);
    }
  };

  const handleCopyAll = async () => {
    if (await copyText(issued.keys.join('\n'))) setAllCopied(true);
  };

  const query = search.trim().toLowerCase();
  const filtered = licenses.filter((l) => {
    if (stateFilter === 'free' && l.ownerUserId != null) return false;
    if (stateFilter === 'active' && l.ownerUserId == null) return false;
    return !query
      || l.licenseKey?.toLowerCase().includes(query)
      || String(l.ownerUserId ?? '').includes(query)
      || (universityOf(l) || '').toLowerCase().includes(query);
  });

  const activated = licenses.filter((l) => l.ownerUserId != null).length;

  return (
    <div>
      <div className="ad-stats">
        <div className="ad-stat"><span>Всего</span><strong>{licenses.length}</strong></div>
        <div className="ad-stat"><span>Активировано</span><strong>{activated}</strong></div>
        <div className="ad-stat"><span>Свободно</span><strong>{licenses.length - activated}</strong></div>
      </div>

      <div className="ad-toolbar">
        <div className="ad-toolbar-group">
          <button type="button" className="lk-btn lk-btn-primary lk-btn-small" onClick={() => openCreate('batch')}>
            <PlusIcon size={18} /> Выпустить партию
          </button>
          <button type="button" className="lk-btn lk-btn-outline lk-btn-small" onClick={() => openCreate('single')}>
            Одна лицензия
          </button>
        </div>
        <div className="ad-segmented" role="group" aria-label="Фильтр лицензий">
          {STATE_FILTERS.map((f) => (
            <button
              key={f.value || 'all'}
              type="button"
              className={stateFilter === f.value ? 'is-active' : ''}
              onClick={() => setStateFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <input
        type="search"
        className="ad-search"
        placeholder="Поиск по ключу, вузу или ID владельца"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="lk-message lk-message-error">{error}</p>}

      {loading ? (
        <p className="lk-state">Загрузка лицензий...</p>
      ) : filtered.length === 0 ? (
        <p className="lk-state">{licenses.length === 0 ? 'Лицензий пока нет' : 'Ничего не найдено'}</p>
      ) : (
        <div className="lk-table-wrap">
          <table className="lk-table ad-table">
            <thead>
              <tr>
                <th>Ключ</th>
                <th>Вуз</th>
                <th>Статус</th>
                <th>Владелец</th>
                <th>Активирована</th>
                <th>Действует до</th>
                <th>Партия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td><LicenseKey value={l.licenseKey} /></td>
                  <td className="ad-cell-wrap">{universityOf(l) || '—'}</td>
                  <td>
                    {l.ownerUserId == null ? (
                      <span className="ad-status ad-status-free">Свободна</span>
                    ) : l.active ? (
                      <span className="ad-status ad-status-approved">Активна</span>
                    ) : (
                      <span className="ad-status ad-status-rejected">Неактивна</span>
                    )}
                  </td>
                  <td>{l.ownerUserId != null ? `ID ${l.ownerUserId}` : '—'}</td>
                  <td>{formatDate(l.activatedAt)}</td>
                  <td>{formatDate(l.expiresAt)}</td>
                  <td>{l.batchId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <CabinetModal
          title={creating === 'batch' ? 'Выпустить партию лицензий' : 'Выпустить лицензию'}
          submitText="Выпустить"
          onClose={() => setCreating(null)}
          onSubmit={handleCreate}
          loading={saving}
          error={modalError}
        >
          <div className="lk-field">
            <label htmlFor="licUniversity">Вуз (необязательно)</label>
            <select
              id="licUniversity"
              className="ad-select"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
            >
              <option value="">Без привязки к вузу</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          {creating === 'batch' && (
            <div className="lk-field">
              <label htmlFor="licQuantity">Количество лицензий</label>
              <div className="lk-input-wrap">
                <input
                  id="licQuantity"
                  type="number"
                  min="1"
                  max={MAX_BATCH}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </CabinetModal>
      )}

      {issued && (
        <div className="lk-modal-overlay" onClick={() => setIssued(null)}>
          <div className="lk-modal ad-issued" onClick={(e) => e.stopPropagation()}>
            <h3>{issued.title}</h3>
            <p className="lk-hint">Скопируйте или скачайте ключи и передайте их вузу.</p>
            <pre className="ad-keys">{issued.keys.join('\n')}</pre>
            <div className="lk-modal-actions">
              <button
                type="button"
                className="lk-btn lk-btn-outline"
                onClick={() => downloadText(`licenses${issued.batchId ? `-batch-${issued.batchId}` : ''}.txt`, issued.keys.join('\n'))}
              >
                Скачать .txt
              </button>
              <button type="button" className="lk-btn lk-btn-outline" onClick={handleCopyAll}>
                {allCopied ? 'Скопировано' : 'Скопировать все'}
              </button>
              <button type="button" className="lk-btn lk-btn-primary" onClick={() => setIssued(null)}>
                Готово
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLicenses;
