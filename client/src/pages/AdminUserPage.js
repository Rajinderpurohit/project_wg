import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleUserStatusChange = async (userId, status) => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/users/${userId}/status`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user status', error);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h2 className="h2 mb-0">User Management</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleUserStatusChange(user._id, user.status)}
                      className="btn btn-primary btn-sm"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
