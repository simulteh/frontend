import React, { useEffect } from 'react';

const CabinetModal = ({ title, onClose, onSubmit, submitText, loading, error, children }) => {
  // Закрытие по Esc
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="lk-modal-overlay" onClick={onClose}>
      <form
        className="lk-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <h3>{title}</h3>
        {children}
        {error && <p className="lk-message lk-message-error">{error}</p>}
        <div className="lk-modal-actions">
          <button type="button" className="lk-btn lk-btn-outline" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="lk-btn lk-btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CabinetModal;
