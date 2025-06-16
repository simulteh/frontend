import React, { useState } from 'react';
import './LabWorkItem.css'; // Подключение стилей

const LabWorkItem = ({ title, files }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="lab-work-item">
            <div className="lab-work-header" onClick={toggleOpen}>
                <div className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</div>
                <h3>{title}</h3>
            </div>
            {isOpen && (
                <div className="lab-work-content">
                    {files.map((file, index) => (
                        <div key={index} className="lab-work-file">
                            {file.type === 'folder' ? (
                                <div className="folder-icon">📁</div>
                            ) : (
                                <div className="pdf-icon">📄</div>
                            )}
                            <a href="#" className="file-name">
                                {file.name}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LabWorkItem;