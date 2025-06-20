import React from 'react';
import './RadioGroup.css';

const RadioGroup = ({ options, value, onChange, name }) => {
	return (
		<div className="radio-group">
			{options.map((option) => (
				<label key={option.value} className="radio-label">
					<input
						type="radio"
						name={name}
						value={option.value}
						checked={value === option.value}
						onChange={() => onChange(option.value)}
						className="radio-input"
					/>
					<span className="radio-custom" />
					{option.label}
				</label>
			))}
		</div>
	);
};

export default RadioGroup;

