import React from 'react';
import './ButtonMy.css';

const ButtonMy = ({ children, onClick }) => {
    return (
        <button className="custom-button" onClick={onClick}>
            {children}
        </button>
    );
};

export default ButtonMy;
