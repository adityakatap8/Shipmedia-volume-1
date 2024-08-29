import React from 'react';
import logo from '../../assets/Logo.png';
import user from '../../assets/User1.jpg';

const Navbar1 = () => {
  return (
    <nav className="bg-white-800 p-2 flex items-center justify-between border-b-4">
      <div className="flex items-center p-1">
        <img src={logo} alt="Logo" className="h-14 w-auto pl-5" />
      </div>
      
      <div className="flex items-center space-x-4 pr-10 pt-2">
        <img src={user} alt="User Profile" className="h-10 w-10" />
        <span className="text-black">Username</span>
      </div>
    </nav>
  );
};

export default Navbar1;
