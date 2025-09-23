// src/components/ConsentModal.jsx
import React, { useState, useEffect } from 'react';
import '../style/ConsentModal.css';

const ConsentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [policyText, setPolicyText] = useState('');

  useEffect(() => {
    // Проверяем, было ли согласие
    const consentGiven = localStorage.getItem('consentGiven');
    if (!consentGiven) {
      setIsOpen(true);
    }

    // Загружаем текст политики из public/policy.txt
    fetch('/policy.txt')
      .then((res) => res.text())
      .then((text) => setPolicyText(text))
      .catch((err) => console.error('Ошибка загрузки политики:', err));
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('consentGiven', 'true');
      setIsOpen(false);
    } else {
      alert('Нужно ваше согласие для дальнейшей навигации по сайту.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Политика обработки персональных данных</h2>
        <div className="policy-text">
          {policyText ? (
            <pre>{policyText}</pre>
          ) : (
            <p>Загрузка политики...</p>
          )}
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="consent"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label htmlFor="consent">
            Да, я согласен с политикой обработки персональных данных
          </label>
        </div>

        <button onClick={handleAccept} className="btn">
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;
