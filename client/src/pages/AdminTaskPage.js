import React from 'react';
import TaskDashboard from './TaskDashboard';

const AdminTaskPage = () => {
  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h2 className="h2 mb-0">Task Management</h2>
      </div>
      <div className="card-body">
        <TaskDashboard />
      </div>
    </div>
  );
};

export default AdminTaskPage;
