import React from 'react';
import './ButtonMy.css';

const ButtonMy = ({ children, ...props }) => {
    return (
        <button className="custom-button" {...props}>
            {children}
        </button>
    );
};

export default ButtonMy;
