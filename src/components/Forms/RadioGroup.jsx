import React from 'react';
import './RadioGroup.css';

const RadioGroup = ({ options, value, onChange, name }) => {
	return (
		<div className="radio-group">
			{options.map((option) => (
				<label key={option} className="radio-label">
					<input
						type="radio"
						name={name}
						value={option}
						checked={value === option}
						onChange={() => onChange(option)}
						className="radio-input"
					/>
					<span className="radio-custom" />
					{option}
				</label>
			))}
		</div>
	);
};

export default RadioGroup;

