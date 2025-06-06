import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mediaShippers from "../../assets/mediaShippers.png";
import Submit from '../submit/Submit';
import "./index.css";
import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.png";
import youtube from "../../assets/youtube.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const serviceList = [
    "• Delivery to OTT Streaming Platforms",
    "• Delivery to Film Festivals",
    "• Delivery to Censor Board",
    "• Dubbing Services",
    "• Subtitling Services",
    "• QC and Compliance Services",
    "• Distribution Services"
  ];

  return (
    <nav className="bg-white-800 text-black">
      <div className="container-fluid full-width-container"> {/* Apply the custom class here */}
        {/* Row container with Flexbox */}
        <div className="row d-flex justify-content-between align-items-center full-width-row">
          {/* Call or Text Section - Left-aligned with custom styling */}
          <div className="col-md-4 call-text-laptop">
            <div className="call-text-section">
              <h2>Call or Text:</h2>
              <span>(866) 204-7073</span>
            </div>
          </div>

          {/* Logo Section - Centered */}
          <div className="col-md-4 text-center">
            <img
              className="contact-logo-image"
              src={mediaShippers}
              alt="Logo"
              style={{ width: '100%' }}
            />
          </div>

          <div className="col-md-4 call-text-mobile">
            <div className="call-text-section">
              <h2>Call or Text:</h2>
              <span>(866) 204-7073</span>
            </div>
          </div>

          {/* Social Media Icons and Login/Register Section */}
          <div className="col-md-4 login-button-row">
            {/* Social Media Icons - Top */}
            {/* <div className="d-flex justify-content-center mb-3">
    <div className="me-3">
      <img src={instagram} alt="Instagram Logo" className="social-icon" />
    </div>
    <div className="me-3">
      <img src={linkedin} alt="LinkedIn Logo" className="social-icon" />
    </div>
    <div className="me-3">
      <img src={youtube} alt="YouTube Logo" className="social-icon" />
    </div>
  </div> */}

            {/* Login/Register Section - Bottom */}
            <div className="d-flex justify-content-center login-section-laptop">
              <Submit lable="Login" to="/login" />
              <Submit lable="Register" to="/register" />
            </div>
            <div className="d-flex justify-content-center login-section-mobile">
              {/* <Submit lable="Login" to="/login" /> */}
              <a className='btn-call'> <h2>Call or Text:</h2>
              <span>(866) 204-7073</span></a>
              <button className='btn-call' to="/register">Register</button>
              {/* <Submit lable="Register" to="/register" /> */}
            </div>
          </div>
          {/* (866) 204-7073 */}


        </div>

        {/* Sliding Ribbon Section */}
        <div className="sliding-ribbon-container">
          <div className="sliding-ribbon">
            <span>• Delivery to OTT Streaming Platforms</span>
            <span>• Delivery to Film Festivals</span>
            <span>• Delivery to Censor Board</span>
            <span>• Dubbing Services</span>
            <span>• Subtitling Services</span>
            <span>• QC and Compliance Services</span>
            <span>• Distribution Services</span>
            <span>• Delivery to OTT Streaming Platforms</span>
            <span>• Delivery to Film Festivals</span>
            <span>• Delivery to Censor Board</span>
            <span>• Dubbing Services</span>
            <span>• Subtitling Services</span>
            <span>• QC and Compliance Services</span>
            <span>• Distribution Services</span>
            <span>• Delivery to OTT Streaming Platforms</span>
            <span>• Delivery to Film Festivals</span>
            <span>• Delivery to Censor Board</span>
            <span>• Dubbing Services</span>
            <span>• Subtitling Services</span>
            <span>• QC and Compliance Services</span>
            <span>• Distribution Services</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
