import React from 'react';
import './index.css'; 
import mediaShippersLogo from '../../assets/mediShippersLogo.png'; 

const Loader = () => {
  return (
    <div className="loader-wrapper">
      {/* <img src={mediaShippersLogo} alt="MediaShippers Logo" className="loader-logo" /> */}
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
