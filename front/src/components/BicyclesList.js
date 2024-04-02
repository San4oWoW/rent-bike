import React, { useState, useEffect } from 'react';
import useFetchWithAuth from './useFetchWithAuth';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import useLocalStorage from './useLocalStorage';

function BicyclesList() {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 9;
    const navigate = useNavigate();
    const { data: bicycles, loading, error } = useFetchWithAuth('RentBikeControllers');
    const [isAdmin, setIsAdmin] = useState(false);
    const [sortOrder, setSortOrder] = useState('ascending'); // Для сортировки
    const [searchQuery, setSearchQuery] = useState(''); // Для поиска
    const [cartCount, setCartCount] = useLocalStorage('cartCount', 0);

    async function checkIfAdmin() {
        const token = localStorage.getItem('token');
        const response = await fetch('api/RentBikeControllers/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    
        return response.ok; 
    } 

    useEffect(() => {
        checkIfAdmin().then(isAdmin => {
            setIsAdmin(isAdmin);
        });

        if (error) {
            console.error(error.message);
            navigate('/login');
        }
    }, [error, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const filteredAndSortedBicycles = bicycles?.filter(bicycle => 
        bicycle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bicycle.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortOrder === 'ascending') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredAndSortedBicycles?.slice(indexOfFirstCard, indexOfLastCard) || [];

    const goToPrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredAndSortedBicycles?.length / cardsPerPage)));
    };

    const handleAddToCart = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Пользователь не авторизован.");
            return;
        }
        const url = `api/Basket?id=${id}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                }
            });
            if (response.ok) {
                setCartCount(cartCount + 1);
                alert("Велосипед успешно добавлен в корзину!");
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
    
    const handleRemove = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Пользователь не авторизован.");
            return;
        }
    
        const url = `api/RentBikeControllers?id=${id}`;
    
        
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                alert(`Товар успешно удален`);
                window.location.reload()
            } else {
                const errorMessage = await response.text();
                alert(`Произошла ошибка: ${errorMessage}`);
            }
        
    };
   
   return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="ascending">По возрастанию цены</option>
                    <option value="descending">По убыванию цены</option>
                </select>
            </div>
            <ul>
                {currentCards.map(bicycle => (
                    <li key={bicycle.id}>
                        <img src={`data:image/jpeg;base64,${bicycle.image}`} alt="Bicycle" width="300" height="200"/>
                        <div>Название: {bicycle.name}</div>
                        <div>Цена: {bicycle.price}</div>
                        <div>Описание: {bicycle.description}</div>
                        <div style={{ display: 'flex' }}>
                            <button onClick={() => handleAddToCart(bicycle.id)}>Добавить в корзину</button>
                            {isAdmin && <button onClick={() => handleRemove(bicycle.id)}>Удалить товар</button>}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={goToPrevPage} disabled={currentPage === 1}>Предыдущая</button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage} disabled={indexOfLastCard >= filteredAndSortedBicycles?.length}>Следующая</button>
            </div>
        </div>
    );
}

export default BicyclesList;