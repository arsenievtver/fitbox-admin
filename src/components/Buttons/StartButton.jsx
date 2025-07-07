import React from 'react';
import './StartButton.css';

const StartButton = ({ onClick }) => {
	return (
		<button className="start-button" onClick={onClick}>
			START
		</button>
	);
};

export default StartButton;
