import { useRef, useEffect } from 'react';

const TempoPlayer = ({ play, track }) => {
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

	return <audio ref={audioRef} preload="auto" />;
};

export default TempoPlayer;
