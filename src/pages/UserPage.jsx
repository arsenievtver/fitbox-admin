import { logoutUrl, PREFIX } from "../helpers/constants.js";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { useUser } from '../context/UserContext';
import './UserPage.css';
import ButtonMy from "../components/Buttons/ButtonMy.jsx";
import { createApi } from '../helpers/ApiClient';
import { JWT_STORAGE_KEY } from '../helpers/constants';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const Section = ({ title, children }) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <div className="section">
            <div className="section-header" onClick={() => setExpanded(!expanded)}>
                <h3>{title}</h3>
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expanded && <div className="section-content">{children}</div>}
        </div>
    );
};

const UserRow = ({ label, value }) => (
    <div className="row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
);

const UserPage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const api = createApi(navigate);


    const handleLogout = async () => {
        try {
            await api.post(PREFIX + logoutUrl);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            localStorage.removeItem(JWT_STORAGE_KEY);
            setUser(null);
            navigate('/');
        }
    };

    if (!user) return null;

    return (
        <MainLayout>
            <div className="user-avatar-block">
                <img src="/images/avatar.webp" alt="Аватар" className="avatar-img" />
                <div className="username">{user.name} {user.last_name}</div>
            </div>

            <div className="user_data">
                <Section title="Контактная информация">
                    <UserRow label="Телефон:" value={user.phone || '-'} />
                    <UserRow label="Email:" value={user.email || '-'} />
                </Section>

                <Section title="Личные данные">
                    <UserRow label="Имя:" value={user.name || '-'} />
                    <UserRow label="Фамилия:" value={user.last_name || '-'} />
                    <UserRow label="Пол:" value={user.gender || '-'} />
                    <UserRow label="Дата рождения:" value={formatDate(user.date_of_birth)} />
                </Section>

                <Section title="Статистика">
                    <UserRow label="Баланс тренировок:" value={user.balance_training ?? 0} />
                    <UserRow label="Статус:" value={user.status || '-'} />
                    <UserRow label="Прогресс в баллах:" value={user.score ?? 0} />
                    <UserRow label="Количество тренировок:" value={user.count_trainings ?? 0} />
                    <UserRow label="Дата создания:" value={formatDate(user.created_at)} />
                </Section>
            </div>

            <ButtonMy onClick={handleLogout} className="button_exit">Выйти</ButtonMy>
            <br/>
            <br/>
            <br/>
            <br/>
        </MainLayout>
    );
};

export default UserPage;

