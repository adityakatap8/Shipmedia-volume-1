// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LOGO from "../../assets/LOGO.png"
import "./index.css"


const Submit = ({ to, lable }) => {

const navigate = useNavigate();

const handleClick = () => {
  navigate(to);
}

  return (
    <div style={{ textAlign : "left" }} className='mb-3 mt-3'>
        <button onClick={handleClick} type="submit" className="submit-btn">{lable}</button>
    </div>
  );
};

export default Submit;
