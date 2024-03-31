import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';

const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useLocalStorage('cartCount', 0);
  const [city, setCity] = useState('');

  function logout() {
    localStorage.removeItem('token');
    navigate("/");
  }

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  
  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  

  async function checkIfAdmin() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5103/api/RentBikeControllers/check', {
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

    const savedCity = getCookie('city');
    if (savedCity) {
      setCity(savedCity);
    }
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setCookie('city', e.target.value, 7); // Сохраняем выбор города на 7 дней
  };

  return (
    <header className="header">
      <h1>Сервис аренды велосипедов</h1>
      
      <div className="header-buttons">
      <div>
        Ваш город:
        <select value={city} onChange={handleCityChange}>
          <option value="">Выберите город</option>
          <option value="Москва">Москва</option>
          <option value="Санкт-Петербург">Санкт-Петербург</option>
          <option value="Пермь">Пермь</option>
        </select>
      </div>
        <button onClick={() => navigate("/")}>Домой</button>
        {isAdmin && <button onClick={() => navigate('/add-bike')}>Добавить товар</button>}
        <button onClick={() => navigate('/basket')}>Корзина {cartCount}</button>
        <button onClick={logout}>Выход</button>
      </div>
    </header>
  );
}

export default Header;
