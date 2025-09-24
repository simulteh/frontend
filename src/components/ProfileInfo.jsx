import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/ProfileInfo.css';

const API_URL = "http://212.67.12.82:8080"; 

const ProfileInfo = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Загружаем профиль
  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/profile/me?token=${token}`)

      console.log(res);

      setUser({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        middleName: res.data.middleName || '',
        email: res.data.email || '',
        password: ''
      });
    } catch (err) {
      console.error("Ошибка загрузки профиля:", err);
      setMessage('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [navigate]);

  // Сохранение изменений
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName
      };
      if (user.password) payload.password = user.password;

      await axios.put(`${API_URL}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Изменения сохранены!');
      setUser({ ...user, password: '' });
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setMessage('Не удалось сохранить изменения');
    }
  };

  // Выход
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/auth');
  };

  if (loading) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div className="profile-info">
      <h3>Личный кабинет</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Фамилия</label>
          <input
            type="text"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Отчество</label>
          <input
            type="text"
            value={user.middleName}
            onChange={(e) => setUser({ ...user, middleName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email (нельзя изменить)</label>
          <input type="email" value={user.email} disabled />
        </div>
        <div className="form-group">
          <label>Новый пароль</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn">Сохранить изменения</button>
      </form>

      {message && <p className="message">{message}</p>}

      <hr />
      <button onClick={handleLogout} className="btn logout-btn">Выйти</button>
    </div>
  );
};

export default ProfileInfo;
