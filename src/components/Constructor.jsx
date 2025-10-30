import React, { useState } from 'react';
import './Constructor.css';

const Constructor = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setOutputText('Введите название дисциплины!');
      return;
    }

    setLoading(true);
    setOutputText('');

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: inputValue })
      });
      
      const data = await response.json();
      const books = data.books;
      
      let resultText = '';
      books.forEach((book, index) => {
        resultText += `${index + 1}. Автор: ${book.Автор}\n   Название: ${book.Название}\n\n`;
      });
      
      setOutputText(resultText);
    } catch (error) {
      console.error('Ошибка запроса:', error);
      setOutputText('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="constructor-container">
      <div className="constructor-header">
        <h2>Умный конструктор</h2>
        <p>Введите название дисциплины для получения списка литературы</p>
      </div>

      <div className="constructor-input-section">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Название дисциплины"
            className="constructor-input"
            disabled={loading}
          />
          <button 
            onClick={handleSubmit} 
            className="constructor-btn"
            disabled={loading}
          >
            {loading ? '⏳ Загрузка...' : '🚀 Отправить'}
          </button>
        </div>
      </div>

      <div className="constructor-output-section">
        <h3>📚 Список литературы</h3>
        <textarea 
          value={outputText} 
          readOnly 
          className="constructor-output"
          placeholder="Здесь появится список рекомендованной литературы..."
        />
      </div>
    </div>
  );
};

export default Constructor;