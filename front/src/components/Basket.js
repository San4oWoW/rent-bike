import React, { useEffect, useState } from 'react';
import useFetchWithAuth from './useFetchWithAuth';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';

const Basket = () => {
    const navigate = useNavigate();
    const [bicycles, setBicycles] = useState([]);
    const { data, loading, error } = useFetchWithAuth('Basket');
    const [cartCount, setCartCount] = useLocalStorage('cartCount', 0);

    useEffect(() => {
        if (error) {
            console.error(error.message);
            navigate('/login');
        } else {
            setBicycles(data || []);
        }
    }, [data, error, navigate]);

    const handleRentBikes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Пользователь не авторизован.");
            return;
        }
    
        try {
            const response = await fetch('api/RentBikeControllers/RentBike', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                alert("Успешно арендованы");
                setBicycles([]);
                setCartCount(0);

            } else {
                const errorMessage = await response.text();
                alert(`Произошла ошибка при аренде: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса на аренду:", error);
            alert("Произошла ошибка при попытке аренды.");
        }
    };

    const handleRemoveFromCart = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Пользователь не авторизован.");
            return;
        }
    
        const url = `api/Basket?id=${id}`;
    
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                setBicycles(bicycles.filter(bike => bike.id !== id));
                setCartCount(cartCount - 1);
                window.location.reload();
            } else {
                const errorMessage = await response.text();
                alert(`Произошла ошибка: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
            alert("Произошла ошибка при выполнении запроса.");
        }
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Корзина</h2>
            {bicycles.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <ul>
                    {bicycles.map(item => (
                        <li key={item.id}>
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} width="100" height="100" />
                            <div>Название: {item.name}</div>
                            <div>Цена: {item.price}</div>
                            <div>Описание: {item.description}</div>
                            <button onClick={() => handleRemoveFromCart(item.id)}>Удалить из корзины</button>
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                {bicycles.length !== 0 && (
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={handleRentBikes}>
                        Арендовать
                    </button>
                )}
            </div>
        </div>
    );
};

export default Basket;
