// components/Admin/DeviceAssignmentTable.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import DateInput from '../Forms/DateInput';
import DropdownInput from '../Forms/DropdownInput';
import useApi from '../../hooks/useApi.hook';
import { GetBookingFilterUrl, GetoneuserUrl, getStatusDeviceUrl, postBindingBagsUrl } from '../../helpers/constants';
import './DeviceAssignmentTable.css';
import ButtonMy from "../Buttons/ButtonMy.jsx";


const DeviceAssignmentTable = forwardRef(({
								   selectedSlot,
								   setSelectedSlot,
								   slots,
								   selectedDate,
								   setSelectedDate
							   }, ref) => {
	const api = useApi();
	const [bookings, setBookings] = useState([]);
	const [userMap, setUserMap] = useState({});
	const [assignments, setAssignments] = useState({});
	const [deviceOptions, setDeviceOptions] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [bindingSuccess, setBindingSuccess] = useState(false);
	const [loadingUsers, setLoadingUsers] = useState(false);

	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const { data } = await api.get(getStatusDeviceUrl);
				const deviceList = Object.keys(data.devices || {}).map((deviceName) => ({
					label: deviceName,
					value: deviceName,
				}));
				setDeviceOptions(deviceList);
			} catch (error) {
				console.error('Ошибка при загрузке устройств:', error);
			}
		};

		fetchDevices();
	}, []);

	useEffect(() => {
		if (!selectedSlot) return;

		const fetchBookingsAndUsers = async () => {
			setLoadingUsers(true);
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
			} finally {
				// ▼ ДОБАВЛЕНО:
				setLoadingUsers(false);
			}
		};

		fetchBookingsAndUsers();
	}, [selectedSlot]);

	const getAvailableDevices = (currentUserId) => {
		const assignedValues = Object.entries(assignments)
			.filter(([userId]) => userId !== currentUserId)
			.map(([, device]) => device?.value);

		return deviceOptions.filter(device => !assignedValues.includes(device.value));
	};

	const handleAssignmentChange = (userId, device) => {
		setAssignments((prev) => ({ ...prev, [userId]: device }));
	};

	useImperativeHandle(ref, () => ({
		getBookings: () => bookings,
	}));

	return (
		<div className='device-table-card'>
			<div className='device-form'>
				<DateInput value={selectedDate} onChange={setSelectedDate} />
				<DropdownInput
					value={selectedSlot}
					onChange={setSelectedSlot}
					options={slots}
					placeholder="Выберите слот"
					disabled={isSubmitted}
				/>
			</div>

			{loadingUsers ? (
				<p style={{ opacity: 0.7 }}>Загружаем пользователей…</p>
			) : bookings.length > 0 ? (
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
										disabled={isSubmitted}
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
			{bookings.length > 0 && !isSubmitted && !loadingUsers && (
				<ButtonMy
					onClick={async () => {
						try {
							const bindings = Object.entries(assignments).map(([user_id, device]) => ({
								user_id,
								sensor_id: device.value
							}));

							await api.post(postBindingBagsUrl, {
								slot_id: selectedSlot?.value,
								bindings,
							});

							setIsSubmitted(true);
							setBindingSuccess(true);
						} catch (e) {
							console.error('Ошибка при привязке:', e);
							alert('Ошибка при отправке привязки');
						}
					}}
					style={{
						marginTop: '16px',
						padding: '10px 20px',
						cursor: 'pointer',
					}}
				>
					Привязать
				</ButtonMy>
			)}

			{bindingSuccess && (
				<div style={{ marginTop: '16px', color: 'green', fontWeight: 'bold' }}>
					✅ Успешно привязано!
				</div>
			)}
		</div>
	);
});

export default DeviceAssignmentTable;
