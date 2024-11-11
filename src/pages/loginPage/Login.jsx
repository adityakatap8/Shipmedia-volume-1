import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import ShipmediaLogo2 from '../../assets/ShipmediaLogo2.png';
import SubmitButton from '../../components/submit/Submit';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage('');

    // Check if both fields are empty
    if (!email.trim() && !password.trim()) {
      setError('Please provide email and password to login');
      return;
    }

    // Validate form fields
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Login request received:', { email, password });

      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      console.log('Server response:', response.data);

      if (response.status === 200) {
        setSuccessMessage('Login successful!');
        setUserData(response.data);
        // Redirect to main page or perform actions here
        window.location.href = '/main';
        
        console.log('User data:', userData);

         // Store token in localStorage
         localStorage.setItem('token', response.data.token);
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data);
      
      if (err.response?.status === 404) {
        setError('User not found');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError(err.response?.data?.errorMessage || 'An unknown error occurred');
      }
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!email.trim()) {
      setError('Please enter your email.');
      isValid = false;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className='container-fluid'>
      <div className="row register-container d-flex">
        <div className="col-md-6 left-section flex-grow-1 d-flex justify-content-center align-items-center" style={{ width: "10vw" }}>
          <div className="text-center" style={{ marginBottom: '160px' }}>
            <img src={ShipmediaLogo2} alt="Logo"/>
          </div>
        </div>
        <div className="col-md-2 right-section flex-grow-1 d-flex justify-content-center align-items-center">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2 className='mb-4 text-2xl text-left font-medium'>Login</h2>
            {error && (
              <div className="mt-3 text-left text-danger">
                <p>{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mt-3 text-center text-success">
                <p>{successMessage}</p>
              </div>
            )}
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
            <SubmitButton lable="Login" type="submit" />
            <p className="mt-3 text-left font-normal">
              Don't Have an Account? <a className='link-hover' href="/register">Click here to Register</a>
            </p>
            <p className="mt-3 text-left font-normal">
              Forgot Password? <a className='link-hover' href="#">Click here to reset</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
