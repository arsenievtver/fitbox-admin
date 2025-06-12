import React from 'react';
import '../../styles/global.css';
import SideMenu from '../Menu/SideMenu';
import Header from '../Header/Header.jsx';

const MainLayout = ({ children }) => {
    return (
        <div id="app-root">
            <Header />
            <SideMenu />
            <div className="app-content">{children}</div>
        </div>
    );
};

export default MainLayout;
