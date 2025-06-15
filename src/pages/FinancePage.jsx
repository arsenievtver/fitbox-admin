// src/pages/FinancePage.jsx

import MainLayout from '../components/layouts/MainLayout';
import './SchedulePage.css';
import DateInput from "../components/Forms/DateInput.jsx";

const FinancePage = () => {
	return (
		<MainLayout>
			<div className="container">
				<br/><br/><br/><br/><br/><br/><br/>
				<h1>Финансовая информация</h1>
				<DateInput />
			</div>
		</MainLayout>
	);
};

export default FinancePage;