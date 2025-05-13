import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../stylelists.css';

const StudentList = ({ refreshFlag, onStudentDeleted }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setStudents(response.data);
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Ошибка загрузки списка студентов');
        console.error('Ошибка:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (onStudentDeleted) onStudentDeleted();
      fetchStudents(); // Обновляем список после удаления
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      setError('Не удалось удалить студента');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [navigate, refreshFlag]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-list">
      <h3>Список студентов</h3>
      {students.length > 0 ? (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              {student.name} — {student.email}
              <button 
                onClick={() => handleDelete(student._id)}
                className="delete-button"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет данных о студентах</p>
      )}
    </div>
  );
};

export default StudentList;