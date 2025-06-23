// components/Admin/DeviceAssignmentTable.jsx
import React, { useState, useEffect } from 'react';
import DateInput from '../Forms/DateInput';
import DropdownInput from '../Forms/DropdownInput';
import useApi from '../../hooks/useApi.hook';
import { GetBookingFilterUrl, GetoneuserUrl } from '../../helpers/constants';
import './DeviceAssignmentTable.css';

const allDevices = Array.from({ length: 10 }, (_, i) => ({
	label: `BAG0${i + 1}`,
	value: `BAG0${i + 1}`,
}));

const DeviceAssignmentTable = ({
								   selectedSlot,
								   setSelectedSlot,
								   slots,
								   selectedDate,
								   setSelectedDate
							   }) => {
	const api = useApi();
	const [bookings, setBookings] = useState([]);
	const [userMap, setUserMap] = useState({});
	const [assignments, setAssignments] = useState({});

	// Загружаем записи и пользователей при выборе слота
	useEffect(() => {
		if (!selectedSlot) return;

		const fetchBookingsAndUsers = async () => {
			try {
				const { data: bookingData } = await api.get(GetBookingFilterUrl(selectedSlot.value));
				setBookings(bookingData);

				const users = {};
				await Promise.all(
					bookingData.map(async (booking) => {
						const userId = booking.user_id;
						try {
							const { data: userData } = await api.get(GetoneuserUrl(userId));
							users[userId] = userData;
						} catch (e) {
							console.error(`Ошибка при получении пользователя ${userId}`, e);
						}
					})
				);

				setUserMap(users);
			} catch (e) {
				console.error('Ошибка при получении записей:', e);
			}
		};

		fetchBookingsAndUsers();
	}, [selectedSlot]);

	const getAvailableDevices = (currentUserId) => {
		const assignedValues = Object.entries(assignments)
			.filter(([userId]) => userId !== currentUserId)
			.map(([, device]) => device?.value);

		return allDevices.filter(device => !assignedValues.includes(device.value));
	};

	const handleAssignmentChange = (userId, device) => {
		setAssignments((prev) => ({ ...prev, [userId]: device }));
	};

	return (
		<div className='device-table-card'>
			<h3>Привязка спортсменов к грушам</h3>
			<div className='device-form'>
				<DateInput value={selectedDate} onChange={setSelectedDate} />
				<DropdownInput
					value={selectedSlot}
					onChange={setSelectedSlot}
					options={slots}
					placeholder="Выберите слот"
				/>
			</div>

			{bookings.length > 0 ? (
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
					<tr>
						<th style={{ textAlign: 'left', padding: 8 }}>Спортсмен</th>
						<th style={{ textAlign: 'left', padding: 8 }}>Груша</th>
					</tr>
					</thead>
					<tbody>
					{bookings.map((booking) => {
						const userId = booking.user_id;
						const user = userMap[userId];
						return (
							<tr key={booking.id}>
								<td style={{ padding: 8 }}>
									{user ? `${user.name} ${user.last_name}` : userId}
								</td>
								<td style={{ padding: 8 }}>
									<DropdownInput
										options={getAvailableDevices(userId)}
										value={assignments[userId] || null}
										onChange={(selected) => handleAssignmentChange(userId, selected)}
										placeholder="Выберите устройство"
									/>
								</td>
							</tr>
						);
					})}
					</tbody>
				</table>
			) : selectedSlot ? (
				<p>Нет записей на выбранный слот.</p>
			) : null}
		</div>
	);
};

export default DeviceAssignmentTable;

