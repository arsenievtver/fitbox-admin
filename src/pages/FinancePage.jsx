import React, { useEffect, useState } from 'react';
import DropdownInput from '../components/Forms/DropdownInput';
import RadioGroup from '../components/Forms/RadioGroup';
import { GetallusersUrl } from '../helpers/constants';
import useApi from '../hooks/useApi.hook';
import MainLayout from '../components/layouts/MainLayout';
import './FinancePage.css';
import ButtonMy from "../components/Buttons/ButtonMy.jsx";

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
	}, [api]);

	const handleUserChange = option => setSelectedUser(option);

	return (
		<MainLayout>
			<div className="form-section">
				<div className="dropdown-input-users">
					<DropdownInput
						options={users.map(user => ({ value: user.id, label: `${user.last_name || ''} ${user.name || ''}`.trim() }))}
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
						onChange={setPaymentMethod}
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
							{ value: 'trial_1250', label: '1 тренировка за 1 250 (пробная)' },
							{ value: 'single_2000', label: '1 тренировка за 2 000 (обычная)' },
							{ value: 'pack_4_6000', label: '4 тренировки за 6 000' },
							{ value: 'pack_8_10000', label: '8 тренировок за 10 000' },
						]}
					/>
				</div>
				<ButtonMy>К оплате</ButtonMy>
			</div>

		</MainLayout>
	);
};

export default FinancePage;
