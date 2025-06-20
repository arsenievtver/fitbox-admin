import React, { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi.hook';
import { GetOneUserBookingUrl, deleteBookingUrl } from '../../helpers/constants';
import Table from '../Table/Table';
import { format, parseISO } from 'date-fns';
import { Trash } from 'lucide-react';
import DateInput from '../Forms/DateInput';

const UserBookingTable = ({ userId }) => {
	const api = useApi();
	const [bookings, setBookings] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [filterIsDone, setFilterIsDone] = useState('all'); // 'all', 'yes', 'no'

	useEffect(() => {
		if (!userId) return;

		const fetchBookings = async () => {
			try {
				const { data } = await api.get(GetOneUserBookingUrl(userId));
				setBookings(data);
			} catch (error) {
				console.error('Ошибка при загрузке записей пользователя:', error);
				setBookings([]);
			}
		};

		fetchBookings();
	}, [userId]);

	useEffect(() => {
		const filteredData = bookings.filter(b => {
			const time = parseISO(b.slot.time);

			let start = startDate ? new Date(startDate) : null;
			let end = endDate ? new Date(endDate) : null;
			if (end) end.setHours(23, 59, 59, 999);

			const afterStart = !start || time >= start;
			const beforeEnd = !end || time <= end;

			const doneMatches =
				filterIsDone === 'all' ||
				(filterIsDone === 'yes' && b.is_done) ||
				(filterIsDone === 'no' && !b.is_done);

			return afterStart && beforeEnd && doneMatches;
		});

		setFiltered(filteredData);
	}, [bookings, startDate, endDate, filterIsDone]);

	const handleDelete = async (id) => {
		if (!window.confirm('Удалить эту запись?')) return;
		try {
			await api.delete(deleteBookingUrl(id));
			const { data } = await api.get(GetOneUserBookingUrl(userId));
			setBookings(data);
		} catch (err) {
			console.error('Ошибка при удалении:', err);
			alert('Не удалось удалить запись');
		}
	};

	const columns = [
		{ key: 'date', label: 'Дата тренировки' },
		{ key: 'type', label: 'Тип тренировки' },
		{ key: 'is_done', label: 'Состоялась' },
		{ key: 'power', label: 'Сила' },
		{ key: 'energy', label: 'Энергия' },
		{ key: 'tempo', label: 'Ритм' },
		{ key: 'source_record', label: 'Источник' },
		{
			key: 'delete',
			label: '',
			renderCell: (row) =>
				row.is_done === 'нет' && (
					<button
						onClick={() => handleDelete(row.id)}
						style={{ background: 'none', border: 'none', cursor: 'pointer' }}
						title="Удалить"
					>
						<Trash size={18} color="#e53935" />
					</button>
				)
		}
	];

	const tableData = filtered.map(b => ({
		id: b.id,
		date: format(parseISO(b.slot.time), 'dd.MM.yyyy HH:mm'),
		type: b.slot.type,
		is_done: b.is_done ? 'да' : 'нет',
		power: b.power ?? '-',
		energy: b.energy ?? '-',
		tempo: b.tempo ?? '-',
		source_record: b.source_record ?? '-'
	}));

	return (
		<div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<h3 style={{ marginBottom: 16 }}>Записи на тренировки</h3>

			<div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
				<div>
					<div style={{ fontSize: 14, marginBottom: 4 }}>Начало периода</div>
					<DateInput value={startDate} onChange={setStartDate} />
				</div>
				<div>
					<div style={{ fontSize: 14, marginBottom: 4 }}>Окончание периода</div>
					<DateInput value={endDate} onChange={setEndDate} />
				</div>
				<div>
					<div style={{ fontSize: 14, marginBottom: 4 }}>Состоялась</div>
					<select
						value={filterIsDone}
						onChange={(e) => setFilterIsDone(e.target.value)}
						style={{
							padding: '6px 10px',
							fontSize: 14,
							borderRadius: 4,
							border: '1px solid #ccc',
							background: '#fff'
						}}
					>
						<option value="all">Все</option>
						<option value="yes">Да</option>
						<option value="no">Нет</option>
					</select>
				</div>
			</div>

			<div style={{ width: '100%' }}>
				<Table
					columns={columns}
					data={tableData}
					emptyMessage="Нет записей на тренировки"
				/>
			</div>
		</div>
	);
};

export default UserBookingTable;
