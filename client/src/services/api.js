import axios from 'axios';
// import { AuthContext } from '../context/AuthContext'; // We will need to figure out how to get dispatch here
// import { useNavigate } from 'react-router-dom'; // And navigate

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this if your backend runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // How to access dispatch and navigate here?
      // This is a plain JS module, not a React component.
      // A common solution is to handle this in a higher-level component
      // or use an event emitter. For simplicity, we can have components
      // that use the API catch the error and dispatch logout.
      // Another option is to pass store.dispatch to this module.
      
      // For now, let's just clear the token.
      localStorage.removeItem('token');
      // And force a reload to go to the login page.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
