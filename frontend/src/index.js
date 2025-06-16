import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Добавляем Router здесь
import App from './App';
import './main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Router оборачивает всё приложение */}
      <App />
    </Router>
  </React.StrictMode>
);