import React from 'react';
import Select from 'react-select';

const DropdownInput = ({
						   options = [],
						   value = null,
						   onChange,
						   placeholder = 'Выберите значение',
						   isClearable = false,
						   getOptionLabel = option => option?.label || option?.toString() || '',
						   getOptionValue = option => option?.value || option?.toString(),
						   isValid = true,
						   disabled = false, // 👈 приходит как проп
					   }) => {
	const customStyles = {
		control: (base) => ({
			...base,
			borderRadius: 10,
			border: isValid ? '1px solid var(--primary-color)' : '1px solid red',
			boxShadow: 'none',
			backgroundColor: disabled ? '#f0f0f0' : 'white',
			pointerEvents: disabled ? 'none' : 'auto',
			'&:hover': {
				borderColor: isValid ? 'var(--primary-color)' : 'red',
			},
		}),
		menu: (base) => ({
			...base,
			zIndex: 9999,
		}),
		option: (base, state) => ({
			...base,
			backgroundColor: state.isFocused
				? 'rgba(63, 81, 181, 0.25)'
				: 'white',
			color: 'black',
			cursor: 'pointer',
			transition: 'background-color 0.2s ease',
		}),
	};

	return (
		<Select
			options={options}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			isClearable={isClearable}
			getOptionLabel={getOptionLabel}
			getOptionValue={getOptionValue}
			styles={customStyles}
			isDisabled={disabled} // 👈 вот тут правильное свойство
		/>
	);
};

export default DropdownInput;

