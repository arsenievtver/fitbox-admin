import React from 'react';
import '../../styles/global.css';
import SideMenu from '../Menu/SideMenu';
import Header from '../Header/Header.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => {
    return (
        <div id="app-root">
            <Header />
            <SideMenu />
            <ToastContainer position="top-center" />
            <div className="app-content">{children}</div>
        </div>
    );
};

export default MainLayout;
