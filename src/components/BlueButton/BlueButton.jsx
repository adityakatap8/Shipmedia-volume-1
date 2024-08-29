// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./index.css"


const BlueButton = ({ to, lable }) => {

const navigate = useNavigate();

const handleClick = () => {
  navigate(to);
}

  return (
    <div className='mb-3 mt-3'>
        <button onClick={handleClick} type="submit" className="blue-btn">{lable}</button>
    </div>
  );
};

export default BlueButton;
