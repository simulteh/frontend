import React,{ useState } from 'react';
import ProfileInfo from '../components/ProfileInfo';
import DownloadSection from '../components/DownloadSection';
import GradesTable from '../components/GradesTable';
import '../ProfilePage.css'; // Обновленный путь к CSS файлу

const ProfilePage = () => {

// Основные данные пользователя: имя, email, телефон
  const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const grades = [
    { level: 'Инностранный язык', text_vid: 'Без ИМ', date: '74', text: '---' },
    { level: 'Физическая культура', text_vid: 'Без ИМ', date: '44', text: '---'  },
    { level: 'Элементы высшей математики', text_vid: 'Зачет', date: '130', text: '---'  },
    { level: 'Операционные системы и реды', text_vid: 'Без ИМ', date: '104', text: '---'  },
    { level: 'Иннофрмационные технологии', text_vid: 'Экзамен', date: '100', text: '---'  },
    { level: 'Алгоритмы', text_vid: 'Без ИМ', date: '86', text: '---'  },
  ];

  //обработчик изменения любого текстового поля
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(prev => ({
        ...prev,
      }));
    }


  };
  return (
    <div className="profile">
      <h2>Личный кабинет</h2>
      <div class="fon">
         <div className="container1">
          <div className="profile-cards">
          <div className="profile-info">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше ФИО"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ваш телефон"
              />
            </div>

            <div className="profile-info">
              <p><strong>ФИО:</strong> {formData.name || '—'}</p>
              <p><strong>Телефон:</strong> {formData.phone || '—'}</p>
              <p><strong>Статус:</strong> Студент</p>
              <p><strong>Дата регистрации:</strong> 13.13.1313</p>
            </div>
         </div>
      </div>                     
        <GradesTable /> 
        
      </div>
      <div className='grades-section'> 
        <h3>Учебные курсы</h3>
        <table>
        <thead>
          <tr>
            <th>Курс</th>
            <th>Вид контроля</th>
            <th>Часы</th>
            <th>Зачетная единица</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.level}</td>
              <td>{grade.text_vid}</td>
              <td>{grade.date}</td>
              <td>{grade.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ProfilePage;