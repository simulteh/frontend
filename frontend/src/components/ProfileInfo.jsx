import React from 'react';
import '../style/ProfileInfo.css';

const ProfileInfo = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Изменения сохранены!');
  };

  return (
    <div className="profile-info">
      <h3>Изменить личные данные</h3>
      <form id="profileForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Изменить пароль</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="btn">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default ProfileInfo;