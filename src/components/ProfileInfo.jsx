import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/ProfileInfo.css';

const API_URL = "http://localhost:8080";

const ProfileInfo = () => {
  const [user, setUser] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Загружаем профиль при монтировании
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUser({
          username: res.data.firstName || '',
          password: ''
        });
      })
      .catch((err) => {
        console.error("Ошибка загрузки профиля:", err);
        setMessage('Ошибка загрузки данных');
      })
      .finally(() => setLoading(false));
  }, []);

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `${API_URL}/auth/profile`,
        { username: user.username, password: user.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Изменения сохранены!');
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setMessage('Не удалось сохранить изменения');
    }
  };

  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/auth'; // редирект на страницу авторизации
  };

  if (loading) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div className="profile-info">
      <h3>Изменить личные данные</h3>
      <form id="profileForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Изменить пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <button type="submit" className="btn">Сохранить изменения</button>
      </form>

      {message && <p className="message">{message}</p>}

      <hr />
      <button onClick={handleLogout} className="btn logout-btn">
        Выйти
      </button>
    </div>
  );
};

export default ProfileInfo;
