import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import SimpleWeightChart from "../components/Charts/SimpleWeightChart";
import './AddWeight.css';
import DropdownInput from '../components/Forms/DropdownInput';
import { GetallusersUrl, GetoneuserUrl, postWeightUrl } from '../helpers/constants';
import useApi from '../hooks/useApi.hook';
import ButtonMy from "../components/Buttons/ButtonMy.jsx";
import InputBase from "../components/Forms/InputBase.jsx";
import { format } from 'date-fns';

const AddWeightPage = () => {
	const api = useApi();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [weightData, setWeightData] = useState([]);
	const [weight, setWeight] = useState('');

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

	const fetchUserWeights = async () => {
		if (!selectedUser) return;
		try {
			const { data } = await api.get(GetoneuserUrl(selectedUser.value));
			const last10 = (data.records || [])
				.slice(-10)
				.map(({ date, weight }) => ({ date, weight }));
			setWeightData(last10);
		} catch (error) {
			console.error('Ошибка загрузки записей веса:', error);
			setWeightData([]);
		}
	};

	useEffect(() => {
		fetchUserWeights();
	}, [selectedUser, api]);

	const handleSubmit = async () => {
		if (!selectedUser || !weight) {
			alert("Выберите пользователя и введите вес");
			return;
		}

		const sanitizedWeight = parseFloat(weight.replace(',', '.'));
		if (isNaN(sanitizedWeight)) {
			alert("Некорректный вес");
			return;
		}

		const payload = {
			user_id: selectedUser.value,
			date: format(new Date(), 'yyyy-MM-dd'),
			weight: sanitizedWeight
		};

		try {
			await api.post(postWeightUrl, payload);
			setWeight(''); // очистим поле
			await fetchUserWeights(); // обновим график
		} catch (err) {
			console.error('Ошибка при добавлении веса:', err);
			alert("Ошибка при отправке данных");
		}
	};

	return (
		<MainLayout>
			<div className="form-section">
				<SimpleWeightChart data={weightData} />
				<DropdownInput
					options={users.map(user => ({
						value: user.id,
						label: `${user.last_name || ''} ${user.name || ''}`.trim()
					}))}
					value={selectedUser}
					onChange={setSelectedUser}
					placeholder="Выберите пользователя"
					isClearable={true}
				/>
				<InputBase
					placeholder="Введите вес"
					value={weight}
					onChange={(e) => setWeight(e.target.value.replace(/[^0-9.,]/g, ''))}
				/>
				<ButtonMy onClick={handleSubmit}>Записать</ButtonMy>
			</div>
		</MainLayout>
	);
};

export default AddWeightPage;
