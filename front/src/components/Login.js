import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/bicycles');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('api/Auth/login', {
                Email: email,
                Password: password
            });
            localStorage.setItem('token', response.data.token.result);
            navigate('/bicycles');
        } catch (error) {
            console.error("Login failed: ", error);
            alert("Failed to login. Please check your credentials and try again.");
        }
    };

    return (
        <div className="login-container">
            <h2>Логин</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Введите почту</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Введите пароль</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <div className='buttons-in-reg'>
                    <button type="submit">Войти</button>
                    <button onClick={() => navigate('/Register')}>Зарегистрироваться</button>
                </div>
                
            </form>
        </div>
    );
}

export default Login;
