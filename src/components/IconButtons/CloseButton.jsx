// CloseButton.jsx
import React from 'react';

const CloseButton = ({ onClick, style, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`close-button ${className}`}
            aria-label="Закрыть"
            style={style}
        >
            ×
        </button>
    );
};

export default CloseButton;
