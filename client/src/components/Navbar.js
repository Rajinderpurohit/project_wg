import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import '../ResponsiveFixes.css';

const CustomNavbar = () => {
  const { isAuthenticated, user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-check2-square me-2"></i>
          <span className="fw-bold">TaskMaster</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-lg-center w-100 justify-content-end">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="me-lg-3">Dashboard</Nav.Link>
                {user?.role === 'admin' && (
                  <NavDropdown title="Admin Tools" id="admin-tools-dropdown" align="end" className="me-lg-3">
                    <NavDropdown.Item as={Link} to="/admin/users">Manage Users</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/tasks">Manage Tasks</NavDropdown.Item>
                  </NavDropdown>
                )}
                <Button onClick={handleLogout} variant="outline-light" className="responsive-btn mt-2 mt-lg-0">Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-lg-3">Login</Nav.Link>
                <Button as={Link} to="/register" variant="primary" className="responsive-btn mt-2 mt-lg-0">Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar; 