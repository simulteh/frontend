import React from 'react';

const TeacherProfileForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Изменения сохранены!');
  };

  return (
    <div className="profile-info">
      <h3>Изменить личные данные</h3>
      <form id="teacherProfileForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="university">ВУЗ</label>
          <input type="text" id="university" name="university" required />
        </div>
        <div className="form-group">
          <label htmlFor="groups">Группы</label>
          <input type="text" id="groups" name="groups" required />
        </div>
        <div className="form-group">
          <label htmlFor="students">Студенты</label>
          <input type="text" id="students" name="students" required />
        </div>
        <button type="submit" className="btn">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default TeacherProfileForm;