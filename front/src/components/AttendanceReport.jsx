import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styleattenr.css';

const AttendanceReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/attendance', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setRecords(response.data);
        setError('');
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Ошибка загрузки данных посещаемости');
          console.error('Ошибка:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [navigate]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="attendance-report">
      <h2>Журнал посещаемости</h2>
      {records.length > 0 ? (
        records.map((entry) => (
          <div key={entry._id} className="attendance-entry">
            <p><b>Дата:</b> {new Date(entry.date).toLocaleDateString()}</p>
            <p><b>Предмет:</b> {entry.subject?.name || 'Неизвестный предмет'}</p>
            <ul>
              {entry.attendance?.map((att) => (
                <li key={att.student?._id || att.studentId}>
                  {att.student?.name || 'Неизвестный студент'} — 
                  {att.isPresent ? '✔️ Присутствовал' : '❌ Отсутствовал'}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Нет данных о посещаемости</p>
      )}
    </div>
  );
};

export default AttendanceReport;