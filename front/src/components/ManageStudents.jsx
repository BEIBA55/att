import React, { useState } from 'react';
import AddStudent from './AddStudent';
import StudentList from './StudentList';
import '../App.css';

const ManageStudents = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleStudentAdded = () => {
    setRefreshFlag(prev => !prev);
  };

  const handleStudentDeleted = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <div className="manage-students">
      <AddStudent onStudentAdded={handleStudentAdded} />
      <StudentList 
        refreshFlag={refreshFlag} 
        onStudentDeleted={handleStudentDeleted}
      />
    </div>
  );
};

export default ManageStudents;