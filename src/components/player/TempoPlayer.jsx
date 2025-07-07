// components/TempoPlayer.jsx
import { useRef, useEffect } from 'react';

const TempoPlayer = ({ play }) => {
	const audioRef = useRef();

	useEffect(() => {
		if (play && audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.play().catch((e) => {
				console.warn("🔇 Автовоспроизведение заблокировано:", e);
			});
		}
	}, [play]);

	return (
		<audio ref={audioRef} src="/tracks/12345.mp3" preload="auto" />
	);
};

export default TempoPlayer;