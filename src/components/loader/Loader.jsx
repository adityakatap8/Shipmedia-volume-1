import React from 'react';
import './index.css'; 


const Loader = () => {
  return (
    <div className="loader-wrapper">
      {/* Optional: Logo */}
      {/* <img src={mediaShippersLogo} alt="MediaShippers Logo" className="loader-logo" /> */}
      
      <div className="loader"></div>

      {/* Loader Message */}
      <p className="loading-message text-white mt-5">
        Hold tight! We're gathering your data and will have it ready shortly.
      </p>
    </div>
  );
};

export default Loader;
