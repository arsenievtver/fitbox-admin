import React, { useState } from 'react';
import ModalBase from '../Modals/ModalBase.jsx';
import PhoneInput from '../Forms/PhoneInput.jsx';
import InputBase from '../Forms/InputBase.jsx';
import RadioGroup from '../Forms/RadioGroup.jsx';
import DateInput from '../Forms/DateInput.jsx';
import ButtonMy from '../Buttons/ButtonMy.jsx';
import useApi from '../../hooks/useApi.hook';
import { registerUrl } from '../../helpers/constants';
import './CreateUserModal.css'

const CreateUserModal = ({ isOpen, onClose, onCreated }) => {
	const api = useApi();

	const [form, setForm] = useState({
		phone: '',
		email: '',
		last_name: '',
		name: '',
		father_name: '',
		gender: 'муж',
		date_of_birth: null,
		password: 'box'
	});

	const handleChange = (field, value) => {
		setForm(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		try {
			const dateObj = form.date_of_birth instanceof Date
				? form.date_of_birth
				: form.date_of_birth
					? new Date(form.date_of_birth)
					: null;

			await api.post(registerUrl, {
				...form,
				gender: form.gender === 'муж' ? 'муж' : 'жен',
				date_of_birth: dateObj ? dateObj.toISOString().split('T')[0] : null
			});
			alert('Клиент успешно создан!');
			onClose();
			onCreated?.();
		} catch (error) {
			console.error('Ошибка при создании клиента:', error);
			alert('Ошибка при создании клиента');
		}
	};

	if (!isOpen) return null;

	return (
		<ModalBase onClose={onClose} className="modal-new-user">
			<h3 style={{ textAlign: 'center', marginTop: 0}}>Создать нового клиента</h3>

			{/* Обёртка для двух колонок */}
			<div style={{ display: 'flex', gap: 10, justifyContent: 'space-around' }}>
				{/* Левая колонка */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<PhoneInput
						value={form.phone}
						onChange={(value) => handleChange('phone', value)}
						placeholder="Номер телефона"
					/>
					<InputBase
						value={form.email}
						type="email"
						onChange={(e) => handleChange('email', e.target.value)}
						placeholder="E-mail"
					/>
					<InputBase
						value={form.last_name}
						onChange={(e) => handleChange('last_name', e.target.value)}
						placeholder="Фамилия"
					/>
					<InputBase
						value={form.name}
						onChange={(e) => handleChange('name', e.target.value)}
						placeholder="Имя"
					/>
					<InputBase
						value={form.father_name}
						onChange={(e) => handleChange('father_name', e.target.value)}
						placeholder="Отчество"
					/>
				</div>

				{/* Правая колонка */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div>
						<div style={{ fontSize: 14, marginBottom: 4 }}>Пол</div>
						<RadioGroup
							options={[
								{ label: 'Мужской', value: 'муж' },
								{ label: 'Женский', value: 'жен' }
							]}
							value={form.gender}
							onChange={(value) => handleChange('gender', value)}
						/>
					</div>
					<div>
						<div style={{ fontSize: 14, marginBottom: 4 }}>Дата рождения</div>
						<DateInput
							value={form.date_of_birth}
							onChange={(value) => handleChange('date_of_birth', value)}
						/>
					</div>
					<div>
						<div style={{ fontSize: 14, marginBottom: 4 }}>Пароль</div>
						<InputBase
							value={form.password}
							onChange={(e) => handleChange('password', e.target.value)}
							placeholder="Пароль"
						/>
					</div>
				</div>
			</div>

			{/* Кнопка по центру */}
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
				<ButtonMy onClick={handleSubmit}>Создать</ButtonMy>
			</div>
		</ModalBase>
	);

};

export default CreateUserModal;
