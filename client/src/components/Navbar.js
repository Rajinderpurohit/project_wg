import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-check2-square me-2"></i>
          <span className="fw-bold">TaskMaster</span>
        </Link>
        <div className="d-flex align-items-center">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin Tools
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end start-0">
                    <li><Link to="/admin/users" className="dropdown-item">Manage Users</Link></li>
                    <li><Link to="/admin/tasks" className="dropdown-item">Manage Tasks</Link></li>
                  </ul>
                </li>
              ) : (
                <span className="navbar-text me-3">Welcome, {user?.name || 'User'}!</span>
              )}
              
              <button onClick={handleLogout} className="btn btn-outline-light ms-3">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-white me-3">Login</Link>
              <Link to="/register" className="nav-link text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 