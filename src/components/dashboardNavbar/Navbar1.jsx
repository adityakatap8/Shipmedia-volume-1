import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import logo from '../../assets/Logo.png';
import User1 from '../../assets/User1.jpg';
import { clearAuthToken } from '../../redux/authSlice/authSlice';
import './index.css';

const Navbar1 = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [timeout] = useState(900000); // 15 minutes

  // 🧠 Pull user and token from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('userData');
    const storedToken = sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      fetchUserInfo(); // fallback if sessionStorage is cleared
    }

    const idleInterval = setInterval(checkIdleTimeout, 60000); // check every minute
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    return () => {
      clearInterval(idleInterval);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(clearAuthToken());

      // 🔁 Optional: call server logout to clear cookie
      const response = await fetch('https://www.mediashippers.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Logout failed');

      const data = await response.json();
      if (data.success) {
        console.log('Logout successful');

        // Clear session storage
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('token');

        // Reset local state
        setIsLoggedIn(false);
        setUser(null);

        // Redirect to login
        window.location.replace('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('https://www.mediashippers.com/api/user/info', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch user info');

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsLoggedIn(true);

        // Also sync to sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(data.user));
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setIsLoggedIn(false);
    }
  };

  const resetIdleTimer = () => setLastActiveTime(Date.now());

  const checkIdleTimeout = () => {
    const currentTime = Date.now();
    if (currentTime - lastActiveTime >= timeout) {
      console.log('User is idle for too long');
      handleLogout();
    }
  };

  return (
    <nav className="bg-white-800 p-2 flex items-center justify-between border-b-2 navbar">
      <div className="flex items-center p-1 main-navbar">
        <img
          src={logo}
          alt="Logo"
          className="h-14 w-auto pl-5"
          width="56" // Explicit width
          height="56" // Explicit height
        />
      </div>

      <div className="flex items-center space-x-4 pr-10 pt-2">
        {isLoggedIn && user && (
          <>
            {/* Add width and height for profile image to optimize LCP */}
            <img
              src={user.avatar || User1}
              alt="User Profile"
              className="h-10 w-10 rounded-full"
              width="40" // Explicit width
              height="40" // Explicit height
              loading="lazy" // Lazy load the image
            />
            <span className="text-black">{user.name}</span>
            <span className="text-gray-600 ml-2 id-class">ID: {user.userId || 'N/A'}</span>
            <span className="text-gray-600 ml-2 email-class">Email: {user.email}</span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar1;
