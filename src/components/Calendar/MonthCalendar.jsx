import React, { useMemo } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	addDays,
	isSameMonth,
	isSameDay,
	isValid,
	subMonths
} from 'date-fns';
import ru from 'date-fns/locale/ru';
import './MonthCalendar.css';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MonthCalendar = ({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate, hasSlots = [] }) => {
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(currentMonth);
	const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

	const slotDateStrings = useMemo(() => hasSlots, [hasSlots]);

	const calendar = useMemo(() => {
		const rows = [];
		let day = startDate;
		while (day <= monthEnd || rows.length < 6) {
			const row = [];
			for (let i = 0; i < 7; i++) {
				row.push(day);
				day = addDays(day, 1);
			}
			rows.push(row);
		}
		return rows;
	}, [startDate, monthEnd]);

	const isSlotDay = (date) => {
		const dateStr = format(date, 'yyyy-MM-dd');
		return slotDateStrings.includes(dateStr);
	};



	const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
	const handleNextMonth = () => setCurrentMonth(prev => addDays(prev, 30));

	return (
		<div className="month-calendar">
			<div className="month-calendar-header">
				<button onClick={handlePrevMonth}>‹</button>
				<span>{isValid(currentMonth) ? format(currentMonth, 'LLLL yyyy', { locale: ru }) : 'Неверная дата'}</span>
				<button onClick={handleNextMonth}>›</button>
			</div>

			<div className="month-calendar-grid">
				{daysOfWeek.map((day) => (
					<div key={day} className="month-day-label">{day}</div>
				))}
				{calendar.map((week, i) => (
					<React.Fragment key={i}>
						{week.map((date, j) => {
							const isToday = isSameDay(date, new Date());
							const isCurrentMonth = isSameMonth(date, currentMonth);
							const hasSlots = isSlotDay(date);
							const isSelected = isSameDay(date, selectedDate);

							return (
								<div
									key={j}
									onClick={() => setSelectedDate(date)}
									className={
										`month-calendar-cell 
										${isCurrentMonth ? '' : 'not-current-month'} 
										${hasSlots ? 'has-slots' : ''} 
										${isToday ? 'today' : ''} 
										${isSelected ? 'selected' : ''}`
									}
								>
									<div className="day-number">{format(date, 'd')}</div>
									{hasSlots && <div className="dot-green" />}
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default MonthCalendar;
