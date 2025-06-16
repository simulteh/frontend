import React from 'react';
import LabWorkItem from '../components/LabWorkItem';
import './LabWorksPage.css'; // Подключение стилей

const labWorksData = [
    {
        title: 'Уровень №1',
        files: [
            { name: 'Уровень №1', type: 'folder' },
        ],
    },
    {
        title: 'Уровень №2',
        files: [
            { name: 'Уровень №2', type: 'folder' },
        ],
    },
    {
        title: 'Уровень №3',
        files: [
            { name: 'Уровень №3', type: 'folder' },
            { name: 'Приложение. Таблица П1.', type: 'pdf' },
        ],
    },
    {
        title: 'Уровень №4',
        files: [
            { name: 'Уровень №4', type: 'folder' },
        ],
    },
];

const LabWorksPage = () => {
    return (
        <div className="lab-works-page">
            <div className="container">
                <h2>Лабораторные работы</h2>
                {labWorksData.map((work, index) => (
                    <LabWorkItem key={index} title={work.title} files={work.files} />
                ))}
            </div>
        </div>
    );
};

export default LabWorksPage;