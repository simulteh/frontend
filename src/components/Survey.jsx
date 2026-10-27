import React, { useState, useEffect } from 'react';
import './Survey.css';

const Survey = ({ questions = [], courseId }) => {
  const [answers, setAnswers] = useState({});
  const [sent, setSent] = useState(false);

  // Загружаем сохранённые ответы из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`survey-${courseId}`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [courseId]);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setSent(false);
    localStorage.setItem(`survey-${courseId}`, JSON.stringify(newAnswers));
  };

  const handleSubmit = () => {
    setSent(true);
    console.log('Ответы пользователя:', answers);
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <section className="cd-card sv-section">
      <h2>Опрос курса</h2>
      {questions.map((q) => (
        <fieldset key={q.id} className="sv-question">
          <legend>{q.text}</legend>
          <div className="sv-options">
            {q.options.map((opt, index) => (
              <label
                key={index}
                className={`sv-option ${answers[q.id] === opt ? 'sv-option-checked' : ''}`}
              >
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
        </fieldset>
      ))}
      {questions.length > 0 && (
        <div className="sv-footer">
          <button className="cd-btn cd-btn-primary" onClick={handleSubmit} disabled={!allAnswered}>
            Отправить
          </button>
          {sent && <span className="sv-thanks">Спасибо за участие! Ваши ответы сохранены.</span>}
        </div>
      )}
    </section>
  );
};

export default Survey;
