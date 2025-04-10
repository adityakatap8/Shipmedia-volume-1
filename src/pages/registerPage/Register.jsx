import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import mediaShippers from '../../assets/mediaShippers.png';
import SubmitButton from '../../components/submit/Submit';

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
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
    setError(null);

    if (!name || !email || !password || !confirmPassword || !orgName) {
      setError('Please fill out all fields');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password requirements: Minimum 8 characters, one capital letter, one number, and one special character');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`https://www.mediashippers.com/api/auth/register`, {
        name,
        orgName,
        email,
        password
      }, {
        withCredentials: true,
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
        const userId = response.data.userId;

        console.log('Generated token:', token);
        alert(`Registration successful! Token: ${token}`);

        // Store token and user data in cookies
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('userData', JSON.stringify({ userId, email }), { expires: 1 });
      } else if (response.status === 409 || response.status === 500) {
        setError("Email already registered. Please choose a different email.");
      } else {
        setError("Unexpected error. Status code: " + response.status);
      }
    } catch (err) {
      console.error('Registration failed');

      if (err.response) {
        // Server responded with a status code outside 2xx
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        console.error('Error headers:', err.response.headers);
        setError(err.response.data?.errorMessage || 'Server responded with an error');
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection or CORS settings.');
      } else {
        // Something went wrong setting up the request
        console.error('Axios config error:', err.message);
        setError('Unexpected error occurred while making the request.');
      }

      console.error('Full error object:', err.toJSON ? err.toJSON() : err);
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
                      : error
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
  );
}

export default Register;
