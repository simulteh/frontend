import React, { useState, useEffect } from 'react';
import './Survey.css';

const Survey = ({ questions = [], courseId }) => {
  const [answers, setAnswers] = useState({});

  // Загружаем сохранённые ответы из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`survey-${courseId}`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [courseId]);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    localStorage.setItem(`survey-${courseId}`, JSON.stringify(newAnswers));
  };

  const handleSubmit = () => {
    alert('Спасибо за участие! Ваши ответы сохранены.');
    console.log('Ответы пользователя:', answers);
  };

  return (
    <div className="survey">
      <h3>Опрос курса</h3>
      {questions.map((q) => (
        <div key={q.id} className="survey-question">
          <p className="question-text">{q.text}</p>
          <div className="survey-options">
            {q.options.map((opt, index) => (
              <label key={index} className="survey-option">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswer(q.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      {questions.length > 0 && (
        <button className="survey-submit" onClick={handleSubmit}>
          Отправить
        </button>
      )}
    </div>
  );
};

export default Survey;
