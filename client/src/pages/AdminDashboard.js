import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="card shadow-sm text-center mx-auto" style={{maxWidth: 600}}>
      <div className="card-header">
        <h1 className="h1 mb-0">Admin Dashboard</h1>
      </div>
      <div className="card-body">
        <p className="lead">Welcome, Admin!</p>
        <p>Please use the navigation links to manage users and tasks.</p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
          <Link to="/admin/users" className="btn btn-dark btn-lg px-4 mb-2 mb-md-0">Manage Users</Link>
          <Link to="/admin/tasks" className="btn btn-outline-secondary btn-lg px-4">Manage Tasks</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
