import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = Cookies.get('token');

    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://www.mediashippers.com/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setUser(response.data);
        setIsLoggedIn(true);
        // Ensure token is stored in both places for consistency
        sessionStorage.setItem('token', token);
      } else {
        setIsLoggedIn(false);
        // Clear invalid token
        Cookies.remove('token');
        sessionStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
      // Clear invalid token
      Cookies.remove('token');
      sessionStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, refreshUser: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
