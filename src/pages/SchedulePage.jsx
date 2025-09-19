import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import Table from "../components/Table/Table";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import {
	GetallslotsUrl,
	postSlotsBulkUrl,
	GetallusersUrl,
	deleteSlotUrl,
	deleteBookingUrl,
	getSlotsFilterUrl
} from "../helpers/constants";
import useApi from "../hooks/useApi.hook";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import "./SchedulePage.css";
import ButtonMy from "../components/Buttons/ButtonMy.jsx";
import Modal from '../components/Modals/ModalBase';
import SlotsTableForm from '../components/Forms/SlotsTableForm';
import { UserPlus, Trash } from 'lucide-react';
import BookingModal from '../components/Modals/BookingModal';

const SchedulePage = () => {
	const api = useApi();
	const [slots, setSlots] = useState([]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [bookedUsers, setBookedUsers] = useState([]);
	const [modalTime, setModalTime] = useState(null);
	const [daySlots, setDaySlots] = useState([]);
	const slotsFormRef = useRef();

	const datesWithSlots = React.useMemo(() => {
		return [...new Set(slots.map(slot => format(parseISO(slot.time), 'yyyy-MM-dd')))];
	}, [slots]);

	const fetchSlots = async () => {
		try {
			const { data } = await api.get(GetallslotsUrl);
			setSlots(data);
			return data;
		} catch (error) {
			console.error("Ошибка при загрузке слотов", error);
			setSlots([]);
			return [];
		}
	};

	const fetchDaySlots = async (date = selectedDate) => {
		if (!date) return;

		const start = new Date(date);
		start.setHours(0, 0, 0, 0);
		const end = new Date(date);
		end.setHours(23, 59, 59, 999);

		try {
			const { data } = await api.get(getSlotsFilterUrl(start.toISOString(), end.toISOString()));
			setDaySlots(data);
			setSelectedSlot(null);
			setBookedUsers([]);
		} catch (e) {
			console.error("Ошибка при загрузке слотов на выбранный день", e);
			setDaySlots([]);
		}
	};

	useEffect(() => {
		fetchSlots();
	}, []);

	useEffect(() => {
		fetchDaySlots();
	}, [selectedDate]);

	const handleSubmitSlots = async () => {
		if (!slotsFormRef.current) return;
		const selectedSlots = slotsFormRef.current.getSelectedSlots();

		if (!selectedSlots.length) {
			alert('Выберите хотя бы один слот');
			return;
		}

		try {
			await api.post(postSlotsBulkUrl, { slots: selectedSlots });
			alert('Слоты успешно добавлены!');
			setModalOpen(false);
			await fetchSlots();
			await fetchDaySlots();
		} catch (error) {
			console.error('Ошибка при добавлении слотов', error);
			alert('Ошибка при добавлении слотов');
		}
	};

	const handleDeleteSlot = async (id) => {
		if (!window.confirm("Удалить этот слот?")) return;
		try {
			await api.delete(deleteSlotUrl(id));
			alert("Слот удалён");
			await fetchSlots();
			await fetchDaySlots();
		} catch (error) {
			console.error("Ошибка при удалении слота", error);
			alert("Ошибка при удалении слота");
		}
	};

	const handleDeleteBooking = async (bookingId) => {
		if (!window.confirm("Удалить эту запись?")) return;
		try {
			await api.delete(deleteBookingUrl(bookingId));
			alert("Запись удалена");
			setSelectedSlot(null);
			setBookedUsers([]);
			await fetchSlots();
			await fetchDaySlots();
		} catch (error) {
			console.error("Ошибка при удалении записи", error);
			alert("Ошибка при удалении записи");
		}
	};

	const handleRowClick = async (row) => {
		const slot = daySlots.find(s =>
			format(parseISO(s.time), "HH:00") === row.time
		);
		if (!slot || !slot.bookings?.length) {
			setBookedUsers([]);
			setSelectedSlot(null);
			return;
		}
		setSelectedSlot(slot);

		const userIds = slot.bookings.map(b => b.user_id);
		const query = `id__in=${userIds.join(',')}`;
		try {
			const { data: users } = await api.get(`${GetallusersUrl}?${query}`);
			const usersWithBookingInfo = users.map(user => {
				const booking = slot.bookings.find(b => b.user_id === user.id);
				return {
					...user,
					created_at: booking.created_at,
					source_record: booking.source_record,
					booking_id: booking.id
				};
			});
			setBookedUsers(usersWithBookingInfo);
		} catch (e) {
			console.error("Ошибка при загрузке пользователей", e);
		}
	};

	const refreshBookedUsers = async (slotToUse = selectedSlot) => {
		if (!slotToUse || !slotToUse.bookings?.length) return;
		const userIds = slotToUse.bookings.map(b => b.user_id);
		const query = `id__in=${userIds.join(',')}`;
		try {
			const { data: users } = await api.get(`${GetallusersUrl}?${query}`);
			const usersWithBookingInfo = users.map(user => {
				const booking = slotToUse.bookings.find(b => b.user_id === user.id);
				return {
					...user,
					created_at: booking.created_at,
					source_record: booking.source_record
				};
			});
			setBookedUsers(usersWithBookingInfo);
		} catch (e) {
			console.error("Ошибка при обновлении списка записанных", e);
		}
	};

	const selectedDaySlots = daySlots;

	const openBookingModal = (slotTime) => {
		const slot = selectedDaySlots.find(s =>
			format(parseISO(s.time), "HH:00") === slotTime
		);
		if (slot) {
			setSelectedSlot(slot);
			setModalTime(slotTime);
		}
	};

	const closeBookingModal = () => setModalTime(null);

	const tableData = selectedDaySlots.map(slot => ({
		type: slot.type,
		time: format(parseISO(slot.time), "HH:00"),
		number_of_places: slot.number_of_places,
		free_places: slot.free_places,
		action: ''
	})).sort((a, b) => parseInt(a.time) - parseInt(b.time));

	const columns = [
		{ key: 'time', label: 'Время' },
		{ key: 'type', label: 'Тип' },
		{ key: 'number_of_places', label: 'Кол-во' },
		{ key: 'free_places', label: 'Свободных' },
		{
			key: 'action',
			label: 'Записать',
			renderCell: (row) => (
				<button
					onClick={(e) => {
						e.stopPropagation();
						openBookingModal(row.time);
					}}
					title="Записать клиента"
					style={{ background: 'none', border: 'none', cursor: 'pointer' }}
				>
					<UserPlus size={18} color="#4caf50" />
				</button>
			)
		},
		{
			key: 'delete',
			label: 'Удалить',
			renderCell: (row) => {
				const slot = selectedDaySlots.find(s => format(parseISO(s.time), "HH:00") === row.time);
				if (!slot) return null;
				return (
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleDeleteSlot(slot.id);
						}}
						title="Удалить слот"
						style={{ background: 'none', border: 'none', cursor: 'pointer' }}
					>
						<Trash size={18} color="#e53935" />
					</button>
				);
			}
		}
	];

	return (
		<MainLayout>
			<div className="schedule-page">
				<div className="calendar-section">
					<MonthCalendar
						hasSlots={datesWithSlots}
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
										<SlotsTableForm ref={slotsFormRef} selectedDate={selectedDate} />
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

					{modalTime && selectedSlot && (
						<BookingModal
							isOpen={!!modalTime}
							onClose={closeBookingModal}
							slot={selectedSlot}          // передаём весь объект слота
							onSubmit={async () => {
								// 1. Обновляем все слоты
								const freshSlots = await fetchSlots();

								// 2. Ищем нужный слот по ID
								const updatedSlot = freshSlots.find(s => s.id === selectedSlot.id);

								if (updatedSlot) {
									// 3. Обновляем selectedSlot, чтобы перерисовать таблицу слотов
									setSelectedSlot(updatedSlot);

									// 4. Обновляем список записавшихся — используем полученный SLOT
									await refreshBookedUsers(updatedSlot);

									// 5. Обновляем daySlots — чтобы таблица слотов дня тоже обновилась
									const start = new Date(selectedDate);
									start.setHours(0, 0, 0, 0);
									const end = new Date(selectedDate);
									end.setHours(23, 59, 59, 999);

									try {
										const { data } = await api.get(getSlotsFilterUrl(start.toISOString(), end.toISOString()));
										setDaySlots(data);
									} catch (e) {
										console.error("Ошибка при обновлении таблицы слотов дня", e);
									}
								}
							}}
						/>
					)}


					{selectedSlot && bookedUsers.length > 0 && (
						<>
							<h3>Записавшиеся на слот {format(parseISO(selectedSlot.time), "HH:00")}</h3>
							<Table
								columns={[
									{ key: 'full_name', label: 'ФИО' },
									{ key: 'created_at', label: 'Дата записи' },
									{ key: 'source_record', label: 'Источник' },
									{
										key: 'delete',
										label: 'Удалить',
										renderCell: (row) => (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteBooking(row.booking_id);
												}}
												title="Удалить запись"
												style={{ background: 'none', border: 'none', cursor: 'pointer' }}
											>
												<Trash size={18} color="#e53935" />
											</button>
										)
									}
								]}
								data={bookedUsers.map(user => ({
									full_name: `${user.last_name || ''} ${user.name || ''}`.trim(),
									created_at: format(parseISO(user.created_at), "dd.MM.yyyy HH:mm"),
									source_record: user.source_record,
									booking_id: user.booking_id
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
