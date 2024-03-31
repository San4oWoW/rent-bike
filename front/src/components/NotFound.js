// NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <h2>Страница не найдена</h2>
            <Link to="/">Вернуться на главную страницу</Link>
        </div>
    );
};

export default NotFound;
