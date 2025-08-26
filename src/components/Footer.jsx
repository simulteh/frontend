import React from 'react';
import logo from '../assets/images/logo_w.svg';

export const Footer = () => (
    <footer>
        <div className="footer-container">
            <a href="/privacy-policy" className="privacy-link">
                Политика конфиденциальности
            </a>
            <p className="copyright">&copy; 2025 Netlink Builder. Все права защищены.</p>
            <a 
                href="https://fasie.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="logo-link"
            >
                <img 
                    src={logo} 
                    alt="Логотип партнера" 
                    className="partner-logo" 
                />
            </a>
        </div>
    </footer>
);