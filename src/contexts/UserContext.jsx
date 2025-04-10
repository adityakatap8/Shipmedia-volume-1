// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      console.log('Checking authentication: inside userContext...');

      try {
        const response = await fetch('https://www.mediashippers.com/api/auth/user', {
          method: 'GET',
          credentials: 'include', // 🔑 Needed to send cookies with cross-origin request
          headers: {
            'Content-Type': 'application/json',
            
            // DO NOT manually add Authorization header for HttpOnly cookies
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.warn('Unauthorized - no valid session or cookie expired.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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


