import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import mediaShippers from '../../assets/mediaShippers.png';
import SubmitButton from '../../components/submit/Submit';

// Utility functions for validation
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[(com|in)]$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

function Register() {
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setError(null);

    if (!name || !email || !password || !confirmPassword || !orgName) {
      setError('Please fill out all fields');
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      setError('Password requirements: Minimum 8 characters, one capital letter, one number, and one special character');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        orgName,
        email,
        password
      });

      if (response.status === 200) {
        setSuccessMessage('User registered successfully!');
        setError(null);
        setName('');
        setOrgName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        const token = response.data.token;
        console.log('Generated token:', token);
        alert(`Registration successful! Token: ${token}`);

        // Store token in localStorage
        localStorage.setItem('token', token);

      } else if (response.status === 200) {
        // Handle duplicate email or invalid input
        setError("User Registered Successfully");
      } else if (response.status === 409 || response.status === 500) {
        // Handle duplicate email or invalid input
        setError("Email already registered. Please choose a different email.");
      } else if (response.status >= 500) {
        // Handle server errors
        setError("An unexpected error occurred. Please try again later.");
      } else {
        // Handle other status codes
        setError("Unexpected error. Status code: " + response.status);
      }
    } catch (err) {
      console.error('Error occurred during registration:', err.response?.data);
      setError(err.response?.data ? err.response.data : 'An error occurred during registration');
    }
  };

  return (
    <div className='container-fluid'>
      <div className="row register-container d-flex">
        <div className="col-md-6 left-section flex-grow-1 d-flex justify-content-center align-items-center" style={{ width: "10vw" }}>
          <div className="text-center" style={{ marginBottom: '150px' }}>
            <img src={mediaShippers} alt="Logo" />
          </div>
        </div>
        <div className="col-md-2 right-section flex-grow-1 d-flex justify-content-center align-items-center">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2 className='mb-5' style={{ textAlign: 'left', fontSize: 'xx-large', fontWeight: '500' }}>Register</h2>
            <div className="form-group">
              <input
                type="text"
                className="form-control custom-placeholder"
                placeholder="Enter Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control custom-placeholder"
                placeholder="Enter Organization's name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control custom-placeholder"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control custom-placeholder"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control custom-placeholder"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <SubmitButton lable="Register" type="submit" />
            {successMessage && (
              <p className="mt-3 text-center text-warning" style={{ fontSize: '25px' }}>{successMessage}</p>
            )}
            {error && (
              <div className="mt-3 text-left text-danger">
                {typeof error === 'object' && error !== null ? (
                  Object.keys(error).some(key =>
                    typeof error[key] === 'string' &&
                    error[key].toLowerCase().includes('duplicate') &&
                    error[key].toLowerCase().includes('key')
                  ) ?
                    "This email is already registered. Please choose a different email." :
                    "An error occurred. Please try again later."
                ) : (
                  typeof error === 'string' && error.includes('duplicate key') && error.includes('email')
                    ? "This email is already registered. Please choose a different email."
                    : error === "Email already registered. Please choose a different email."
                      ? "Email already registered. Please choose a different email."
                      : "An error occurred. Please try again later."
                )}
              </div>
            )}

            <p className="mt-3 text-left font-normal">
              Already have an Account? <a className='link-hover' href="/login">Click here to Login</a>
            </p>
            <p className="mt-3" style={{ textAlign: "left", fontSize: "medium" }}>
              Forgot Password? <a className='link-hover' href="#">Click here to reset</a>
            </p>
          </form>
        </div>
      </div> 
    </div>
  )
}

export default Register
