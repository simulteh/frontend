// Импорт React и CSS-файла со стилями
import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  // Хранит загруженную аватарку (в виде временной ссылки на файл)
  const [image, setImage] = useState(null);

  // Флаг режима редактирования (true = редактируем)
  const [isEditing, setIsEditing] = useState(false);

  // Основные данные пользователя: имя, email, телефон
  // Эти данные хранятся в состоянии компонента и теряются после перезагрузки страницы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Обработка выбора файла аватарки
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // создаём ссылку на файл
      setImage(imageUrl); // сохраняем в состояние
    }
  };

  // Универсальный обработчик изменения любого текстового поля
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Функция форматирования номера телефона (применяется при выходе из режима редактирования)
  const formatPhoneNumber = (rawPhone) => {
    let phone = rawPhone.replace(/\D/g, ''); // убираем всё кроме цифр

    // если номер начинается с 8 и длина 11 — заменяем на +7
    if (phone.length === 11 && phone.startsWith('8')) {
      phone = '7' + phone.slice(1);
    }

    // если начинается с 7 и 11 цифр — форматируем красиво
    if (phone.length === 11 && phone.startsWith('7')) {
      return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
    }

    // если пользователь ввёл "+7..." сразу
    if (rawPhone.startsWith('+7') && phone.length === 11) {
      return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
    }

    // если формат странный — возвращаем как есть
    return rawPhone;
  };

  // Кнопка "Редактировать" или "Сохранить"
  const handleEditToggle = () => {
    // Если выходим из режима редактирования, форматируем номер
    if (isEditing) {
      setFormData(prev => ({
        ...prev,
        phone: formatPhoneNumber(prev.phone)
      }));
    }

    // Переключаем режим
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Личный кабинет</h1>

      <div className="profile-cards">
        {/* --- КАРТОЧКА 1: Профиль --- */}
        <div className="card profile-card">
          <label className="profile-image-label">
            {/* Если есть аватар — показываем его, иначе — круг-заглушку */}
            {image ? (
              <img src={image} alt="User avatar" className="profile-image" />
            ) : (
              <div className="profile-placeholder">Фото</div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>

          {/* Если включён режим редактирования */}
          {isEditing ? (
            <div className="profile-info">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Имя"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (___) ___-__-__"
              />
            </div>
          ) : (
            // Если не редактируем — отображаем данные
            <div className="profile-info">
              <p><strong>Имя:</strong> {formData.name || '—'}</p>
              <p><strong>Email:</strong> {formData.email || '—'}</p>
              <p><strong>Телефон:</strong> {formData.phone || '—'}</p>
              <p><strong>Статус:</strong> Пользователь</p>
              <p><strong>Дата регистрации:</strong> 12.04.2024</p>
            </div>
          )}

          {/* Кнопка Редактировать / Сохранить */}
          <button className="edit-button" onClick={handleEditToggle}>
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </button>
        </div>

        {/* --- КАРТОЧКА 2: Пройденные курсы --- */}
        <div className="card scrollable-card">
          <h3>Пройденные курсы</h3>
          <p className="placeholder-text">Пока нет задач</p>
        </div>

        {/* --- КАРТОЧКА 3: Предстоящие курсы --- */}
        <div className="card scrollable-card">
          <h3>Следующие курсы</h3>
          <p className="placeholder-text">Пока нет задач</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
