// src/components/Modals/ModalBase.jsx

import React from 'react';
import './ModalBase.css';
import CloseButton from '../IconButtons/CloseButton';

const ModalBase = ({ children, onClose, expanded, className = '' }) => {
    return (
        <div className={`modal-overlay ${className}`}>
            <div
                className="modal-window-base"
                style={{
                    maxHeight: expanded ? '90vh' : '60vh',
                    overflowY: 'auto',
                    transition: 'max-height 0.4s ease'
                }}
            >
                <div className="modal-header">
                    <CloseButton onClick={onClose} />
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalBase;
