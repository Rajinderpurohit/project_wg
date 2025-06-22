import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      const { token } = res.data;
      const decoded = jwtDecode(token);
      dispatch({ type: 'LOGIN', payload: { user: {id: decoded.id, role: decoded.role}, token } });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 px-2">
      <div className="card shadow-sm p-4 w-100" style={{maxWidth: '400px'}}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Name"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Password"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <select className="form-control" name="role" onChange={ onChange }>
            <option value="user" defaultChecked>Select-User-Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-100 btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;