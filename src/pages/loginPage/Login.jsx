import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"

import logo from '../../assets/Logo01.png';
import SubmitButton from '../../components/submit/Submit';

function Login() {
  return (
    <div className="register-container d-flex">
      <div className="left-section flex-grow-1 d-flex justify-content-center align-items-center" style={{ width : "10vw" }}>
        <div className="text-center" style={{ marginBottom : '160px' }}>
            <img src={logo} alt="Logo"/>
        </div>
      </div>
      <div className="right-section flex-grow-1 d-flex justify-content-center align-items-center">
        <form className="form-container">
          <h2 className='mb-4 text-2xl text-left font-medium'>Login</h2>
          <div className="form-group">
            <input type="email" className="form-control custom-placeholder" placeholder="Enter Email" />
          </div>
          <div className="form-group">
            <input type="password" className="form-control custom-placeholder" placeholder="Enter Password" />
          </div>
        
          <SubmitButton />
          
          <p className="mt-3 text-left font-normal">
            Forgot Password? <a href="#">Click here to reset</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
