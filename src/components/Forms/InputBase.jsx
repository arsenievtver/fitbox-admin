import React from 'react';
import './InputBase.css';

const InputBase = ({ name, value, onChange, placeholder }) => {
    return (
        <input
            className="custom-input"
            type="text"
            name={name} // ← вот это важно
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default InputBase;


