// src/pages/TrainingPage.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import DeviceAssignmentTable from '../components/Table/DeviceAssignmentTable.jsx';
import BookingTable from '../components/Table/TrainingTableComplited';
import useApi from '../hooks/useApi.hook';
import { getSlotsFilterUrl } from '../helpers/constants';
import './TrainingPage.css';
import StartButton from '../components/Buttons/StartButton.jsx';
import TempoPlayer from '../components//player/TempoPlayer.jsx';
import MqttListener from '../components/mqtt/MqttListener.jsx';

const TrainingPage = () => {
	const api = useApi();

	const [selectedDate, setSelectedDate] = useState(() =>
		new Date().toISOString().split('T')[0]
	);
	const [slots, setSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [startSignal, setStartSignal] = useState(false); // 🚀 Сигнал от брокера

	useEffect(() => {
		const fetchSlots = async () => {
			const startTime = `${selectedDate}T04:00:00`;
			const endTime = `${selectedDate}T22:00:00`;

			try {
				const { data } = await api.get(getSlotsFilterUrl(startTime, endTime));

				const options = data
					.map((slot) => ({
						label: new Date(slot.time).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						}),
						value: slot.id,
					}))
					.sort((a, b) => {
						const timeA = new Date(`1970-01-01T${a.label}:00`);
						const timeB = new Date(`1970-01-01T${b.label}:00`);
						return timeA - timeB;
					});

				setSlots(options);
			} catch (e) {
				console.error('Ошибка при получении слотов:', e);
			}
		};

		fetchSlots();
	}, [selectedDate]);

	const handleStartFromMQTT = () => {
		setStartSignal(true);
	};

	return (
		<MainLayout>
			<MqttListener onStart={handleStartFromMQTT} />
			<TempoPlayer play={startSignal} />

			<div className="all-conteiners">
				<div className="container-left">
					<DeviceAssignmentTable
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						selectedSlot={selectedSlot}
						setSelectedSlot={setSelectedSlot}
						slots={slots}
					/>
				</div>
				<div className="container-right">
					{selectedSlot?.value && (
						<BookingTable slotId={selectedSlot.value} />
					)}
				</div>
			</div>
			<StartButton />
		</MainLayout>
	);
};

export default TrainingPage;
