import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import Table from "../components/Table/Table";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import { GetallslotsUrl, postSlotsBulkUrl, GetallusersUrl} from "../helpers/constants";
import useApi from "../hooks/useApi.hook";
import { format, parseISO, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import "./SchedulePage.css";
import ButtonMy from "../components/Buttons/ButtonMy.jsx";
import Modal from '../components/Modals/ModalBase';
import SlotsTableForm from '../components/Forms/SlotsTableForm';

const SchedulePage = () => {
	const api = useApi();
	const [slots, setSlots] = useState([]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [bookedUsers, setBookedUsers] = useState([]);
	const slotsFormRef = useRef();

	// Функция загрузки слотов — вызовем и при монтировании, и после записи новых слотов
	const fetchSlots = async () => {
		try {
			const { data } = await api.get(GetallslotsUrl);
			setSlots(data);
		} catch (e) {
			console.error("Ошибка при загрузке слотов", e);
		}
	};

	useEffect(() => {
		fetchSlots();
	}, [api]);

	useEffect(() => {
		setSelectedSlot(null);
		setBookedUsers([]);
	}, [selectedDate]);

	const selectedDaySlots = slots.filter(slot =>
		isSameDay(parseISO(slot.time), selectedDate)
	);

	const tableData = selectedDaySlots.map(slot => ({
		type: slot.type,
		time: format(parseISO(slot.time), "HH:00"),
		number_of_places: slot.number_of_places,
		free_places: slot.free_places
	}))
		.sort((a, b) => {
			const timeA = parseInt(a.time.split(':')[0], 10);
			const timeB = parseInt(b.time.split(':')[0], 10);
			return timeA - timeB;
		});

	const handleSubmitSlots = async () => {
		if (!slotsFormRef.current) return;
		const selectedSlots = slotsFormRef.current.getSelectedSlots();

		if (!selectedSlots.length) {
			alert('Выберите хотя бы один слот');
			return;
		}

		try {
			await api.post(postSlotsBulkUrl, {
				slots: selectedSlots
			});
			alert('Слоты успешно добавлены!');
			setModalOpen(false);
			await fetchSlots(); // Обновляем данные после добавления
		} catch (error) {
			console.error('Ошибка при добавлении слотов', error);
			alert('Ошибка при добавлении слотов');
		}
	};

	const columns = [
		{ key: 'time', label: 'Время' },
		{ key: 'type', label: 'Тип' },
		{ key: 'number_of_places', label: 'Кол-во мест' },
		{ key: 'free_places', label: 'Свободных мест' },
	];

	const handleRowClick = async (row) => {
		const slot = selectedDaySlots.find(s =>
			format(parseISO(s.time), "HH:00") === row.time
		);

		if (!slot || !slot.bookings?.length) {
			setBookedUsers([]);
			setSelectedSlot(null);
			return;
		}

		setSelectedSlot(slot); // сохраняем выбранный слот

		const userIds = slot.bookings.map(b => b.user_id);
		const query = userIds.map(id => `id__in=${id}`).join('&');
		try {
			const { data: users } = await api.get(`${GetallusersUrl}?${query}`);
			// Добавим created_at и source_record из booking
			const usersWithBookingInfo = users.map(user => {
				const booking = slot.bookings.find(b => b.user_id === user.id);
				return {
					...user,
					created_at: booking.created_at,
					source_record: booking.source_record
				};
			});
			setBookedUsers(usersWithBookingInfo);
		} catch (e) {
			console.error("Ошибка при загрузке пользователей", e);
		}
	};


	return (
		<MainLayout>
			<div className="schedule-page">
				<div className="calendar-section">
					<MonthCalendar
						slots={slots}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						currentMonth={currentMonth}
						setCurrentMonth={setCurrentMonth}
					/>
				</div>
				<div className="table-section">
					<div className='title-table-slots'>
						<h2>Слоты на {format(selectedDate, "d MMMM yyyy", { locale: ru })}</h2>
						<div>
							<ButtonMy onClick={() => setModalOpen(true)}>Добавить слоты</ButtonMy>

							{modalOpen && (
								<Modal className="modal-for-form-slots" onClose={() => setModalOpen(false)}>
									<div className="modal-form-layout">
										<SlotsTableForm
											className="full-width-slots-table"
											ref={slotsFormRef}
											selectedDate={selectedDate}
										/>
										<ButtonMy onClick={handleSubmitSlots}>Записать</ButtonMy>
									</div>
								</Modal>
							)}
						</div>
					</div>
					<Table
						columns={columns}
						data={tableData}
						emptyMessage="Нет занятий на этот день"
						onRowClick={handleRowClick}
					/>
					{selectedSlot && bookedUsers.length > 0 && (
						<>
							<h3>Записавшиеся на слот {format(parseISO(selectedSlot.time), "HH:00")}</h3>
							<Table
								columns={[
									{ key: 'full_name', label: 'ФИО' },
									{ key: 'created_at', label: 'Дата записи' },
									{ key: 'source_record', label: 'Источник' }
								]}
								data={bookedUsers.map(user => ({
									full_name: `${user.last_name || ''} ${user.name || ''}`.trim(),
									created_at: format(parseISO(user.created_at), "dd.MM.yyyy HH:mm"),
									source_record: user.source_record
								}))}
								emptyMessage="Нет пользователей"
							/>
						</>
					)}

				</div>
			</div>
		</MainLayout>
	);
};

export default SchedulePage;
