import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/Logo.png';
import User1 from '../../assets/User1.jpg';
import { clearAuthToken } from '../../redux/authSlice/authSlice';  // Use correct action for logout

const Navbar1 = () => {
  const dispatch = useDispatch();
  
  // Access the user data and authentication status from the Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [timeout, setTimeout] = useState(900000);  // Set idle timeout to 15 minutes (900,000 ms)

  const handleLogout = async () => {
    try {
      // Dispatch the clearAuthToken action to clear the auth state in Redux
      dispatch(clearAuthToken());
  
      // Optionally, clear JWT and user data from localStorage/sessionStorage
      localStorage.removeItem('token');
      sessionStorage.removeItem('userData');
  
      // Call your backend logout endpoint (if required)
      const response = await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        console.log('Logout successful');
        setIsLoggedIn(false);
        window.location.replace('/login');  // Redirect to login page
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      // Make sure the `error` variable is correctly defined here
      console.error('Error during logout:', error);  // Log the error here
    }
  };
  

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    const expirationTime = decodedToken?.exp * 1000; // Token expiration time in milliseconds
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
      console.log('Token expired');
      handleLogout(); // Token expired, log the user out
    }
  };

  const resetIdleTimer = () => {
    setLastActiveTime(Date.now()); // Reset the last active time when there's user activity
  };

  const checkIdleTimeout = () => {
    const currentTime = Date.now();
    if (currentTime - lastActiveTime >= timeout) {
      console.log('User is idle for too long');
      handleLogout(); // Log out the user after timeout
    }
  };

  useEffect(() => {
    // Check token expiration every minute
    const tokenExpirationInterval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);  // Check every minute

    // Check idle timeout every minute
    const idleTimeoutInterval = setInterval(() => {
      checkIdleTimeout();
    }, 60000);  // Check every minute

    // Listen for user activity to reset idle timeout
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    // Clean up the intervals and event listeners when the component unmounts
    return () => {
      clearInterval(tokenExpirationInterval);
      clearInterval(idleTimeoutInterval);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, [lastActiveTime]);

  return (
    <nav className="bg-white-800 p-2 flex items-center justify-between border-b-4">
      <div className="flex items-center p-1">
        <img src={logo} alt="Logo" className="h-14 w-auto pl-5" />
      </div>
      
      <div className="flex items-center space-x-4 pr-10 pt-2">
        {isLoggedIn && user && (
          <>
            <img src={user.avatar || User1} alt="User Profile" className="h-10 w-10" />
            <span className="text-black">{user.name}</span>
            <span className="text-gray-600 ml-2">ID: {user.userId ? user.userId : 'N/A'}</span>
            <span className="text-gray-600 ml-2">Email: {user.email}</span> {/* Display user's email */}
            
            {/* Logout button */}
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar1;
