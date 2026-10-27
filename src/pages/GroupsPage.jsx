import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, createGroup, errorText } from '../services/api';
import CabinetModal from '../components/CabinetModal';
import { PlusIcon, SearchIcon, UserIcon } from '../components/CabinetIcons';
import '../style/Cabinet.css';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error("Ошибка загрузки групп:", err);
      setError(err.response?.status === 403
        ? 'Группы доступны только преподавателям. Подайте заявку на статус в личном кабинете'
        : errorText(err, 'Не удалось загрузить группы'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const openModal = () => {
    setName('');
    setOrganization('');
    setModalError('');
    setModalOpen(true);
  };

  const handleCreate = async () => {
    setSaving(true);
    setModalError('');
    try {
      await createGroup(name.trim(), organization.trim());
      setModalOpen(false);
      await loadGroups();
    } catch (err) {
      console.error("Ошибка создания группы:", err);
      setModalError(errorText(err, 'Не удалось создать группу'));
    } finally {
      setSaving(false);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = groups.filter((g) =>
    `${g.name || ''} ${g.organization || ''}`.toLowerCase().includes(query)
  );

  return (
    <div className="lk-page">
      <div className="lk-container">
        <h1 className="lk-title">Группы студентов</h1>

        <button type="button" className="lk-btn lk-btn-primary" onClick={openModal}>
          Добавить группу <PlusIcon />
        </button>

        <div className="lk-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="lk-state">Загрузка групп...</p>}
        {error && <p className="lk-message lk-message-error">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="lk-state">
            {groups.length === 0 ? 'У вас пока нет групп' : 'Ничего не найдено'}
          </p>
        )}

        <div className="lk-group-list">
          {filtered.map((group) => (
            <Link key={group.id} to={`/groups/${group.id}`} className="lk-group-card">
              <div>
                <div className="lk-group-name">{group.name}</div>
                <div className="lk-group-org">{group.organization}</div>
              </div>
              <div className="lk-group-count">
                <UserIcon />
                {group.studentsCount ?? group.students?.length ?? 0}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {modalOpen && (
        <CabinetModal
          title="Новая группа"
          submitText="Добавить"
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          loading={saving}
          error={modalError}
        >
          <div className="lk-field">
            <label htmlFor="groupName">Название группы</label>
            <div className="lk-input-wrap">
              <input
                id="groupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="lk-field">
            <label htmlFor="groupOrganization">Учебное заведение</label>
            <div className="lk-input-wrap">
              <input
                id="groupOrganization"
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

export default GroupsPage;
