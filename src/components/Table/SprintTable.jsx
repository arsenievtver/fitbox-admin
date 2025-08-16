import React, { useState, useRef, useEffect } from 'react';
import Table from './Table';
import InputBase from '../Forms/InputBase';
import DropdownInput from "../Forms/DropdownInput.jsx";
import ButtonMy from '../Buttons/ButtonMy.jsx';
import useApi from '../../hooks/useApi.hook';
import { postStartAllUrl } from '../../helpers/constants';
import { tracks } from '../../helpers/tracksList';
import "./SprintTable.css";

const SprintTable = ({ slotTime, slotId, onTrackSelect, onSprintFinished }) => {
	const api = useApi();
	const beepRef = useRef(null);

	const [isSoundUnlocked, setIsSoundUnlocked] = useState(false);
	const [rows, setRows] = useState(
		Array.from({ length: 8 }, (_, i) => ({
			id: i + 1,
			track: '',
			rhythm: 500,
			started: false,
			remainingTime: 0,
		}))
	);
	const [serverResponse, setServerResponse] = useState(null);

	const intervalsRef = useRef({});

	const handleUnlockSound = () => {
		const beep = beepRef.current;
		if (!beep) return;
		beep.play().then(() => setIsSoundUnlocked(true)).catch(console.warn);
	};

	const handleRhythmChange = (index, value) => {
		const updatedRows = [...rows];
		updatedRows[index].rhythm = Number(value);
		setRows(updatedRows);
	};

	const handleTrackChange = (index, file) => {
		const updatedRows = [...rows];
		updatedRows[index].track = file;
		setRows(updatedRows);
		if (file && onTrackSelect) onTrackSelect(file);
	};

	const handleStart = async (sprintId) => {
		if (!isSoundUnlocked) {
			setServerResponse('🔊 Сначала включи звук, затем запускай спринт');
			setTimeout(() => setServerResponse(null), 4000);
			return;
		}
		const rowIndex = rows.findIndex(r => r.id === sprintId);
		if (rowIndex === -1 || rows[rowIndex].started) return;

		const row = rows[rowIndex];
		if (row.track && onTrackSelect) onTrackSelect(row.track);

		try {
			await api.post(postStartAllUrl, {
				session_id: slotId,
				sprint_id: sprintId,
				blink_interval: row.rhythm,
				led_on_ms: 50,
			});

			setRows(prevRows =>
				prevRows.map(r =>
					r.id === sprintId ? { ...r, started: true, remainingTime: 2 * 60 + 7 } : r
				)
			);

			// Создаём один интервал на спринт
			if (!intervalsRef.current[sprintId]) {
				intervalsRef.current[sprintId] = setInterval(() => {
					setRows(prevRows =>
						prevRows.map(r => {
							if (r.id !== sprintId) return r;
							if (r.remainingTime > 0) return { ...r, remainingTime: r.remainingTime - 1 };
							clearInterval(intervalsRef.current[sprintId]);
							delete intervalsRef.current[sprintId];
							if (onSprintFinished) setTimeout(() => onSprintFinished(slotId, sprintId), 0);
							return r;
						})
					);
				}, 1000);
			}

			setTimeout(() => setServerResponse(null), 5000);
		} catch (error) {
			console.error('❌ Ошибка при отправке команды START:', error);
			setServerResponse(`❌ Ошибка: ${error.message}`);
		}
	};

	const formatTime = seconds => {
		const min = Math.floor(seconds / 60);
		const sec = seconds % 60;
		return `${min}:${sec.toString().padStart(2, '0')}`;
	};

	useEffect(() => {
		return () => {
			Object.values(intervalsRef.current).forEach(clearInterval);
			intervalsRef.current = {};
		};
	}, []);

	const columns = [
		{ label: 'N', key: 'id', renderCell: row => row.id },
		{
			label: 'Музыка',
			key: 'track',
			renderCell: (row, index) => (
				<DropdownInput
					options={tracks.map(t => ({ label: t.name, value: t.file }))}
					value={row.track ? { label: tracks.find(t => t.file === row.track)?.name, value: row.track } : null}
					onChange={opt => handleTrackChange(index, opt ? opt.value : '')}
					placeholder="-- выбери трек --"
					isClearable
					isDisabled={row.started}
				/>
			)
		},
		{
			label: 'Ритм',
			key: 'rhythm',
			renderCell: (row, index) => (
				<InputBase
					type="number"
					className="ritm_num"
					value={row.rhythm}
					onChange={e => handleRhythmChange(index, e.target.value)}
					disabled={row.started}
				/>
			)
		},
		{
			label: '',
			key: 'action',
			renderCell: row => {
				const startDisabled = !isSoundUnlocked || row.started;
				return (
					<div className="flex items-center gap-2">
						{row.started ? (
							<>
								<span className="text-green-600 font-semibold">✔ Запущено </span>
								<span className="text-blue-600 font-mono">{formatTime(row.remainingTime)}</span>
							</>
						) : (
							<ButtonMy
								onClick={() => handleStart(row.id)}
								disabled={startDisabled}                         // если поддерживается
								title={!isSoundUnlocked ? "Сначала включи звук 🔊" : "Запустить"}
								style={{
									opacity: startDisabled ? 0.6 : 1,
									cursor: startDisabled ? 'not-allowed' : 'pointer',
									pointerEvents: startDisabled ? 'none' : 'auto', // если disabled не прокидывается внутрь
								}}
							>
								Старт
							</ButtonMy>
						)}
					</div>
				);
			}
		}
	];

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">
					Тренировка на {slotTime} (ID: {slotId})
				</h2>
				{!isSoundUnlocked ? (
					<ButtonMy onClick={handleUnlockSound}>🔊 Включить звук</ButtonMy>
				) : (
					<span className="text-green-600 font-semibold">✅ Звук включён</span>
				)}
			</div>

			<Table columns={columns} data={rows} />

			{serverResponse && (
				<div style={{ textAlign: 'center', marginTop: '1rem', color: 'crimson' }}>
					{serverResponse}
				</div>
			)}

			<audio ref={beepRef} src="/tracks/beep.mp3" preload="auto" />
		</div>
	);
};

export default SprintTable;