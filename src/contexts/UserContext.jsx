// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      console.log('Checking authentication: inside userContext...');
      const token = Cookies.get('token');
      try {
        const response = await axios.get('https://www.mediashippers.com/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        console.log('Response status:', response);

        const data = await response.data;
        console.log('User data received:', data);

        setUserData(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setUserData(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  
  return (
    <UserContext.Provider
      value={{ userData, isLoading, setIsLoading, isAuthenticated, projectName, setProjectName }}
    >
      {children}
    </UserContext.Provider>
  );
};


