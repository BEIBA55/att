import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Запрос списка студентов с токеном
    axios.get('http://localhost:5000/students', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setStudents(res.data))
    .catch((error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Запрос списка предметов с токеном
    axios.get('http://localhost:5000/subjects', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setSubjects(res.data))
    .catch(console.error);
  }, [navigate]);

  const handleCheckbox = (id) => {
    setAttendance({ ...attendance, [id]: !attendance[id] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const payload = {
        subjectId,
        date: new Date(date),
        attendance: Object.keys(attendance).map((id) => ({
          studentId: id,
          isPresent: attendance[id],
        })),
      };
      
      await axios.post('http://localhost:5000/attendance', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Посещаемость сохранена!');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Ошибка при сохранении:', error);
        alert('Ошибка при сохранении посещаемости');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Отметить посещаемость</h2>
      <label>
        Дата: 
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </label>
      
      <label>
        Предмет:
        <select 
          value={subjectId} 
          onChange={(e) => setSubjectId(e.target.value)} 
          required
        >
          <option value="">Выберите предмет</option>
          {subjects.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>
      </label>

      <div className="students-list">
        {students.map(student => (
          <div key={student._id} className="student-item">
            <label>
              <input
                type="checkbox"
                checked={attendance[student._id] || false}
                onChange={() => handleCheckbox(student._id)}
              />
              {student.name}
            </label>
          </div>
        ))}
      </div>

      <button type="submit">Сохранить посещаемость</button>
    </form>
  );
};

export default MarkAttendance;