import "./Header.css";
import { useUser } from '../../context/UserContext';
import ButtonMy from "../Buttons/ButtonMy.jsx";
import React from "react";
import { JWT_STORAGE_KEY, logoutUrl, PREFIX } from "../../helpers/constants.js";
import useApi from "../../hooks/useApi.hook"; // ← хук для API
import { useNavigate } from 'react-router-dom'; // ← для редиректа

const Header = () => {
    const { user, setUser } = useUser(); // ← добавил setUser
    const api = useApi(); // ← получаем api
    const navigate = useNavigate(); // ← используем роутер

    const handleLogout = async () => {
        try {
            await api.post(PREFIX + logoutUrl);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            localStorage.removeItem(JWT_STORAGE_KEY);
            localStorage.removeItem('refresh_token');
            setUser(null);
            navigate('/');
        }
    };

    return (
        <header className="header">
            <div className="logo-container">
            </div>
            <nav className="admin">
                <a>Пользователь: {user?.name ?? '-'}</a>
                <ButtonMy onClick={handleLogout} >Выйти</ButtonMy>
            </nav>
        </header>
    );
};

export default Header;

