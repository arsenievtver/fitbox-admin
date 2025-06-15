import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import ButtonMy from '../components/Buttons/ButtonMy.jsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GetoneuserUrl } from '../helpers/constants';
import './UserPage.css';
import { createApi } from '../helpers/ApiClient';
import InputBase from '../components/Forms/InputBase';
import PhoneInput from '../components/Forms/PhoneInput';
import DateInput from '../components/Forms/DateInput.jsx';
import DropdownInput from '../components/Forms/DropdownInput.jsx';
import { PatchoneusersUrl } from '../helpers/constants';


const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const Section = ({ title, children }) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <div className="section">
            <div className="section-header" onClick={() => setExpanded(!expanded)}>
                <h3>{title}</h3>
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expanded && <div className="section-content">{children}</div>}
        </div>
    );
};

const EditableRow = ({ label, value, name, isEditing, onChange }) => (
    <div className="row">
        <span className="label">{label}</span>
        {isEditing ? (
            <InputBase
                name={name}
                value={value ?? ''}
                onChange={onChange}
                placeholder={`Введите ${label.toLowerCase()}`}
            />
        ) : (
            <span className="value">{value ?? '-'}</span>
        )}
    </div>
);

const UserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = createApi(navigate);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get(GetoneuserUrl(id));
                setUser(data);
                setFormData(data);
            } catch (e) {
                console.error('Ошибка при получении пользователя:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const { data } = await api.patch(PatchoneusersUrl(id), formData);
            setUser(data);
            setFormData(data);
            setIsEditing(false);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 2000);
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
        }
    };



    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    if (loading) return <MainLayout><p>Загрузка данных...</p></MainLayout>;
    if (!user) return <MainLayout><p>Пользователь не найден</p></MainLayout>;

    return (
        <MainLayout>
            {showSuccessMessage && (
                <div className="success-toast">
                    Данные успешно сохранены
                </div>
            )}

            <div className="user-avatar-block">
                <img src="/images/avatar.webp" alt="Аватар" className="avatar-img" />
                <div className="username">{user.name} {user.last_name}</div>
                {!isEditing ? (
                    <ButtonMy onClick={() => setIsEditing(true)} className="button_exit">Редактировать</ButtonMy>
                ) : (
                    <div className="button-edit-group">
                        <ButtonMy onClick={handleSave}>Сохранить</ButtonMy>
                        <ButtonMy onClick={handleCancel}>Отменить</ButtonMy>
                    </div>
                )}
            </div>

            <div className="user_data_card">
                <div className="user_data">
                    <Section title="Контактная информация">
                        {isEditing ? (
                            <div className="row">
                                <span className="label">Телефон:</span>
                                <PhoneInput
                                    value={formData.phone ?? ''}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                        ) : (
                            <EditableRow label="Телефон:" value={formData.phone} isEditing={false} />
                        )}
                        <EditableRow label="Email:" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
                        <UserRow label="Дата создания:" value={formatDate(user.created_at)} />
                        <UserRow label="Обновлены данные:" value={formatDate(user.updated_at)} />
                    </Section>

                    <Section title="Личные данные">
                        <EditableRow label="Имя:" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow label="Фамилия:" name="last_name" value={formData.last_name} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow label="Отчество:" name="father_name" value={formData.father_name} isEditing={isEditing} onChange={handleChange} />
                        {isEditing ? (
                            <UserRow
                                label="Пол:"
                                value={
                                    <DropdownInput
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        options={['муж', 'жен']}
                                        placeholder="Выберите пол"
                                    />
                                }
                            />
                        ) : (
                            <UserRow label="Пол:" value={user.gender || '-'} />
                        )}

                        <div className="row">
                            <span className="label">Дата рождения:</span>
                            {isEditing ? (
                                <DateInput
                                    value={formData.date_of_birth}
                                    onChange={(value) => setFormData((prev) => ({
                                        ...prev,
                                        date_of_birth: value
                                    }))}
                                />
                            ) : (
                                <span className="value">{formatDate(formData.date_of_birth)}</span>
                            )}
                        </div>
                        <UserRow label="Возраст:" value={formData.age ?? '-'} />
                    </Section>

                    <Section title="Статистика">
                        <UserRow label="Баланс тренировок:" value={user.balance_training ?? 0} />
                        <UserRow label="Статус:" value={user.status ?? '-'} />
                        <UserRow label="Прогресс в баллах:" value={user.score ?? 0} />
                        <UserRow label="Количество тренировок:" value={user.count_trainings ?? 0} />
                    </Section>
                </div>
            </div>
        </MainLayout>
    );
};


const UserRow = ({ label, value }) => (
    <div className="row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
);

export default UserPage;
