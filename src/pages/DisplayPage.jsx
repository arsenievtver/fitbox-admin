import React from 'react';
import './DisplayPage.css';
import { motion } from 'framer-motion';

const mockUsers = [
	{ id: 1, name: 'Алексей', power: 87, tempo: 92, energy: 96 },
	{ id: 2, name: 'Ирина', power: 80, tempo: 85, energy: 90 },
	{ id: 3, name: 'Макс', power: 75, tempo: 88, energy: 88 },
	{ id: 4, name: 'Оля', power: 72, tempo: 70, energy: 65 },
	{ id: 5, name: 'Дима', power: 68, tempo: 72, energy: 62 },
	{ id: 6, name: 'Катя', power: 71, tempo: 69, energy: 60 },
	{ id: 7, name: 'Женя', power: 60, tempo: 66, energy: 55 },
	{ id: 8, name: 'Маша', power: 58, tempo: 64, energy: 52 },
	{ id: 9, name: 'Сергей', power: 57, tempo: 60, energy: 49 },
	{ id: 10, name: 'Юля', power: 55, tempo: 62, energy: 47 },
	{ id: 11, name: 'Катя', power: 71, tempo: 69, energy: 60 },
	{ id: 12, name: 'Женя', power: 60, tempo: 66, energy: 55 },
	{ id: 13, name: 'Маша', power: 58, tempo: 64, energy: 52 },
	{ id: 14, name: 'Сергей', power: 57, tempo: 60, energy: 49 },
	{ id: 15, name: 'Юля', power: 55, tempo: 62, energy: 47 },
];

const DisplayPage = () => {
	const sortedUsers = [...mockUsers].sort((a, b) => b.energy - a.energy);

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(console.warn);
		} else {
			document.exitFullscreen();
		}
	};

	return (
		<div className="display-page">
			<img src={'images/logo-black.png'} style={{ width: '150px' }}/>
			<div className="standings-list">
				{sortedUsers.map((user, i) => {
					const placeIcons = ['🏆', '🏆', '🏆'];
					const placeIcon = i < 3 ? placeIcons[i] : null;
					const fromLeft = i % 2 === 0;

					return (
						<motion.div
							key={user.id}
							className={`standing-card ${fromLeft ? 'from-left' : 'from-right'}`}
							initial={{ opacity: 0, x: fromLeft ? -200 : 200 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								delay: i * 0.5,
								type: "spring",
								stiffness: 60,
								damping: 15
							}}
						>
							<div className="placeIcon">{placeIcon}</div>
							<div className="position">{i + 1}</div>
							<div className="avatar">
								<img src="/images/avatar.webp" alt="avatar" />
							</div>
							<div className="name-in-rank">
								<h3>{user.name}</h3>
							</div>
							<div className="info">
								<div className="stat">
									<span>⚡ {user.energy}</span>
								</div>
								<div className="stat">
									<span>🎵 {user.tempo}</span>
								</div>
								<div className="stat">
									<span>💪 {user.power}</span>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
			<button className="fullscreen-button" onClick={toggleFullscreen}>
				{document.fullscreenElement ? 'Exit Fullscreen' : 'Enter Fullscreen'}
			</button>
		</div>
	);
};

export default DisplayPage;
