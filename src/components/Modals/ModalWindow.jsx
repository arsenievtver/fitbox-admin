import * as React from 'react';
import dayjs from 'dayjs';
import CloseButton from '../IconButtons/CloseButton.jsx';
import './modal_calendar.css';
import { fetchAvailableSlots } from '/api/airtableClient.js';

const ModalWindow = ({ activeDay, closeModal }) => {
    const [slots, setSlots] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState(null); // добавлено

    React.useEffect(() => {
        if (!activeDay || !dayjs.isDayjs(activeDay)) return;

        setLoading(true);
        setSelectedSlot(null); // сброс при новой дате

        const filterDate = activeDay.format('YYYY-MM-DD');

        fetchAvailableSlots(filterDate)
            .then(setSlots)
            .catch(err => {
                console.error(err);
                setSlots([]);
            })
            .finally(() => setLoading(false));
    }, [activeDay]);

    const toggleSlot = (slot) => {
        setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
    };

    const handleBooking = (slot) => {
        console.log("Записан на слот:", slot);
        alert(`Вы записаны на ${slot.time}`);
        setSelectedSlot(null);
    };

    return (
        <div className="modal-window-bottom">
            <CloseButton onClick={closeModal} />
            {activeDay && dayjs.isDayjs(activeDay) ? (
                <p className="modal-date-label">
                    Запись на {activeDay.format('DD.MM.YY')} - {activeDay.format('dddd')}
                </p>
            ) : (
                <p className="modal-date-label">Нет выбранной даты.</p>
            )}

            <div className="modal-slots">
                {loading ? (
                    <p>Загрузка доступных слотов...</p>
                ) : slots.length > 0 ? (
                    <ul>
                        {slots.map((slot) => (
                            <li key={slot.id} className="slot-item" onClick={() => toggleSlot(slot)}>
                                <div className="slot-main">
                                    <span className="slot-time">{slot.time}</span>
                                    <span className="slot-free">{slot.freeSlots}</span>
                                </div>
                                {selectedSlot?.id === slot.id && (
                                    <div className="slot-expanded">
                                        <span>{activeDay.format('DD.MM.YY')} {activeDay.format('dddd')}</span>
                                        <button onClick={(e) => { e.stopPropagation(); handleBooking(slot); }}>
                                            Записаться
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет доступных слотов на этот день.</p>
                )}
            </div>
        </div>
    );
};

export default ModalWindow;
