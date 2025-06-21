import React, { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch({ type: 'LOGOUT' });
        } else {
            // When the app loads, we need to re-login the user
            // if the token is still valid.
            const user = {
                id: decodedToken.id,
                role: decodedToken.role,
                // Add other user properties you might have in the token
            };
            dispatch({ type: 'LOGIN', payload: { user, token } });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      }
    }
    // Finished checking token, set loading to false
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}; 