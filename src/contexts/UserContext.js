import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [ projectName, setProjectName ] = useState("")

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      console.log('Checking authentication...');
      
      const token = window.localStorage.getItem("token");
      
      if (!token || !token.trim()) {
        console.log('No valid token found');
        setIsAuthenticated(false);
        return;
      }

      try {
        console.log('Fetching user data...');
        const response = await fetch('https://www.mediashippers.com/api/auth/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log('User data received:', userData);
        
        setUserData(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFetchData().then(() => {
      console.log('Authentication check completed');
    });
  }, []);

  // Using React.createElement to create the context provider element
  return React.createElement(
    UserContext.Provider,
    { value: { userData, isLoading, setIsLoading, isAuthenticated, projectName, setProjectName } },
    children
  );
};
