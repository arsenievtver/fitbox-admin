import React, { useState, useEffect } from 'react';
import DropdownInput from '../Forms/DropdownInput';
import { GetallusersUrl, postBookingAdminsUrl } from '../../helpers/constants';
import useApi from '../../hooks/useApi.hook';
import ModalBase from './ModalBase.jsx';
import ButtonMy from "../Buttons/ButtonMy.jsx";
import './BookingModal.css'

const BookingModal = ({ isOpen, onClose, onSubmit, slotId }) => {
	const api = useApi();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		if (!isOpen) return;

		const fetchUsers = async () => {
			try {
				const { data } = await api.get(GetallusersUrl);
				console.log('Получены пользователи:', data);
				if (Array.isArray(data)) {
					setUsers(data);
				} else {
					console.warn('Получен не массив пользователей:', data);
					setUsers([]);
				}
			} catch (error) {
				console.error('Ошибка загрузки пользователей:', error);
				setUsers([]);
			}
		};
		fetchUsers();
	}, [isOpen, api]);

	const handleUserChange = option => setSelectedUser(option);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedUser) {
			alert('Выберите пользователя!');
			return;
		}

		try {
			await api.post(postBookingAdminsUrl, {
				user_id: selectedUser.value,
				slot_id: slotId,
				created_at: new Date().toISOString(),
				source_record: 'администратор'
			});
			alert('Пользователь успешно записан!');
			onSubmit && onSubmit(); // если передан — можно обновить слоты
			onClose(true);
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
				<ButtonMy className="button-new-booking">Записать</ButtonMy>
			</form>
		</ModalBase>
	);
};

export default BookingModal;
