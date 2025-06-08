import React from 'react';
import '../style/DownloadSection.css';

const DownloadSection = () => {
  return (
    <div className="download-section">
      <h3>NetGenius</h3>
      <a href="app.exe" className="btn">Скачать для Windows</a>
      <a href="https://app.com" className="btn">Открыть в браузере</a>
    </div>
  );
};

export default DownloadSection;