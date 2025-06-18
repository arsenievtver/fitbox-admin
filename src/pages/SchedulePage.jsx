import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import Table from "../components/Table/Table";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import { GetallslotsUrl, postSlotsBulkUrl, GetallusersUrl, deleteSlotUrl, deleteBookingUrl, getSlotsFilterUrl } from "../helpers/constants";
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
	const slotsFormRef = useRef();
	const [modalTime, setModalTime] = useState(null);
	const [daySlots, setDaySlots] = useState([]);

	const datesWithSlots = React.useMemo(() => {
		return [...new Set(
			slots.map(slot => format(parseISO(slot.time), 'yyyy-MM-dd'))
		)];
	}, [slots]);



	const handleDeleteBooking = async (bookingId) => {
		if (!window.confirm("Удалить эту запись?")) return;

		try {
			await api.delete(deleteBookingUrl(bookingId));
			alert("Запись удалена");
			setSelectedSlot(null);
			setBookedUsers([]);
			await fetchSlots();
		} catch (error) {
			console.error("Ошибка при удалении записи", error);
			alert("Ошибка при удалении записи");
		}
	};

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

	useEffect(() => {
		const fetchDaySlots = async () => {
			if (!selectedDate) return;

			const start = new Date(selectedDate);
			start.setHours(0, 0, 0, 0);
			const end = new Date(selectedDate);
			end.setHours(23, 59, 59, 999);

			const startISO = start.toISOString();
			const endISO = end.toISOString();

			try {
				const { data } = await api.get(getSlotsFilterUrl(startISO, endISO));
				setDaySlots(data);
				setSelectedSlot(null);
				setBookedUsers([]);
			} catch (e) {
				console.error("Ошибка при загрузке слотов на выбранный день", e);
				setDaySlots([]);
			}
		};

		fetchDaySlots();
	}, [selectedDate]);

	useEffect(() => {
		setSelectedSlot(null);
		setBookedUsers([]);
	}, [selectedDate]);

	useEffect(() => {
		fetchSlots();
	}, []);

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

	const closeBookingModal = () => {
		setModalTime(null);
	};

	const tableData = selectedDaySlots.map(slot => ({
		type: slot.type,
		time: format(parseISO(slot.time), "HH:00"),
		number_of_places: slot.number_of_places,
		free_places: slot.free_places,
		action: ''
	})).sort((a, b) => {
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
			await api.post(postSlotsBulkUrl, { slots: selectedSlots });
			alert('Слоты успешно добавлены!');
			setModalOpen(false);
			await fetchSlots();
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
		} catch (error) {
			console.error("Ошибка при удалении слота", error);
			alert("Ошибка при удалении слота");
		}
	};

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
					style={{
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
					title="Записать клиента"
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
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
						title="Удалить слот"
					>
						<Trash size={18} color="#e53935" />
					</button>
				);
			}
		}
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
					{modalTime && selectedSlot && (
						<BookingModal
							time={modalTime}
							isOpen={!!modalTime}
							onClose={closeBookingModal}
							slotId={selectedSlot.id}
							onSubmit={async () => {
								const freshSlots = await fetchSlots();
								const updatedSlot = freshSlots.find(s => s.id === selectedSlot.id);
								if (updatedSlot) {
									setSelectedSlot(updatedSlot);
									await refreshBookedUsers(updatedSlot);
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
												style={{
													background: 'none',
													border: 'none',
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
												title="Удалить запись"
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

