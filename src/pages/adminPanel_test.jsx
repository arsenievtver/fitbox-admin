import React, { useState, useEffect, useRef } from 'react';
import DisplayPage from './DisplayPage';
import { PostGetSprintResultsUrl, PostGetSlotResultsUrl, PHOTO_BASE_URL } from '../helpers/constants.js';
import { createApi } from '../helpers/ApiClient.jsx';

const AdminControl = ({ lastFinishedSprint }) => {
	const [mode, setMode] = useState('waiting');
	const [slotId, setSlotId] = useState('');
	const [sprintId, setSprintId] = useState('');
	const [users, setUsers] = useState([]);

	// Помним последний уже обработанный спринт, чтобы не дублировать автозагрузку
	const processedSprintRef = useRef(null);

	const channelRef = useRef(null);
	const apiRef = useRef(null);

	// Инициализация каналов/клиента 1 раз
	useEffect(() => {
		channelRef.current = new BroadcastChannel('display-sync');
		apiRef.current = createApi(() => {});
		return () => {
			try { channelRef.current?.close(); } catch {'?'}
		};
	}, []);

	// Отправка состояния на дисплей
	useEffect(() => {
		const payload = { mode, users };
		channelRef.current?.postMessage(payload);
	}, [mode, users]);

	// Автозагрузка результатов один раз для каждого *нового* lastFinishedSprint
	useEffect(() => {
		const sameSprint = (a, b) =>
			!!a && !!b && a.slotId === b.slotId && a.sprintId === b.sprintId;

		const fetchSprintResults = async () => {
			if (!lastFinishedSprint) return;
			// уже обрабатывали этот спринт? ничего не делаем
			if (sameSprint(processedSprintRef.current, lastFinishedSprint)) return;

			const { slotId: sId, sprintId: spId } = lastFinishedSprint;
			try {
				const url = spId ? PostGetSprintResultsUrl(sId, spId) : PostGetSlotResultsUrl(sId);
				const { data } = await apiRef.current.post(url, {});

				const normalized = data.map(user => ({
					...user,
					photo_url: user.photo_url ? PHOTO_BASE_URL + user.photo_url : null,
					power: Math.round(user.power),
					tempo: Math.round(user.tempo),
					energy: Math.round(user.energy),
				}));

				setUsers(normalized);
				setMode('results');
				processedSprintRef.current = lastFinishedSprint; // помечаем как обработанный
			} catch (err) {
				console.error('Ошибка получения автоматических результатов:', err);
			}
		};

		fetchSprintResults();
	}, [lastFinishedSprint]);

	const fetchResultsManual = async () => {
		if (!slotId) {
			alert('Введите slot_id!');
			return;
		}
		try {
			const url = sprintId
				? PostGetSprintResultsUrl(slotId, sprintId)
				: PostGetSlotResultsUrl(slotId);

			const { data } = await apiRef.current.post(url, {});
			const normalized = data.map(user => ({
				...user,
				photo_url: user.photo_url ? PHOTO_BASE_URL + user.photo_url : null,
				power: Math.round(user.power),
				tempo: Math.round(user.tempo),
				energy: Math.round(user.energy),
			}));

			setUsers(normalized);
			setMode('results');

			// Помечаем обработанным именно тот спринт, который показали вручную
			processedSprintRef.current = { slotId, sprintId };
		} catch (err) {
			console.error('Ошибка получения результатов:', err);
			alert('Ошибка при загрузке результатов. Смотри консоль.');
		}
	};

	const returnToSplash = () => {
		// Переходим к заставке и очищаем пользователей
		setMode('waiting');
		setUsers([]);

		// Если прямо сейчас в пропсах висит lastFinishedSprint,
		// помечаем его обработанным, чтобы эффект не перетянул данные снова
		if (lastFinishedSprint) {
			processedSprintRef.current = lastFinishedSprint;
		}
	};

	return (
		<div style={{ display: 'flex', gap: '20px' }}>
			{/* Панель управления */}
			<div style={{ padding: '20px', background: '#eee', borderRadius: '8px' }}>
				<h2>Админ-панель</h2>
				<p>Текущий режим: <b>{mode}</b></p>

				{/* Ручной ввод slot_id / sprint_id */}
				<div style={{ marginBottom: '10px' }}>
					<input
						type="number"
						placeholder="slot_id"
						value={slotId}
						onChange={e => setSlotId(e.target.value)}
						style={{ marginRight: '5px' }}
					/>
					<input
						type="number"
						placeholder="sprint_id (необязательно)"
						value={sprintId}
						onChange={e => setSprintId(e.target.value)}
					/>
				</div>

				<button onClick={fetchResultsManual} style={{ marginRight: '5px' }}>
					Показать результаты
				</button>

				<button onClick={returnToSplash}>
					Вернуться к заставке
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
