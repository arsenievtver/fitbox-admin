import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

import HomeIcon from '../../assets/icons/HomeIcon.jsx';
import MedalIcon from '../../assets/icons/MedalIcon.jsx';
import TelegramIcon from '../../assets/icons/TelegramIcon.jsx';
import UserIcon from '../../assets/icons/UserIcon.jsx';
import WalletIcon from '../../assets/icons/WalletIcon.jsx';

import ModalBase from '../Modals/ModalBase.jsx';
import ButtonMy from '../Buttons/ButtonMy.jsx';

const Footer = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleClick = (tab) => {
        setActiveTab(tab);

        switch (tab) {
            case 'home':
                navigate('/home');
                break;
            case 'finance':
                navigate('/finance');
                break;
            case 'lightning':
                navigate('/energy');
                break;
            case 'message':
                setShowModal(true); // Вместо перехода — открываем модалку
                break;
            case 'user':
                navigate('/user');
                break;
            default:
                break;
        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleGoToTelegram = () => {
        window.open('https://t.me/s/ias_control', '_blank');
        setShowModal(false);
    };

    return (
        <>
            <div className="navbar-container">
                <div className={`nav-item nav-home ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleClick('home')}>
                    <HomeIcon className="nav-icon" />
                </div>
                <div className={`nav-item nav-finance ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => handleClick('finance')}>
                    <WalletIcon className="nav-icon" />
                </div>
                <div className={`nav-item nav-lightning ${activeTab === 'lightning' ? 'active' : ''}`} onClick={() => handleClick('lightning')}>
                    <MedalIcon className="nav-icon" />
                </div>
                <div className={`nav-item nav-message ${activeTab === 'message' ? 'active' : ''}`} onClick={() => handleClick('message')}>
                    <TelegramIcon className="nav-icon" />
                </div>
                <div className={`nav-item nav-user ${activeTab === 'user' ? 'active' : ''}`} onClick={() => handleClick('user')}>
                    <UserIcon className="nav-icon" />
                </div>
            </div>

            {showModal && (
                <ModalBase onClose={handleCloseModal}>
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <p style={{ marginBottom: '20px' }}>Перейти в Telegram?</p>
                        <ButtonMy onClick={handleGoToTelegram}>Перейти</ButtonMy>
                    </div>
                </ModalBase>
            )}
        </>
    );
};

export default Footer;
