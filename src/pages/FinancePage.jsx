import React, { useEffect, useState } from 'react';
import DropdownInput from '../components/Forms/DropdownInput';
import RadioGroup from '../components/Forms/RadioGroup';
import { GetallusersUrl, postPaymentAdminUrl } from '../helpers/constants';
import useApi from '../hooks/useApi.hook';
import MainLayout from '../components/layouts/MainLayout';
import './FinancePage.css';
import ButtonMy from "../components/Buttons/ButtonMy.jsx";
import { toast } from 'react-toastify';

const FinancePage = () => {
	const api = useApi();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [trainingOption, setTrainingOption] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const { data } = await api.get(GetallusersUrl);
				if (Array.isArray(data)) {
					setUsers(data);
				} else {
					setUsers([]);
				}
			} catch (error) {
				console.error('Ошибка загрузки пользователей:', error);
				setUsers([]);
			}
		};
		fetchUsers();
	}, [api]);

	const handleUserChange = option => setSelectedUser(option);
	const handlePaymentMethodChange = option => setPaymentMethod(option);

	const handlePayment = async () => {
		if (!selectedUser || !paymentMethod || !trainingOption) {
			toast.error('Заполните все поля!');
			return;
		}

		// Проверяем только "cash" как рабочий метод оплаты
		if (paymentMethod.value !== 'cash') {
			toast.warning('Данный способ оплаты пока не подключён');
			return;
		}

		const payload = {
			created_at: new Date().toISOString(),
			user_id: selectedUser.value,
			count: trainingOption.count,
			amount: trainingOption.amount,
			payment_method: paymentMethod.label,
		};

		try {
			await api.post(postPaymentAdminUrl, payload);
			toast.success('Платёж успешно добавлен!');
			// Очистка формы после успешного добавления
			setSelectedUser(null);
			setPaymentMethod(null);
			setTrainingOption(null);
		} catch (error) {
			console.error('Ошибка при добавлении платежа:', error);
			toast.error('Ошибка при добавлении платежа');
		}
	};

	// Текущая дата для отображения, можно использовать для информирования, не для отправки
	const currentDate = new Date().toLocaleDateString('ru-RU');

	return (
		<MainLayout>
			<div className="form-section">
				<div className="dropdown-input-users">
					<DropdownInput
						options={users.map(user => ({
							value: user.id,
							label: `${user.last_name || ''} ${user.name || ''}`.trim()
						}))}
						value={selectedUser}
						onChange={handleUserChange}
						placeholder="Выберите пользователя"
						isClearable={true}
					/>
				</div>

				<div className="dropdown-input-payment">
					<DropdownInput
						options={[
							{ value: 'cash', label: 'Касса' },
							{ value: 'terminal', label: 'Терминал' },
							{ value: 'sbp', label: 'СБП' },
						]}
						value={paymentMethod}
						onChange={handlePaymentMethodChange}
						placeholder="Выберите способ оплаты"
						isClearable={true}
					/>
				</div>

				<div className="radio-group-training">
					<RadioGroup
						name="trainingType"
						value={trainingOption}
						onChange={setTrainingOption}
						options={[
							{
								value: 'trial_1250',
								label: '1 тренировка за 1 250 (пробная)',
								count: 1,
								amount: 1250
							},
							{
								value: 'single_2000',
								label: '1 тренировка за 2 000 (обычная)',
								count: 1,
								amount: 2000
							},
							{
								value: 'pack_4_6000',
								label: '4 тренировки за 6 000',
								count: 4,
								amount: 6000
							},
							{
								value: 'pack_8_10000',
								label: '8 тренировок за 10 000',
								count: 8,
								amount: 10000
							},
						]}
					/>
				</div>

				<div style={{ textAlign: 'right', marginTop: '10px', color: '#888', fontSize: '14px' }}>
					Текущая дата: {currentDate}
				</div>

				<ButtonMy onClick={handlePayment}>К оплате</ButtonMy>
			</div>
		</MainLayout>
	);
};

export default FinancePage;
