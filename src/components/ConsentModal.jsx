// src/components/ConsentModal.jsx
import React, { useState, useEffect } from 'react';
import '../style/ConsentModal.css';

const ConsentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Проверяем, было ли согласие
    const consentGiven = localStorage.getItem('consentGiven');
    if (!consentGiven) {
      setIsOpen(true);
    }
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
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="consent"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label htmlFor="consent">
            Да, я согласен с{' '}
            <a 
              href="/policy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="policy-link"
            >
              политикой обработки персональных данных
            </a>
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