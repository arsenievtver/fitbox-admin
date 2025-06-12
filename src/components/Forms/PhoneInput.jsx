import React from 'react';
import './PhoneInput.css';

const PhoneInput = ({ value, onChange, placeholder }) => {
	// Убираем все кроме цифр, обрезаем до 10
	const handleChange = (e) => {
		const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
		onChange({ target: { value: raw } });
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
			/>
		</div>
	);
};

export default PhoneInput;
