// utils/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
