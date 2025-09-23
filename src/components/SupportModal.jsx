// SupportModal.js
import React, { useState, useEffect } from 'react';
import './SupportModal.css';

const SupportModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        question: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.question) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', question: '' });
            setIsModalOpen(false);
        }, 2000);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Предотвращаем скроллинг страницы когда модальное окно открыто
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    return (
        <>
            {/* Кнопка поддержки */}
            <div className="support-section">
                <button 
                    className="support-button" 
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Открыть форму поддержки"
                >
                    💬 
                    <span className="support-tooltip">Задать вопрос</span>
                </button>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="close-btn" 
                            onClick={closeModal}
                            aria-label="Закрыть окно"
                        >
                            &times;
                        </button>
                        <h2>Форма обращения</h2>
                        {submitted ? (
                            <div className="success-message">
                                <p>Ваш вопрос успешно отправлен!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Имя"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <textarea
                                    name="question"
                                    placeholder="Ваш вопрос"
                                    value={formData.question}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit">Отправить</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SupportModal;