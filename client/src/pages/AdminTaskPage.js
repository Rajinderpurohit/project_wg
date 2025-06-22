import React from 'react';
import TaskDashboard from './TaskDashboard';

const AdminTaskPage = () => {
  return (
    <div className="container-fluid px-0 px-md-3">
      <div className="card shadow-sm mx-auto">
        <div className="card-header">
          <h2 className="h2 mb-0">Task Management</h2>
        </div>
        <div className="card-body p-2 p-md-4">
          <TaskDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminTaskPage;
