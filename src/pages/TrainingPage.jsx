// src/pages/TrainingPage.jsx

import MainLayout from '../components/layouts/MainLayout';
import DeviceAssignmentTable from '../components/Table/DeviceAssignmentTable.jsx';

const FinancePage = () => {
	return (
		<MainLayout>
			<div className="container">
				<h1>Тренировка</h1>
				<DeviceAssignmentTable />
			</div>
		</MainLayout>
	);
};

export default FinancePage;