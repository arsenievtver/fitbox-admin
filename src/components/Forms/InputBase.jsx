import React, { useState } from 'react';
import './InputBase.css';

const InputBase = ({
                       name,
                       value,
                       onChange,
                       placeholder,
                       className = '',
                       type = 'text',
                   }) => {
    const [touched, setTouched] = useState(false);

    // Простой email валидатор
    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showError =
        type === 'email' && touched && value && !isValidEmail(value);

    const handleBlur = () => {
        setTouched(true);
    };

    const inputProps = {
        className: `custom-input ${className} ${showError ? 'input-error' : ''}`,
        type,
        name,
        value,
        onChange,
        onBlur: handleBlur,
        placeholder,
    };

    if (type === 'email') {
        inputProps.inputMode = 'email';
        inputProps.pattern = '[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
    }

    if (type === 'password') {
        inputProps.autoComplete = 'new-password';
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <input {...inputProps} />
            {showError && (
                <span style={{ color: 'red', fontSize: 12 }}>
					Введите корректный e-mail
				</span>
            )}
        </div>
    );
};

export default InputBase;


