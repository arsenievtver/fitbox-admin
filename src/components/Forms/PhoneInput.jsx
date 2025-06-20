import React from 'react';
import './PhoneInput.css';

const PhoneInput = ({ value, onChange, placeholder }) => {
	const handleChange = (e) => {
		const digitsOnly = e.target.value.replace(/\D/g, ''); // Удаляем всё, кроме цифр
		if (digitsOnly.length <= 10) {
			onChange(digitsOnly);
		}
	};

	return (
		<div className="phone-input-wrapper">
			<span className="phone-prefix">+7</span>
			<input
				type="tel"
				className="phone-input"
				value={value}
				onChange={handleChange}
				placeholder={placeholder || 'Введите номер'}
				inputMode="numeric"
			/>
		</div>
	);
};

export default PhoneInput;
