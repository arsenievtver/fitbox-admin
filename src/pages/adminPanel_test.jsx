import React, { useState, useEffect } from 'react';
import DisplayPage from './DisplayPage';

const AdminControl = () => {
	const [mode, setMode] = useState('waiting');
	const [users, setUsers] = useState([
		{ name: 'Алексей', power: 87, tempo: 92, energy: 96, photo_url: null },
		{ name: 'Ирина', power: 80, tempo: 85, energy: 90, photo_url: null },
		{ name: 'Макс', power: 75, tempo: 88, energy: 88, photo_url: null },
		{ name: 'Оля', power: 72, tempo: 70, energy: 65, photo_url: null },
		{ name: 'Дима', power: 68, tempo: 72, energy: 62, photo_url: null },
	]);

	const channel = new BroadcastChannel('display-sync');

	// При изменении state отправляем в канал
	useEffect(() => {
		const payload = { mode, users };
		console.log('[Admin] Отправка в канал:', payload);
		channel.postMessage(payload);
	}, [mode, users]);

	const toggleMode = () => {
		setMode(prev => (prev === 'waiting' ? 'results' : 'waiting'));
	};

	return (
		<div style={{ display: 'flex', gap: '20px' }}>
			{/* Панель управления */}
			<div style={{ padding: '20px', background: '#eee', borderRadius: '8px' }}>
				<h2>Админ-панель</h2>
				<p>Текущий режим: <b>{mode}</b></p>
				<button onClick={toggleMode}>
					{mode === 'waiting' ? 'Показать результаты' : 'Вернуться к заставке'}
				</button>
			</div>

			{/* Превью экрана ТВ */}
			<div style={{ flex: 1, border: '2px solid black' }}>
				<DisplayPage isPreview />
			</div>
		</div>
	);
};

export default AdminControl;
