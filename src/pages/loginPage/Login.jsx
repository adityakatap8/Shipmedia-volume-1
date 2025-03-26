import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';  // Import useSelector to access Redux state
import { setAuthToken, setError, setSuccessMessage, clearMessages } from '../../redux/authSlice/authSlice.js';  // Import actions
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import mediaShippers from '../../assets/mediaShippers.png';
import SubmitButton from '../../components/submit/Submit';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();  // Get dispatch function from redux

  // Access error and successMessage from Redux state
  const { error, successMessage } = useSelector((state) => state.auth);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(clearMessages());  // Clear any previous messages
  
    // Validate form fields
    if (!validateForm()) {
      return;
    }
  
    try {
      console.log('Login request received:', { email, password });
  
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
  
      console.log('Server response:', response.data);  // Log the response to check if the token is returned
  
      if (response.status === 200) {
        // Check if the token exists in the response
        if (response.data.token) {
          console.log('Token:', response.data.token);  // Log the token to verify it's correct
          
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userData', JSON.stringify({ userId: response.data.userId, email }));
          
          // Dispatch the token and user data to Redux store
          dispatch(setAuthToken({
            token: response.data.token,
            user: { userId: response.data.userId, email },
          }));
  
          // Optionally, set success message
          dispatch(setSuccessMessage('Login successful!'));
  
          // Redirect to main page or perform actions here
          window.location.href = '/projects';
        } else {
          console.log('Token is missing in response:', response.data);
        }
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data);
      if (err.response?.status === 404) {
        dispatch(setError('User not found'));
      } else if (err.response?.status === 401) {
        dispatch(setError('Invalid credentials'));
      } else {
        dispatch(setError(err.response?.data?.errorMessage || 'An unknown error occurred'));
      }
    }
  };
  

  // Form validation function
  const validateForm = () => {
    let isValid = true;

    if (!email.trim()) {
      dispatch(setError('Please enter your email.'));
      isValid = false;
    }

    if (!password.trim()) {
      dispatch(setError('Please enter your password.'));
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className='container-fluid'>
      <div className="row register-container d-flex">
        <div className="col-md-6 left-section flex-grow-1 d-flex justify-content-center align-items-center" style={{ width: "10vw" }}>
          <div className="text-center" style={{ marginBottom: '160px' }}>
            <img src={mediaShippers} alt="Logo"/>
          </div>
        </div>
        <div className="col-md-2 right-section flex-grow-1 d-flex justify-content-center align-items-center">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2 className='mb-4 text-2xl text-left font-medium'>Login</h2>

            {/* Display error message if available */}
            {error && (
              <div className="mt-3 text-left text-danger">
                <p>{error}</p>
              </div>
            )}

            {/* Display success message if available */}
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
