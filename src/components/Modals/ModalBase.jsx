import React from 'react';
import './ModalBase.css';
import CloseButton from '../IconButtons/CloseButton';

const Modal = ({ children, onClose, expanded }) => {
    return (
        <div className="modal-overlay">
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

export default Modal;

