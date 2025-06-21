import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      const { token } = res.data;
      const decoded = jwtDecode(token);
      dispatch({ type: 'LOGIN', payload: { user: {id: decoded.id, role: decoded.role}, token } });
      if(decoded.role === 'admin'){
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-sm p-4" style={{width: '400px'}}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={onSubmit}>
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
          <button type="submit" className="w-100 btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
