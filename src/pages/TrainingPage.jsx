import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import DeviceAssignmentTable from '../components/Table/DeviceAssignmentTable.jsx';
import SprintTable from '../components/Table/SprintTable.jsx';
import useApi from '../hooks/useApi.hook';
import { getSlotsFilterUrl, patchBookingUrl } from '../helpers/constants';
import './TrainingPage.css';
import TempoPlayer from '../components/player/TempoPlayer.jsx';
import MqttListener from '../components/mqtt/MqttListener.jsx';
import ButtonMy from "../components/Buttons/ButtonMy.jsx";
import AdminControl from "./adminPanel_test.jsx";

const TrainingPage = () => {
	const tableRef = useRef();
	const api = useApi();

	const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
	const [slots, setSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [startSignal, setStartSignal] = useState(false);
	const [selectedTrack, setSelectedTrack] = useState('');
	const [isTrainingFinished, setIsTrainingFinished] = useState(false);

	const [lastFinishedSprint, setLastFinishedSprint] = useState(null);

	useEffect(() => {
		const fetchSlots = async () => {
			const startTime = `${selectedDate}T04:00:00`;
			const endTime = `${selectedDate}T22:00:00`;
			try {
				const { data } = await api.get(getSlotsFilterUrl(startTime, endTime));
				const options = data
					.map(slot => ({ label: new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: slot.id }))
					.sort((a, b) => new Date(`1970-01-01T${a.label}:00`) - new Date(`1970-01-01T${b.label}:00`));
				setSlots(options);
			} catch (e) { console.error('Ошибка при получении слотов:', e); }
		};
		fetchSlots();
	}, [selectedDate]);

	const handleStartFromMQTT = () => {
		setStartSignal(true);
		setTimeout(() => setStartSignal(false), 119999);
	};

	const handleTrackSelect = trackFile => setSelectedTrack(trackFile);

	const handleSprintFinished = (slotId, sprintId) => {
		console.log('🏁 Спринт завершён!', slotId, sprintId);
		setLastFinishedSprint({ slotId, sprintId });
	};

	const handleFinishTraining = async () => {
		const bookings = tableRef.current?.getBookings?.() || [];
		try {
			await Promise.all(bookings.map(b => api.patch(patchBookingUrl(b.id), { is_done: true })));
			alert('✔ Тренировка успешно завершена!');
			setIsTrainingFinished(true);
		} catch (error) {
			console.error('❌ Ошибка при завершении тренировки:', error);
			alert('❌ Ошибка при завершении тренировки. Попробуйте ещё раз.');
		}
	};

	return (
		<MainLayout>
			<MqttListener onStart={handleStartFromMQTT} />
			<TempoPlayer play={startSignal} track={selectedTrack} />

			<div className="all-conteiners">
				<div className="container-left-tr">
					<h2 className="text-xl font-bold">Привязка спортсменов к грушам</h2>
					<DeviceAssignmentTable
						ref={tableRef}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						selectedSlot={selectedSlot}
						setSelectedSlot={setSelectedSlot}
						slots={slots}
					/>
				</div>

				<div className="container-right-tr">
					{selectedSlot?.value && (
						<SprintTable
							slotId={selectedSlot.value}
							slotTime={selectedSlot.label}
							onTrackSelect={handleTrackSelect}
							onSprintFinished={handleSprintFinished}
						/>
					)}
				</div>
			</div>

			<div>
				{!isTrainingFinished && (
					<ButtonMy onClick={handleFinishTraining}>Завершить тренировку</ButtonMy>
				)}
			</div>

			<AdminControl lastFinishedSprint={lastFinishedSprint} />
		</MainLayout>
	);
};

export default TrainingPage;
