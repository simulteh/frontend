import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProfile, isAdmin, errorText } from '../services/api';
import AdminVerifications from '../components/admin/AdminVerifications';
import AdminUniversities from '../components/admin/AdminUniversities';
import AdminLicenses from '../components/admin/AdminLicenses';
import '../style/Cabinet.css';
import '../style/AdminPage.css';

const TABS = [
  { id: 'verifications', label: 'Заявки на статус', component: AdminVerifications },
  { id: 'universities', label: 'Вузы', component: AdminUniversities },
  { id: 'licenses', label: 'Лицензии', component: AdminLicenses }
];

// Админ-панель: доступна только роли ADMIN (сервер тоже проверяет роль)
const AdminPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Вкладка хранится в адресе (?tab=…), чтобы не сбрасывалась при обновлении страницы
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS.find((t) => t.id === searchParams.get('tab')) || TABS[0];

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err) => {
        console.error('Ошибка загрузки профиля:', err);
        setError(errorText(err, 'Не удалось загрузить профиль'));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="lk-page">
        <div className="lk-container"><p className="lk-state">Загрузка...</p></div>
      </div>
    );
  }

  if (!isAdmin(profile)) {
    return (
      <div className="lk-page">
        <div className="lk-container">
          <h1 className="lk-title">Админ-панель</h1>
          <p className="lk-message lk-message-error">
            {error || 'Нет доступа: админ-панель доступна только администраторам'}
          </p>
          <Link to="/profile" className="lk-btn lk-btn-outline">В личный кабинет</Link>
        </div>
      </div>
    );
  }

  const TabContent = tab.component;

  return (
    <div className="lk-page">
      <div className="lk-container lk-container-wide">
        <h1 className="lk-title">Админ-панель</h1>

        <div className="ad-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === tab.id}
              className={`ad-tab ${t.id === tab.id ? 'is-active' : ''}`}
              onClick={() => setSearchParams({ tab: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>

        <TabContent key={tab.id} />
      </div>
    </div>
  );
};

export default AdminPage;
