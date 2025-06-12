import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');

const fullMonthDays = (year, month) => {
    const firstDay = dayjs(`${year}-${month + 1}-01`);
    const daysInMonth = firstDay.daysInMonth();
    const startDayOfWeek = firstDay.day(); // 0 = воскресенье, в России неделя начинается с понедельника, поправим
    const days = [];

    // сдвинем так, чтобы неделя начиналась с понедельника
    const offset = (startDayOfWeek + 6) % 7;

    // Заполним пустые дни перед 1 числом месяца (для ровной сетки)
    for (let i = 0; i < offset; i++) {
        days.push(null);
    }

    // Добавим дни месяца
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(dayjs(`${year}-${month + 1}-${d}`));
    }

    return days;
};

const DateInputFullCalendar = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [calendarMonth, setCalendarMonth] = useState(selectedDate.month());
    const [calendarYear, setCalendarYear] = useState(selectedDate.year());
    const [showCalendar, setShowCalendar] = useState(false);
    const inputRef = useRef(null);

    const days = fullMonthDays(calendarYear, calendarMonth);

    const handleInputClick = () => setShowCalendar(true);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setCalendarMonth(date.month());
        setCalendarYear(date.year());
        setShowCalendar(false);
        if (onDateChange) onDateChange(date);
    };

    const handlePrevMonth = () => {
        const newDate = dayjs(`${calendarYear}-${calendarMonth + 1}-01`).subtract(1, 'month');
        setCalendarMonth(newDate.month());
        setCalendarYear(newDate.year());
    };

    const handleNextMonth = () => {
        const newDate = dayjs(`${calendarYear}-${calendarMonth + 1}-01`).add(1, 'month');
        setCalendarMonth(newDate.month());
        setCalendarYear(newDate.year());
    };

    // Закрытие календаря при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} ref={inputRef}>
            <input
                type="text"
                value={selectedDate.format('DD.MM.YYYY')}
                onClick={handleInputClick}
                readOnly
                style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--background-color)',
                    fontSize: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                    width: '140px',
                    textAlign: 'center',
                    userSelect: 'none',

                    outline: 'none',         // убирает стандартный синий обвод
                    boxShadow: 'none'        // убирает тень при фокусе
                }}
                onFocus={e => {
                    e.target.style.outline = 'none';
                    e.target.style.boxShadow = 'none';
                }}
                onBlur={e => {
                    e.target.style.outline = 'none';
                    e.target.style.boxShadow = 'none';
                }}
            />

            {showCalendar && (
                <div
                    style={{
                        left: 0,
                        color: 'var(--text-color)',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: '10px',
                        margin: '10px 0',
                        zIndex: 1000,
                        width: '280px',
                        userSelect: 'none'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                        <button
                            onClick={handlePrevMonth}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'var(--primary-color)',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                padding: '5px 10px',
                                userSelect: 'none'
                            }}
                            aria-label="Предыдущий месяц"
                        >
                            ‹
                        </button>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '16px', userSelect: 'none' }}>
                            {dayjs().year(calendarYear).month(calendarMonth).format('MMMM YYYY')}
                        </div>
                        <button
                            onClick={handleNextMonth}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'var(--primary-color)',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                padding: '5px 10px',
                                userSelect: 'none'
                            }}
                            aria-label="Следующий месяц"
                        >
                            ›
                        </button>
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px', color: '#555' }}>
                        {weekDays.map(day => (
                            <div key={day} style={{ fontWeight: 'bold' }}>{day}</div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                        {days.map((date, i) => {
                            if (!date) return <div key={i} />;
                            const isToday = date.isSame(dayjs(), 'day');
                            const isSelected = date.isSame(selectedDate, 'day');
                            return (
                                <div
                                    key={date.format('YYYY-MM-DD')}
                                    onClick={() => handleDateSelect(date)}
                                    style={{
                                        padding: '8px 0',
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        backgroundColor: isSelected ? 'var(--primary-color)' : 'transparent',
                                        color: isSelected ? 'var(--secondary-color)' : isToday ? 'var(--primary-color)' : 'var(--text-color)',
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        userSelect: 'none',
                                        transition: 'background-color 0.3s'
                                    }}
                                    title={date.format('dddd, DD MMMM YYYY')}
                                >
                                    {date.date()}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateInputFullCalendar;

