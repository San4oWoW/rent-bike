import React, { useState } from 'react';
import '../App.css';

const AddBikeForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token'); // Предположим, что токен хранится в localStorage
            const response = await fetch('http://localhost:5103/api/RentBikeControllers', { // Правильный URL
            method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData, // Отправляем данные формы
            });

            if (response.ok) {
                alert('Велосипед успешно добавлен');
                // Очистка формы или переадресация
            } else {
                alert('Ошибка при добавлении велосипеда');
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Ошибка при отправке формы');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="addBikeForm">
            <div>
                <label htmlFor="name">Название:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="price">Цена:</label>
                <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Описание:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="image">Изображение:</label>
                <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />
            </div>
            <button type="submit">Добавить велосипед</button>
        </form>
    );
};

export default AddBikeForm;
