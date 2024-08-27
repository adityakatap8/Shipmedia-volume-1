// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LOGO from "../../assets/LOGO.png"
import "./index.css"


const Submit = () => {
  return (
    <div style={{ textAlign : "left" }} className='mb-3 mt-3'>
        <button type="submit" className="submit-btn">Submit</button>
    </div>
  );
};

export default Submit;
