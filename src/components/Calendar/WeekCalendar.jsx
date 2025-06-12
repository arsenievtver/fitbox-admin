// WeekCalendar.jsx
import * as React from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import ru from 'dayjs/locale/ru';
import { useSwipeable } from 'react-swipeable';
import { AnimatePresence, motion } from 'framer-motion';
import './calendar.css';
import '../Modals/modal_calendar.css';
import ModalWindow from '../Modals/ModalWindow.jsx';

dayjs.extend(localizedFormat);
dayjs.locale(ru);

// Функция генерации диапазона дней
const calculateDayRange = (startDate, numDays) => {
    let daysArray = [];
    let tempDate = startDate.clone();

    for (let i = 0; i < numDays; i++) {
        daysArray.push({
            date: tempDate.date(),
            weekday: tempDate.format('dd'),
            month: tempDate.month(),
            year: tempDate.year(),
            isToday: tempDate.isSame(dayjs(), 'day')
        });
        tempDate = tempDate.add(1, 'day');
    }

    return daysArray;
};

// Компонент отображения одной недели
const CalendarComponent = ({ days, handleDayClick, activeDay }) => (
    <div className="calendar-week">
        {days.map(({ date, weekday, isToday }, idx) => (
            <div
                key={`day-${idx}`}
                className={`calendar-day ${isToday ? 'today' : ''} ${
                    activeDay && activeDay.isSame(dayjs(`${days[idx].year}-${days[idx].month + 1}-${date}`)) ? 'active' : ''
                }`}
                onClick={() => handleDayClick(dayjs(`${days[idx].year}-${days[idx].month + 1}-${date}`))}
            >
                <div className="weekday-line">{weekday}</div>
                <div className="date-circle">{date}</div>
            </div>
        ))}
    </div>
);

const swipeVariants = {
    enter: (direction) => ({
        x: direction === 'left' ? 300 : -300,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        x: direction === 'left' ? -300 : 300,
        opacity: 0
    })
};

const WeekCalendar = () => {
    const [currentDate, setCurrentDate] = React.useState(dayjs());
    const [activeDay, setActiveDay] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [direction, setDirection] = React.useState('left'); // для анимации

    const handleDayClick = (selectedFullDate) => {
        setActiveDay(selectedFullDate);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentDate.diff(dayjs(), 'week') >= 3) return;
            setDirection('left');
            setCurrentDate(prev => prev.add(1, 'week'));
        },
        onSwipedRight: () => {
            if (currentDate.isBefore(dayjs(), 'day')) return;
            setDirection('right');
            setCurrentDate(prev => prev.subtract(1, 'week'));
        },
        trackMouse: true // позволяет тестировать свайпы мышкой
    });

    const daysToShow = calculateDayRange(currentDate, 7);
    const firstDay = daysToShow[0];
    const lastDay = daysToShow[daysToShow.length - 1];

    const firstMonth = dayjs(`${firstDay.year}-${firstDay.month + 1}-01`).format('MMMM');
    const lastMonth = dayjs(`${lastDay.year}-${lastDay.month + 1}-01`).format('MMMM');

    const monthLabel = firstMonth === lastMonth ? firstMonth : `${firstMonth} / ${lastMonth}`;


    return (
        <>
            <div className="slide-container" {...swipeHandlers}>
                <AnimatePresence custom={direction}>
                    <motion.div
                        key={currentDate.format('YYYY-MM-DD')}
                        className="calendar-wrapper"
                        variants={swipeVariants}
                        custom={direction}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <div className="month-label">{monthLabel}</div>
                        <CalendarComponent
                            days={daysToShow}
                            handleDayClick={handleDayClick}
                            activeDay={activeDay}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {showModal && <ModalWindow activeDay={activeDay} closeModal={closeModal} />}
        </>
    );
};

export default WeekCalendar;
