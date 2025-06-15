// src/components/Forms/DateInput.jsx

import { useState } from 'react';
import './DateInputFullCalendar.css';

const DateInput = ({ value, onChange }) => {
    const [selectedDate, setSelectedDate] = useState(value || null); // Правильно объявили state

    const handleChange = (event) => {
        const value = event.target.value;
        if (value) {
            const selectedIsoDate = new Date(value).toISOString().split('T')[0]; // Извлекаем дату в ISO формате
            setSelectedDate(selectedIsoDate); // Устанавливаем локальное состояние
            onChange(selectedIsoDate); // Отправляем новую дату наружу
        }
    };

    return (
        <>
            <label htmlFor="date-picker">
                <input
                    id="date-picker"
                    type="date"
                    value={selectedDate || ''} // Прописываем current value
                    onChange={handleChange}
                    className="date-input"
                />
            </label>
        </>
    );
};

export default DateInput;