import React, { useState, useEffect } from 'react';
import DropdownInput from '../Forms/DropdownInput';
import { GetallusersUrl, postBookingAdminsUrl } from '../../helpers/constants';
import useApi from '../../hooks/useApi.hook';
import ModalBase from './ModalBase.jsx';
import ButtonMy from "../Buttons/ButtonMy.jsx";
import dayjs from 'dayjs';
import './BookingModal.css'

const BookingModal = ({ isOpen, onClose, onSubmit, slot }) => { // передаём весь объект slot
	const api = useApi();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		if (!isOpen) return;

		(async () => {
			try {
				const { data } = await api.get(GetallusersUrl);
				if (Array.isArray(data)) setUsers(data);
				else setUsers([]);
			} catch (err) {
				console.error('Ошибка загрузки пользователей:', err);
				setUsers([]);
			}
		})();
	}, [isOpen, api]);

	const handleUserChange = option => setSelectedUser(option);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedUser) {
			alert('Выберите пользователя!');
			return;
		}

		try {
			const response = await api.post(postBookingAdminsUrl, {
				user_id: selectedUser.value,
				slot_id: slot.id,
				created_at: new Date().toISOString(),
				source_record: 'администратор'
			});

			if (response.status === 201) {
				const fullUser = users.find(u => u.id === selectedUser.value);

				if (fullUser?.telegram_id && slot?.time) {
					const dateStr = dayjs(slot.time).format("DD.MM.YY");
					const timeStr = dayjs(slot.time).format("HH:mm");

					const message = `✅ Вы успешно записаны на тренировку!\nЖдем Вас ${dateStr} в ${timeStr} 🥊\n<i>Чтобы отменить запись — зайдите в приложении во вкладку "Пользователь (👤)" → "Мои Записи"</i>`;

					try {
						await fetch(`https://api.telegram.org/bot7728171720:AAGyOYHnvnwScbctXvaYu2p45rKQRU_T_Ik/sendMessage`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								chat_id: fullUser.telegram_id,
								text: message,
								parse_mode: "HTML"
							}),
						});
					} catch (err) {
						console.error("Ошибка при отправке сообщения в Telegram:", err);
					}
				}

				alert('Пользователь успешно записан!');
				onSubmit && onSubmit();
				onClose(true);
			} else {
				alert('Ошибка: запись не прошла.');
			}
		} catch (err) {
			console.error('Ошибка при записи пользователя:', err);
			alert('Ошибка при записи пользователя');
		}
	};

	if (!isOpen) return null;

	return (
		<ModalBase onClose={() => onClose(true)} className="modal-new">
			<form onSubmit={handleSubmit} className="modal-new-booking" style={{
				background: 'var(--background-color)',
				padding: '20px',
				borderRadius: '10px',
				boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
				margin: '10px'
			}}>
				<h3>Запись на тренировку</h3>
				<DropdownInput
					options={users.map(user => ({ value: user.id, label: `${user.last_name || ''} ${user.name || ''}`.trim() }))}
					value={selectedUser}
					onChange={handleUserChange}
					placeholder="Выберите пользователя"
					isClearable={true}
				/>
				<ButtonMy>Записать</ButtonMy>
			</form>
		</ModalBase>
	);
};

export default BookingModal;
