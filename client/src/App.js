import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserPage from './pages/AdminUserPage';
import AdminTaskPage from './pages/AdminTaskPage';
import TaskDashboard from './pages/TaskDashboard';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserPage />} />
            <Route path="tasks" element={<AdminTaskPage />} />
          </Route>
          
          {/* User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <TaskDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="text-center mt-5"><h1>Loading...</h1></div>;
  }

  return isAuthenticated ? (user?.role==='admin'?<Navigate to="/admin"/>:children) : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="text-center mt-5"><h1>Loading...</h1></div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default App;
