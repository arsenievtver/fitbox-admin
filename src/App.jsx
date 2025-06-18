import React from 'react';
import { Routes, Route } from 'react-router-dom';

import UserPage from './pages/UserPage';
import StartPage from './pages/StartPage.jsx';
import SchedulePage from "./pages/SchedulePage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import AddWeightPage from "./pages/AddWeight.jsx";

const AppContent = () => {

    return (
        <>
            <Routes>
                <Route path="/user" element={<UserPage />} />
                <Route path="/" element={<StartPage />} />
                <Route path="/start" element={<StartPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/add_weight" element={<AddWeightPage />} />
            </Routes>
        </>
    );
};

// ⛔️ Удаляем второй Router
const AppRouter = () => <AppContent />;

export default AppRouter;
