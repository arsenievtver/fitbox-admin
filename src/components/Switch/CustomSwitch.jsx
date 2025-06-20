import React from 'react';
import Switch from 'react-switch';

const CustomSwitch = ({ checked, onChange }) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
			<Switch
				onChange={onChange}
				checked={checked}
				onColor="var(--primary-color)"        // зелёный
				offColor="#ccc"           // серый
				checkedIcon={false}
				uncheckedIcon={false}
				height={20}
				width={42}
				handleDiameter={18}
			/>
		</div>
	);
};

export default CustomSwitch;
