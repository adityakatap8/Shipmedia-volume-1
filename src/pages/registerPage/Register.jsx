import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"

import logo from '../../assets/Logo01.png';
import SubmitButton from '../../components/submit/Submit';

function Register() {
  return (
    <div className="register-container d-flex">
      <div className="left-section flex-grow-1 d-flex justify-content-center align-items-center" style={{ width : "10vw" }}>
        <div className="text-center" style={{ marginBottom : '150px' }}>
            <img src={logo} alt="Logo"/>
        </div>
      </div>
      <div className="right-section flex-grow-1 d-flex justify-content-center align-items-center">
        <form className="form-container">
          <h2 className='mb-5' style={{ textAlign: 'left', fontSize: 'xx-large', fontWeight: '500' }}>Register</h2>
          <div className="form-group">
            <input type="text" className="form-control custom-placeholder" placeholder="Enter Name" />
          </div>
          <div className="form-group">
            <input type="email" className="form-control custom-placeholder" placeholder="Enter Email" />
          </div>
          <div className="form-group">
            <input type="password" className="form-control custom-placeholder" placeholder="Enter Password" />
          </div>
          <div className="form-group">
            <input type="password" className="form-control custom-placeholder" placeholder="Confirm Password" />
          </div>
          <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="terms" />
            <label className="form-check-label" htmlFor="terms">
              Click to agree to Terms and Conditions
            </label>
          </div>
        
          <SubmitButton />
          
          <p className="mt-3" style={{ textAlign : "left", fontSize : "medium" }}>
            Forgot Password? <a href="#">Click here to reset</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
