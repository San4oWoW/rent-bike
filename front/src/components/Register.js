import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5103/api/Auth/register', {
                Username: username,
                Login: login,
                Email: email,
                Password: password
            });
            navigate('/login');
        } catch (error) {
            alert("Не удалось зарегистрироваться, проверьте корректность данных и попробуйте езе раз.");
        }
    };

    return (
        <div className='register-container'>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Введите ваше имя</label>
                    <input 
                        type="Введите ваше имя" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Введите логин</label>
                    <input 
                        type="Введите логин" 
                        value={login} 
                        onChange={(e) => setLogin(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Введите почту</label>
                    <input 
                        type="Введите почту" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Введите пароль</label>
                    <input 
                        type="Введите пароль" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
