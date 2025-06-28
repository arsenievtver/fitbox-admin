import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback
} from 'react';
import { createApi } from '../helpers/ApiClient';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext(null);

const STATUS_MAP = {
	'1': { name: 'Гость', maxPoints: 100 },
	'2': { name: 'Ученик', maxPoints: 500 },
	'3': { name: 'Ударник', maxPoints: 2000 },
	'4': { name: 'Боец', maxPoints: 5000 },
	'5': { name: 'Железный', maxPoints: 9000 },
	'6': { name: 'Мастер', maxPoints: 15000 }
};

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	const api = useMemo(() => createApi(navigate), [navigate]);

	const refreshUser = useCallback(async () => {
		try {
			const { data } = await api.get('/api/v1/users/me');

			const statusInfo = STATUS_MAP[data.status?.toString()] || {
				name: 'Неизвестный',
				maxPoints: 0
			};

			const enrichedUser = {
				...data,
				statusName: statusInfo.name,
				maxPoints: statusInfo.maxPoints
			};

			setUser(enrichedUser);
		} catch (e) {
			console.warn('Не удалось загрузить пользователя', e);
			setUser(null);
		}
	}, [api]);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	return (
		<UserContext.Provider value={{ user, setUser, refreshUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
