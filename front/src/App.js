import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './navstyle.css';

import AddStudent from './components/AddStudent';
import AddSubject from './components/AddSubject';
import MarkAttendance from './components/MarkAttendance';
import AttendanceReport from './components/AttendanceReport';
import StudentAttendanceReport from './components/StudentAttendanceReport'; // Добавлен новый компонент
import ManageStudents from './components/ManageStudents';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    console.log('Token:', token);
    console.log('Stored Role:', storedRole);
    
    setIsAuthenticated(!!token);
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="app-container">
          <nav className="navbar">
            {role === 'admin' && (
              <>
                <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
                  Управление студентами
                </NavLink>
                <NavLink to="/subjects" className={({ isActive }) => isActive ? 'active' : ''}>
                  Добавить предмет
                </NavLink>
              </>
            )}

            {role === 'teacher' && (
              <>
                <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
                  Отметить посещаемость
                </NavLink>
                <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>
                  Журнал посещаемости
                </NavLink>
              </>
            )}

            {role === 'student' && (
              <NavLink to="/my-attendance" className={({ isActive }) => isActive ? 'active' : ''}>
                Моя посещаемость
              </NavLink>
            )}

            <button onClick={handleLogout}>Выйти</button>
          </nav>

          <Routes>
            {role === 'admin' && (
              <>
                <Route path="/students" element={<ManageStudents />} />
                <Route path="/subjects" element={<AddSubject />} />
                <Route path="/report" element={<AttendanceReport />} />
              </>
            )}

            {role === 'teacher' && (
              <>
                <Route path="/attendance" element={<MarkAttendance />} />
                <Route path="/report" element={<AttendanceReport />} />
              </>
            )}

            {role === 'student' && (
              <Route path="/my-attendance" element={<StudentAttendanceReport />} />
            )}

            {/* Общие маршруты */}
            <Route path="/" element={
              role === 'admin' ? <Navigate to="/students" /> :
              role === 'teacher' ? <Navigate to="/attendance" /> :
              role === 'student' ? <Navigate to="/my-attendance" /> :
              <Navigate to="/login" />
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;