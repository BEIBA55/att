import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsAuthenticated, setRole }) => {  // Добавляем setRole в пропсы
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      setIsAuthenticated(true); // Обновляем аутентификацию
      setRole(res.data.role);  // Обновляем роль
      navigate('/');           // Перенаправляем
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="form-container">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Войти</button>
        {message && <p className="error">{message}</p>}
      </form>
      <p style={{ marginTop: '1rem' }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login;
