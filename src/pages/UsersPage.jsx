import MainLayout from '../components/layouts/MainLayout';
import './SchedulePage.css';
import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi.hook';
import UniversalTable from '../components/Table/Table';
import { GetallusersUrl } from '../helpers/constants';
import { FaFileAlt, FaEnvelope } from 'react-icons/fa';
import './UsersPage.css';
import { useNavigate } from "react-router-dom";
import ButtonMy from '../components/Buttons/ButtonMy.jsx';
import CreateUserModal from '../components/Forms/CreateUserModal.jsx';

const UsersPage = () => {
	const api = useApi();
	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [createModalOpen, setCreateModalOpen] = useState(false);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const { data } = await api.get(GetallusersUrl);
			const cleanedUsers = data.map(user => {
				const nameParts = [user.last_name, user.name, user.father_name].filter(Boolean);
				return {
					...user,
					fullName: nameParts.join(' ')
				};
			});
			setUsers(cleanedUsers);
		} catch (e) {
			setError('Ошибка при загрузке пользователей');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const columns = [
		{ key: 'fullName', label: 'Фамилия Имя Отчество' },
		{ key: 'date_of_birth', label: 'Дата рождения' },
		{ key: 'age', label: 'Возраст' },
		{ key: 'gender', label: 'Пол' },
		{ key: 'phone', label: 'Телефон' },
		{ key: 'email', label: 'Почта' },
		{ key: 'balance_training', label: 'Баланс тренировок' },
		{ key: 'status', label: 'Статус' },
		{ key: 'count_trainings', label: 'Всего тренировок' },
		{ key: 'actions', label: 'Действия' },
	];

	const rows = users.map(user => ({
		id: user.id,
		fullName: user.fullName,
		date_of_birth: user.date_of_birth
			? new Date(user.date_of_birth).toLocaleDateString('ru-RU')
			: '',
		age: user.age || '',
		gender: user.gender || '',
		phone: user.phone || '',
		email: user.email || '',
		balance_training: user.balance_training ?? '',
		status: user.status || '-',
		count_trainings: user.count_trainings ?? '',
		actions: (
			<div style={{ display: 'flex', gap: '8px' }}>
				<button title="Документы" onClick={() => alert(`Документы пользователя ${user.id}`)}>
					<FaFileAlt />
				</button>
				<button title="Написать" onClick={() => alert(`Написать пользователю ${user.email}`)}>
					<FaEnvelope />
				</button>
			</div>
		),
	}));

	return (
		<MainLayout>
			<div style={{ padding: 20 }} className="table-wrapper">
				<h1 className="h1">Пользователи</h1>

				<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, marginTop: 16, marginRight: 20 }}>
					<ButtonMy onClick={() => setCreateModalOpen(true)}>Добавить нового пользователя</ButtonMy>
				</div>

				<UniversalTable
					columns={columns}
					data={rows}
					loading={loading}
					emptyMessage="Пользователей не найдено"
					onRowClick={(user) => navigate(`/user/${user.id}`)}
				/>

				{error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

				<CreateUserModal
					isOpen={createModalOpen}
					onClose={() => setCreateModalOpen(false)}
					onCreated={fetchUsers}
				/>
			</div>
		</MainLayout>
	);
};

export default UsersPage;
