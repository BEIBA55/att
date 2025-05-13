import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', { email, password, role });
      alert('Регистрация успешна. Теперь войдите.');
      navigate('/login'); // После регистрации перекидываем на логин
    } catch (err) {
      console.error(err);
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Студент</option>
          <option value="teacher">Учитель</option>
          <option value="admin">Админ</option>
        </select>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
