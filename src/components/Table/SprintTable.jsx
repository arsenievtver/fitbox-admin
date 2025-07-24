import React, { useState } from 'react';
import Table from './Table';
import InputBase from '../Forms/InputBase';
import DropdownInput from "../Forms/DropdownInput.jsx";
import ButtonMy from '../Buttons/ButtonMy.jsx';
import useApi from '../../hooks/useApi.hook';
import { postStartAllUrl } from '../../helpers/constants';
import { tracks } from '../../helpers/tracksList';

const SprintTable = ({ slotTime, slotId, onTrackSelect }) => {
	const api = useApi();

	const [rows, setRows] = useState(
		Array.from({ length: 8 }, (_, i) => ({
			id: i + 1,
			track: '',
			rhythm: 500,
			started: false
		}))
	);

	const [serverResponse, setServerResponse] = useState(null);

	const handleRhythmChange = (index, value) => {
		const updatedRows = [...rows];
		updatedRows[index].rhythm = Number(value);
		setRows(updatedRows);
	};

	const handleStart = async (sprintId) => {
		const rowIndex = rows.findIndex((r) => r.id === sprintId);
		if (rowIndex === -1) return;

		const row = rows[rowIndex];

		// 👉 добавим: передаем трек вверх при старте
		if (row.track && onTrackSelect) {
			onTrackSelect(row.track);
		}

		const payload = {
			session_id: slotId,
			sprint_id: sprintId,
			blink_interval: row.rhythm,
			led_on_ms: 50
		};

		try {
			const response = await api.post(postStartAllUrl, payload);
			console.log('🚀 Ответ сервера:', response.data);
			setServerResponse(`✅ START успешно: ${JSON.stringify(response.data)}`);

			const updatedRows = [...rows];
			updatedRows[rowIndex].started = true;
			setRows(updatedRows);

			setTimeout(() => setServerResponse(null), 5000);
		} catch (error) {
			console.error('❌ Ошибка при отправке команды START:', error);
			setServerResponse(`❌ Ошибка: ${error.message}`);
		}
	};


	const handleTrackChange = (index, file) => {
		const updatedRows = [...rows];
		updatedRows[index].track = file;
		setRows(updatedRows);

		if (file && onTrackSelect) {
			onTrackSelect(file); // Передаем выбранный трек наверх
		}
	};

	const columns = [
		{ label: 'N', key: 'id', renderCell: (row) => row.id },

		{
			label: 'Музыка',
			key: 'track',
			renderCell: (row, index) => (
				<DropdownInput
					options={tracks.map((track) => ({
						label: track.name,
						value: track.file
					}))}
					value={
						row.track
							? {
								label: tracks.find((t) => t.file === row.track)?.name,
								value: row.track
							}
							: null
					}
					onChange={(selectedOption) =>
						handleTrackChange(index, selectedOption ? selectedOption.value : '')
					}
					placeholder="-- выбери трек --"
					isClearable={true}
					isDisabled={row.started} // ✅ ← вот тут главное изменение
				/>
			)
		},

		{
			label: 'Ритм',
			key: 'rhythm',
			renderCell: (row, index) => (
				<InputBase
					type="number"
					name={`rhythm-${row.id}`}
					value={row.rhythm}
					onChange={(e) => handleRhythmChange(index, e.target.value)}
					disabled={row.started} // ✅ ← и тут
				/>
			)
		},

		{
			label: '',
			key: 'action',
			renderCell: (row) =>
				row.started ? (
					<span className="text-green-600 font-semibold">✔ Запущено</span>
				) : (
					<ButtonMy onClick={() => handleStart(row.id)}>
						Старт
					</ButtonMy>
				)
		}
	];


	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">
				Тренировка на {slotTime} (ID: {slotId})
			</h2>

			<Table columns={columns} data={rows} />

			{serverResponse && (
				<div style={{ textAlign: 'center', marginTop: '1rem', color: 'crimson' }}>
					{serverResponse}
				</div>
			)}
		</div>
	);
};

export default SprintTable;
