// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LOGO from "../../assets/LOGO.png"
import "./index.css"
import Submit from '../submit/Submit';
import Register from '../../pages/registerPage/Register';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white-800 text-black">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">

        <div className="text-xl font-semibold">
        <Link to="/">
            <img src={LOGO} alt="Logo" className="h-50" /> 
          </Link>
        </div>
        
        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex items-center px-3 py-2 border border-gray-700 rounded text-black hover:bg-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        {/* Menu Items */}
        <div className={`lg:flex lg:items-center lg:space-x-4 text-black ${isOpen ? 'block' : 'hidden'}`}>
          <Link to="/" className="menu-item">Home</Link>
          <Link to="/pricing" className="menu-item">Pricing</Link>
          <Link to="/about" className="menu-item">About</Link>
          <Link to="/contact" className="menu-item">Contact Us</Link>
        </div>
        <div className='d-flex'>
        <Submit lable="Login" to="/login"/>
        <Submit lable="Register" to="/register"/>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
