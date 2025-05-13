import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const AddSubject = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !code) {
      setError('Заполните все поля');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/subjects', 
        { name, code },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setName('');
      setCode('');
      setError('');
      setSuccess('Предмет успешно добавлен');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Ошибка при добавлении предмета');
        console.error('Ошибка:', error);
      }
    }
  };

  return (
    <div className="add-subject-form">
      <h2>Добавить предмет</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название предмета:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Введите название"
          />
        </div>
        <div className="form-group">
          <label>Код предмета:</label>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            placeholder="Введите код"
          />
        </div>
        <button type="submit" className="submit-button">Добавить предмет</button>
      </form>
    </div>
  );
};

export default AddSubject;