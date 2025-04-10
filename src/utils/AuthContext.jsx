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

    axios.defaults.headers.Authorization = `Bearer ${token}`;

    try {
      const response = await axios.get('https://www.mediashippers.com/api/auth/user', {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(response.data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
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
