import React, { useEffect, useState } from 'react';
import Table from './Table';
import InputBase from '../Forms/InputBase';
import useApi from '../../hooks/useApi.hook.jsx';
import { GetBookingFilterUrl, GetallusersUrl, patchBookingUrl } from '../../helpers/constants';
import './TrainingTableComplited.css';
import ButtonMy from "../Buttons/ButtonMy.jsx";

const BookingTable = ({ slotId }) => {
	const { get, patch } = useApi();
	const [bookings, setBookings] = useState([]);
	const [users, setUsers] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [selectedRows, setSelectedRows] = useState(new Set());
	const [selectAll, setSelectAll] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchBookingsAndUsers = async () => {
			setLoading(true);
			try {
				const bookingRes = await get(GetBookingFilterUrl(slotId));
				const bookingsData = bookingRes?.data || [];

				const userIds = [...new Set(bookingsData.map(b => b.user_id))];
				const userQuery = userIds.length > 0 ? `?id__in=${userIds.join(',')}` : '';
				const usersRes = await get(`${GetallusersUrl}${userQuery}`);
				const usersMap = {};
				(usersRes?.data || []).forEach(user => {
					usersMap[user.id] = user;
				});

				const enrichedData = bookingsData.map(b => ({
					id: b.id,
					userId: b.user_id,
					fullName: `${usersMap[b.user_id]?.last_name || ''} ${usersMap[b.user_id]?.name || ''}`.trim(),
					strength: '',
					tempo: '',
					energy: '',
				}));

				setBookings(bookingsData);
				setUsers(usersRes?.data || []);
				setTableData(enrichedData);

				setSelectedRows(new Set());
				setSelectAll(false);
			} catch (e) {
				console.error('Ошибка при загрузке данных:', e);
			}
			setLoading(false);
		};

		if (slotId) {
			fetchBookingsAndUsers();
		} else {
			setTableData([]);
			setSelectedRows(new Set());
			setSelectAll(false);
		}
	}, [slotId, get]);

	const handleInputChange = (index, field, value) => {
		const updated = [...tableData];
		let cleanedValue = value;

		if (field === 'tempo') {
			cleanedValue = cleanedValue.replace(',', '.'); // заменяем запятую на точку
			const floatVal = parseFloat(cleanedValue);
			if (isNaN(floatVal) || floatVal > 100) return; // ограничение по максимуму
			updated[index][field] = cleanedValue;

			// Обновляем energy
			const strength = parseFloat(updated[index].strength) || 0;
			updated[index].energy = (
				floatVal * Math.pow(strength / 1200, 0.13)
			).toFixed(2);
		}

		if (field === 'strength') {
			const intVal = parseInt(cleanedValue);
			if (isNaN(intVal) || intVal > 1200) return;
			updated[index][field] = intVal;

			// Обновляем energy
			const tempo = parseFloat(updated[index].tempo) || 0;
			updated[index].energy = (
				tempo * Math.pow(intVal / 1200, 0.13)
			).toFixed(2);
		}

		setTableData(updated);
	};


	const handleSelectRow = (id) => {
		const updated = new Set(selectedRows);
		if (updated.has(id)) {
			updated.delete(id);
		} else {
			updated.add(id);
		}
		setSelectedRows(updated);
		setSelectAll(updated.size === tableData.length);
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(tableData.map(row => row.id)));
		}
		setSelectAll(!selectAll);
	};

	const handleSave = async () => {
		if (selectedRows.size === 0) {
			alert('Выберите хотя бы одну строку для записи');
			return;
		}
		setSaving(true);

		try {
			// Создаем массив промисов PATCH запросов
			const patchPromises = tableData
				.filter(row => selectedRows.has(row.id))
				.map(row => {
					const payload = {
						is_done: true,
						power: Number(row.strength) || 0,
						energy: Number(row.energy) || 0,
						tempo: Number(row.tempo) || 0,
					};
					return patch(patchBookingUrl(row.id), payload);
				});

			await Promise.all(patchPromises);

			alert('Данные успешно сохранены!');
			// Очистить таблицу и выбор
			setTableData([]);
			setSelectedRows(new Set());
			setSelectAll(false);
		} catch (error) {
			console.error('Ошибка при сохранении данных:', error);
			alert('Ошибка при сохранении данных. Попробуйте позже.');
		} finally {
			setSaving(false);
		}
	};

	const columns = [
		{
			key: 'checkbox',
			label: (
				<input
					type="checkbox"
					checked={selectAll}
					onChange={handleSelectAll}
				/>
			),
			renderCell: (row) => (
				<input
					type="checkbox"
					checked={selectedRows.has(row.id)}
					onChange={() => handleSelectRow(row.id)}
				/>
			),
		},
		{ key: 'fullName', label: 'Фамилия Имя' },
		{
			key: 'strength',
			label: 'Сила',
			renderCell: (row, index) => (
				<InputBase
					className='num-input'
					type="number"
					value={row.strength}
					onChange={(e) => handleInputChange(index, 'strength', e.target.value)}
				/>
			),
		},
		{
			key: 'tempo',
			label: 'Темп',
			renderCell: (row, index) => (
				<InputBase
					className='num-input'
					type="number"
					value={row.tempo}
					onChange={(e) => handleInputChange(index, 'tempo', e.target.value)}
				/>
			),
		},
		{
			key: 'energy',
			label: 'Энергия',
			renderCell: (row) => (
				<InputBase
					className='num-input'
					type="number"
					value={row.energy}
					readOnly
				/>
			),
		},
	];

	return (
		<>
			<Table
				columns={columns}
				data={tableData}
				loading={loading}
				emptyMessage="Нет бронирований для отображения"
			/>
			<ButtonMy
				className = 'button-write'
				onClick={handleSave}
				disabled={saving || selectedRows.size === 0}
				style={{ marginTop: 16, padding: '8px 16px', cursor: saving ? 'not-allowed' : 'pointer' }}
			>
				{saving ? 'Сохраняем...' : 'Записать'}
			</ButtonMy>
		</>
	);
};

export default BookingTable;
