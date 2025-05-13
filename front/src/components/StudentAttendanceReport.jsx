// StudentAttendanceReport.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendanceReport = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/my-attendance', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setRecords(res.data))
    .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Моя посещаемость</h2>
      {records.map((record) => (
        <div key={record._id}>
          <p>Дата: {new Date(record.date).toLocaleDateString()}</p>
          <p>Предмет: {record.subject}</p>
          <p>Статус: {record.isPresent ? 'Присутствовал' : 'Отсутствовал'}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentAttendanceReport;