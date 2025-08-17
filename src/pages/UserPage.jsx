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
import UserBookingTable from '../components/Table/UserBookingTable';


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
    const [expanded, setExpanded] = useState(false);
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
                type={name === 'email' ? 'email' : 'text'}
                value={value ?? ''}
                onChange={onChange}
                placeholder={`Введите ${label.toLowerCase()}`}
            />
        ) : (
            <span className="value">{value ?? '-'}</span>
        )}
    </div>
);

const UserRow = ({ label, value }) => (
    <div className="row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
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

    const genderOptions = [
        { label: 'Муж', value: 'муж' },
        { label: 'Жен', value: 'жен' },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get(GetoneuserUrl(id));
                setUser(data);
                setFormData({
                    ...data,
                    gender: genderOptions.find(opt => opt.value === data.gender) || null,
                });
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
            const payload = {
                // отправляем только нужные поля
                phone: formData.phone,
                email: formData.email,
                name: formData.name ?? '',
                last_name: formData.last_name ?? '',
                father_name: formData.father_name ?? '',
                date_of_birth: formData.date_of_birth ?? '',
                gender: formData.gender?.value || '',
            };

            console.log('👉 payload:', payload); // Проверяем

            const { data } = await api.patch(PatchoneusersUrl(id), payload);

            setUser(data);
            setFormData({
                ...data,
                gender: genderOptions.find(opt => opt.value === data.gender) || null,
            });

            setIsEditing(false);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 2000);
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
            alert('Не удалось сохранить пользователя. Проверьте введённые данные.');
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
                <div className="success-toast">Данные успешно сохранены</div>
            )}

            <div className="user-avatar-block">
                <img
                    src={
                        user.photo_url
                            ? user.photo_url
                            : user.gender === "жен"
                                ? "/images/avatar-f-y.webp"
                                : "/images/avatar.webp"
                    }
                    alt="Аватар"
                    className="avatar-img"
                />
                <div className="username">{user.name} {user.last_name}</div>
                {!isEditing ? (
                    <ButtonMy onClick={() => setIsEditing(true)}>Редактировать</ButtonMy>
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
                                    onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
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
                                        onChange={(selected) => setFormData((prev) => ({ ...prev, gender: selected }))}
                                        options={genderOptions}
                                        placeholder="Выберите пол"
                                        isClearable={true}
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
                        <UserRow label="Баланс тренировок:" value={user.score ?? 0} />
                        <UserRow label="Уровень:" value={user.status ?? '-'} />
                        <UserRow label="Прогресс в баллах:" value={Math.round(user.energy) ?? 0} />
                        <UserRow label="Проведено тренировок:" value={user.count_trainings ?? 0} />
                    </Section>
                </div>
                <UserBookingTable userId={user.id} />
            </div>
        </MainLayout>
    );
};

export default UserPage;
