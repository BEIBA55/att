import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styleadds.css';

const AddStudent = ({ onStudentAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/students', { name, email }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setName('');
      setEmail('');
      setError('');
      setSuccess('Студент успешно добавлен');
      if (onStudentAdded) onStudentAdded();
      
      // Автоматически скрываем сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Ошибка при добавлении студента');
        console.error('Ошибка:', error);
      }
    }
  };

  return (
    <div className="add-student-form">
      <h2>Добавить студента</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddStudent;