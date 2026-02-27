// src/components/ConsentModal.jsx
import React, { useState, useEffect } from 'react';
import '../style/ConsentModal.css';

const ConsentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('consentGiven');
    if (!consentGiven) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden'; // блокируем скролл
    }
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('consentGiven', 'true');
      document.body.style.overflow = 'auto';
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">
          Политика обработки персональных данных
        </h2>

        <div className="checkbox-group">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <span className="checkmark"></span>

            <span className="checkbox-text">
              Да, я согласен с{' '}
              <a
                href="/policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="policy-link"
              >
                политикой обработки персональных данных
              </a>
            </span>
          </label>
        </div>

        <button
          onClick={handleAccept}
          className="btn"
          disabled={!isChecked}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;