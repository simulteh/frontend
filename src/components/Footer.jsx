import React from 'react';
import fsinLogo from '../assets/images/fsin_logo.png';
import putpLogo from '../assets/images/putp_logo.png';
import '../style/Footer.css';

export const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-left">
        <div className="footer-logos">
          <a href="https://fasie.ru/" target="_blank" rel="noopener noreferrer">
            <img src={fsinLogo} alt="Фонд содействия инновациям" className="logo logo-fsin" />
          </a>
          <a href="https://univertechpred.ru/" target="_blank" rel="noopener noreferrer">
            <img src={putpLogo} alt="Платформа университетского технологического предпринимательства" className="logo logo-putp" />
          </a>
        </div>
        
        <p className="support-text">
          Проект создан при поддержке Федерального государственного бюджетного учреждения
          «Фонд содействия развитию малых форм предприятий в научно-технической сфере»
          в рамках программы «Студенческий стартап» федерального проекта
          «Платформа университетского технологического предпринимательства»
        </p>
      </div>

      <div className="footer-copyright">
        <span className="copyright1">© Симултех</span>
      </div>
    </div>
  </footer>
);