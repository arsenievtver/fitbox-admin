import React from 'react';
import './InputBase.css';

const InputBase = ({ name, value, onChange, placeholder, className = '' }) => {
    return (
        <input
            className={`custom-input ${className}`}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default InputBase;



