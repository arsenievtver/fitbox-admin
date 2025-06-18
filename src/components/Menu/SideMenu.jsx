import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ не забудь импорт
import './SideMenu.css';

const menuItems = [
	{ id: 'schedule', label: 'Расписание', path: '/schedule' },
	{ id: 'stats', label: 'Статистика', path: '/statistics' },
	{ id: 'clients', label: 'Клиенты', path: '/users' },
	{ id: 'payments', label: 'Оплаты', path: '/finance' },
	{ id: 'weight', label: 'Контроль веса', path: '/add_weight' },
];

const SideMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				aria-label="Открыть меню"
				onClick={() => setIsOpen(true)}
				className="burger-button"
			>
				☰
			</button>

			{isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

			<nav className={`side-menu ${isOpen ? 'open' : ''}`}>
				<button
					onClick={() => setIsOpen(false)}
					aria-label="Закрыть меню"
					className="close-button"
				>
					×
				</button>
				{menuItems.map(item => (
					<Link
						key={item.id}
						to={item.path}
						className="menu-item"
						onClick={() => setIsOpen(false)} // ← чтобы закрывалось после перехода
					>
						{item.label}
					</Link>
				))}
			</nav>
		</>
	);
};

export default SideMenu;
