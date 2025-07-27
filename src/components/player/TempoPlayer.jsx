import { useRef, useEffect } from 'react';

const TempoPlayer = ({ play, track, manualPlay }) => {
	const audioRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (track) {
			audio.src = `/tracks/${track}`;
			audio.load();
		} else {
			audio.removeAttribute('src');
			audio.load();
		}

		if (play && track) {
			audio.currentTime = 0;
			audio.play().catch((e) => {
				console.warn("🔇 Автовоспроизведение заблокировано:", e);
			});
		} else {
			audio.pause();
		}
	}, [play, track]);

	useEffect(() => {
		if (manualPlay && audioRef.current) {
			audioRef.current.src = '/tracks/beep.mp3';
			audioRef.current.play().catch((e) => {
				console.warn("🔇 Не удалось воспроизвести beep:", e);
			});
		}
	}, [manualPlay]);

	return <audio ref={audioRef} preload="auto" />;
};

export default TempoPlayer;
