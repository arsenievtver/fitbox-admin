import React, { createContext, useState, useEffect, useContext } from 'react';
import { createApi } from '../helpers/ApiClient';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	const api = React.useMemo(() => createApi(navigate), [navigate]);

	const fetchUser = async () => {
		try {
			const { data } = await api.get('/api/v1/users/me');
			setUser(data);
		} catch (e) {
			console.warn('Не удалось загрузить пользователя', e);
			setUser(null);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};

