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
					   }) => {

	const customStyles = {
		control: (base) => ({
			...base,
			minWidth: 250,
			borderRadius: 10,
			border: isValid ? '1px solid var(--primary-color)' : '1px solid red',
			boxShadow: 'none',
			'&:hover': { borderColor: isValid ? 'var(--primary-color)' : 'red' },
		}),
		menu: (base) => ({ ...base, zIndex: 9999 }),
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
		/>
	);
};

export default DropdownInput;
