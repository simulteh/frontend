import React, { useState, useEffect } from 'react';
import './TeacherProfilePage.css';

const TeacherProfilePage = () => {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', schedule: '' });

  const [selectedCourse, setSelectedCourse] = useState(null); // Активный курс
  const [students, setStudents] = useState([]); // Список студентов
  const [newStudent, setNewStudent] = useState({ name: '', grade: '', attendance: '' });

  useEffect(() => {
    const stored = localStorage.getItem('currentTeacher');
    if (stored) setTeacher(JSON.parse(stored));
  }, []);

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title) return;

    const course = {
      ...newCourse,
      id: Date.now()
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', description: '', schedule: '' });
  };

  const openCourseStudents = (course) => {
    setSelectedCourse(course);
    // Пока просто мок-данные
    setStudents([
      { id: 1, name: 'Иванов Иван', grade: '85', attendance: '90%' },
      { id: 2, name: 'Петров Петр', grade: '75', attendance: '80%' }
    ]);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setStudents([]);
  };

  const handleAddStudent = () => {
    if (!newStudent.name) return;
    const student = {
      ...newStudent,
      id: Date.now()
    };
    setStudents([...students, student]);
    setNewStudent({ name: '', grade: '', attendance: '' });
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleChangeStudent = (id, field, value) => {
    setStudents(
      students.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  return (
    <div className="teacher-profile">
      <div className="container">
        <h2>Личный кабинет преподавателя</h2>
        {teacher && <p>Здравствуйте, <strong>{teacher.name}</strong></p>}

        <h3>Ваши курсы</h3>
        <div className="course-list">
          {courses.map((course) => (
            <div key={course.id} className="course-card" onClick={() => openCourseStudents(course)}>
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <small>{course.schedule}</small>
            </div>
          ))}
          {courses.length === 0 && <p>Курсы пока не добавлены.</p>}
        </div>

        <h3>Добавить курс</h3>
        <form onSubmit={handleAddCourse}>
          <div className="form-group">
            <label>Название</label>
            <input
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Описание</label>
            <input
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Расписание</label>
            <input
              value={newCourse.schedule}
              onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
            />
          </div>
          <button type="submit" className="btn">Добавить курс</button>
        </form>

        {}
        {selectedCourse && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Студенты курса: {selectedCourse.title}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Оценка</th>
                    <th>Посещаемость</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>
                        <input
                          value={student.grade}
                          onChange={(e) => handleChangeStudent(student.id, 'grade', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          value={student.attendance}
                          onChange={(e) => handleChangeStudent(student.id, 'attendance', e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleDeleteStudent(student.id)}>Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4>Добавить студента</h4>
              <div className="form-inline">
                <input
                  placeholder="Имя"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <input
                  placeholder="Оценка"
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                />
                <input
                  placeholder="Посещаемость"
                  value={newStudent.attendance}
                  onChange={(e) => setNewStudent({ ...newStudent, attendance: e.target.value })}
                />
                <button onClick={handleAddStudent}>Добавить</button>
              </div>

              <button onClick={closeModal} className="btn">Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfilePage;
