import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Table from '../Table/Table';
import InputBase from '../Forms/InputBase';
import DropdownInput from '../Forms/DropdownInput';
import './SlotsTableForm.css'

const HOURS = Array.from({ length: 12 }, (_, i) => {
	const hour = (9 + i) % 24;
	return (hour < 10 ? '0' : '') + hour + ':00';
});

const TYPES = [
	{ label: 'Обычная', value: 'обычная' },
	{ label: 'Двойная', value: 'двойная' }
];

const SlotsTableForm = forwardRef(({ selectedDate }, ref) => {
	const [rows, setRows] = useState(
		HOURS.map(time => ({
			checked: false,
			time,
			type: TYPES[0],
			places: 20
		}))
	);

	useImperativeHandle(ref, () => ({
		getSelectedSlots: () => {
			return rows
				.filter(row => row.checked)
				.map(row => {
					// Создаем дату локального времени (по часам из row.time)
					const localDate = new Date(
						selectedDate.getFullYear(),
						selectedDate.getMonth(),
						selectedDate.getDate(),
						parseInt(row.time.split(':')[0], 10),
						0,
						0,
						0
					);

					// Просто отдаем ISO строку без смещений
					return {
						type: row.type.value, // <-- берём строку, а не весь объект
						time: localDate.toISOString(),
						number_of_places: row.places
					};
				});
		}
	}));

	const handleCheckboxChange = (index) => {
		const newRows = [...rows];
		newRows[index].checked = !newRows[index].checked;
		setRows(newRows);
	};

	const handleTypeChange = (index, newTypeObj) => {
		const newRows = [...rows];
		newRows[index].type = newTypeObj;
		setRows(newRows);
	};

	const handlePlacesChange = (index, newPlaces) => {
		const newRows = [...rows];
		newRows[index].places = newPlaces;
		setRows(newRows);
	};

	const columns = [
		{
			key: 'checked',
			label: '',
			renderCell: (_, i) => (
				<input
					type="checkbox"
					checked={rows[i].checked}
					onChange={() => handleCheckboxChange(i)}
				/>
			)
		},
		{
			key: 'time',
			label: 'Время'
		},
		{
			key: 'type',
			label: 'Тип',
			renderCell: (_, i) => (
				<DropdownInput
					value={rows[i].type}
					options={TYPES}
					onChange={(selected) => handleTypeChange(i, selected)}
				/>
			)
		},
		{
			key: 'places',
			label: 'Кол-во мест',
			renderCell: (_, i) => (
				<InputBase
					className='input-base-num'
					type="number"
					value={rows[i].places}
					onChange={(e) => handlePlacesChange(i, Number(e.target.value))}
					min={0}
				/>
			)
		}
	];

	return (
		<Table
			columns={columns}
			data={rows}
			onRowClick={null}
			actions={null}
			loading={false}
			emptyMessage="Нет слотов"
		/>
	);
});

export default SlotsTableForm;

