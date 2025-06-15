// src/components/Forms/DropdownInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import './DropdownInput.css';

const DropdownInput = ({ options = [], value, onChange, placeholder = 'Выберите значение' }) => {
	const [inputValue, setInputValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);
	const wrapperRef = useRef(null);

	useEffect(() => {
		setInputValue(value || '');
	}, [value]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleInputChange = (e) => {
		const input = e.target.value;
		setInputValue(input);
		setFilteredOptions(
			options.filter((option) =>
				option.toLowerCase().includes(input.toLowerCase())
			)
		);
		setIsOpen(true);
	};

	const handleOptionClick = (option) => {
		setInputValue(option);
		onChange({ target: { value: option } });
		setIsOpen(false);
	};

	return (
		<div className="dropdown-wrapper" ref={wrapperRef}>
			<input
				type="text"
				className="custom-input"
				value={inputValue}
				onChange={handleInputChange}
				onFocus={() => setIsOpen(true)}
				placeholder={placeholder}
			/>
			{isOpen && filteredOptions.length > 0 && (
				<ul className="dropdown-list">
					{filteredOptions.map((option) => (
						<li key={option} onClick={() => handleOptionClick(option)}>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DropdownInput;
