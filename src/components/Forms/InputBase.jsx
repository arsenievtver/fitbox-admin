import React from 'react';
import './InputBase.css';

const InputBase = ({ value, onChange, placeholder }) => {
    return (
        <input
            className="custom-input"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default InputBase;

