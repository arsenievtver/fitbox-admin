import React, { useEffect, useState } from 'react';
import './DisplayPage.css';
import { motion } from 'framer-motion';

const DisplayPage = ({ isPreview = false }) => {
	const [mode, setMode] = useState('waiting');
	const [users, setUsers] = useState([]);
	const backgroundVideo = "/videos/wait.mp4";
	const logoUrl = "/images/logo-black.png";

	useEffect(() => {
		const channel = new BroadcastChannel('display-sync');

		channel.onmessage = (event) => {
			console.log('[Display] Получено из канала:', event.data);
			setMode(event.data.mode);
			setUsers(event.data.users);
		};

		return () => channel.close();
	}, []);

	const sortedUsers = [...users].sort((a, b) => b.energy - a.energy);

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(console.warn);
		} else {
			document.exitFullscreen();
		}
	};

	return (
		<div className="display-page">
			{/* Лого */}
			{logoUrl && <img src={logoUrl} style={{ width: '150px' }} alt="logo" />}

			{/* Экран ожидания */}
			{mode === 'waiting' && (
				<div className="waiting-screen">
					{backgroundVideo ? (
						<video
							src={backgroundVideo}
							autoPlay
							loop
							muted
							className="background-video"
						/>
					) : (
						<div className="waiting-text">Тренировка скоро начнётся...</div>
					)}
				</div>
			)}

			{/* Экран результатов */}
			{mode === 'results' && (
				<div className="standings-list">
					{sortedUsers.map((user, i) => {
						const placeIcons = ['🥇', '🥈', '🥉'];
						const placeIcon = i < 3 ? placeIcons[i] : null;
						const fromLeft = i % 2 === 0;

						return (
							<motion.div
								key={`${user.name}-${i}`}
								className={`standing-card ${fromLeft ? 'from-left' : 'from-right'}`}
								initial={{ opacity: 0, x: fromLeft ? -200 : 200 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									delay: i * 0.3,
									type: "spring",
									stiffness: 60,
									damping: 15
								}}
							>
								<div className="placeIcon">{placeIcon}</div>
								<div className="position">{i + 1}</div>
								<div className="avatar">
									<img src={user.photo_url || '/images/avatar.webp'} alt="avatar" />
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
			)}

			{/* Кнопка фуллскрина (только для ТВ) */}
			{!isPreview && (
				<button className="fullscreen-button" onClick={toggleFullscreen}>
					На весь экран
				</button>
			)}
		</div>
	);
};

export default DisplayPage;
