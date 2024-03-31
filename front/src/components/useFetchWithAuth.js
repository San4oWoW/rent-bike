import { useState, useEffect } from 'react';

// Добавляем параметры method и body в аргументы функции
// По умолчанию, method = 'GET', а body = null, чтобы сохранить совместимость с предыдущим использованием
const useFetchWithAuth = (url, method = 'GET', body = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWithAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Токен не найден. Пользователь не авторизован.");
                }

                // Подготовка заголовков
                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', `Bearer ${token}`);

                // Конфигурация запроса
                const config = {
                    method: method,
                    headers: headers,
                    body: method !== 'GET' ? JSON.stringify(body) : null, // Добавляем тело запроса для методов, отличных от GET
                };

                const response = await fetch('http://localhost:5103/api/' + url, config);

                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.statusText}`);
                }

                // Обработка случая, когда тело ответа не требуется
                if (response.status === 204) { // 204 No Content
                    setData(null);
                } else {
                    const data = await response.json();
                    setData(data);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWithAuth();
    // Добавляем method и body в список зависимостей useEffect,
    // чтобы хук корректно реагировал на их изменения
    }, [url, method, JSON.stringify(body)]);

    return { data, loading, error };
};

export default useFetchWithAuth;
