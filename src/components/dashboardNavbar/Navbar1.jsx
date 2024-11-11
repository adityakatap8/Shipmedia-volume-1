import React from 'react';
import logo from '../../assets/Logo.png';
import User1 from '../../assets/User1.jpg';

const Navbar1 = ({ user, isAuthenticated, onLogout }) => {
  const handleLogout = async () => {
    try {
      // Remove JWT token from localStorage
      localStorage.removeItem('token');

      // Remove user data from sessionStorage
      sessionStorage.removeItem('userData');

      const response = await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });
      console.log('Logout response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Logout response data:', data);
      if (data.success) {
        console.log('Logout successful');
        window.location.replace('/login');
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-white-800 p-2 flex items-center justify-between border-b-4">
      <div className="flex items-center p-1">
        <img src={logo} alt="Logo" className="h-14 w-auto pl-5" />
      </div>
      
      <div className="flex items-center space-x-4 pr-10 pt-2">
        {isAuthenticated && (
          <>
            <img src={User1?.avatar || User1} alt="User Profile" className="h-10 w-10" />
            <span className="text-black">{user.name}</span>
            <span className="text-gray-600 ml-2">ID: {user.userId ? user.userId : 'N/A'}</span>
            
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
