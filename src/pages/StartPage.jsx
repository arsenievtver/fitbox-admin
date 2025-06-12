import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';
import InputBase from '../components/Forms/InputBase';
import ButtonMy from '../components/Buttons/ButtonMy';
import Modal from '../components/Modals/ModalBase';

import useApi from '../hooks/useApi.hook';
import { loginUrl, JWT_STORAGE_KEY } from '../helpers/constants';
import { useUser } from '../context/UserContext';

const StartPage = () => {
    const navigate = useNavigate();
    const api = useApi();

    const [mode, setMode] = useState(null);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { user, refreshUser } = useUser();

    useEffect(() => {
        if (user) {
            navigate('/schedule');
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            const params = new URLSearchParams();
            params.append('username', phone);
            params.append('password', password);

            const { data } = await api.post(loginUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            localStorage.setItem(JWT_STORAGE_KEY, data.access_token);
            await refreshUser();
            closeModal();
            navigate('/schedule');
        } catch (e) {
            setError(e.response?.data?.detail || 'Ошибка входа');
        }
    };

    const closeModal = () => {
        setMode(null);
        setError(null);
        setPhone('');
        setPassword('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="start-container">
            <div className="background-wrapper">
                <div className="background1"></div>
                <div className="background2"></div>
            </div>
            <div className="start-overlay"></div>
            <div className="start-content">
                <div className="start-top">
                    <h2 style={{ color: 'var(--primary-color)' }}>Fitboxing club</h2>
                    <p>Начни прямо сейчас!</p>
                </div>

                <div className="start-bottom">
                    <ButtonMy onClick={() => setMode('login')}>Войти</ButtonMy>
                </div>
            </div>

            {mode && (
                <Modal onClose={closeModal} expanded>
                    <div className="form-container">
                        {error && <div className="error">{error}</div>}
                        <InputBase
                            placeholder="Введите логин"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <InputBase
                            placeholder="Введите пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <ButtonMy
                            onClick={handleLogin}
                            disabled={!phone || !password}
                        >
                            Войти
                        </ButtonMy>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default StartPage;
