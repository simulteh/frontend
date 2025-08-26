// JavaScript source code
import React, { useState } from 'react';
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

    return (
        <>
            {/* Кнопка внизу */}
            <section className="support-section">
                <button className="support-button" onClick={() => setIsModalOpen(true)}>
                    💬 
                </button>
            </section>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleSubmit}>
                    <div className="modal animate" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Форма обращения</h2>
                        {submitted ? (
                            <p>Ваш вопрос успешно отправлен!</p>
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