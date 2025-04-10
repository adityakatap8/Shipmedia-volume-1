import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';  // Import useSelector to access Redux state
import { setAuthToken, setError, setSuccessMessage, clearMessages } from '../../redux/authSlice/authSlice.js';  // Import actions
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import mediaShippers from '../../assets/mediaShippers.png';
import SubmitButton from '../../components/submit/Submit';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

function Login() {
  const { refreshUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();  // Get dispatch function from redux

  // Access error and successMessage from Redux state
  const auth = useSelector((state) => state.auth);
  const { error, successMessage } = auth;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearMessages());

    if (!validateForm()) return;

    try {
      console.log('Login request received:', { email, password });

      const response = await axios.post('https://www.mediashippers.com/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true, // ✅ cookie-based auth
      });

      console.log('Server response:', response.data);

      if (response.status === 200 && response.data.success) {
        const userId = response.data.userId;

        // Store user data in Redux
        dispatch(setAuthToken({
          token: 'authenticated',
          user: { userId, email },
        }));

        dispatch(setSuccessMessage('Login successful!'));

        // ✅ Save user info in sessionStorage
        sessionStorage.setItem('userData', JSON.stringify({ userId, email }));

        // Optional: Save token if returned (and not HttpOnly)
        if (response.data.token) {
          sessionStorage.setItem('token', response.data.token);
        }

        // ✅ Navigate here directly to avoid useEffect throttling
        console.log('Navigating to /projects');
        await refreshUser();
        navigate('/projects');
      } else {
        console.log('Unexpected login response:', response.data);
        dispatch(setError('Failed to login, please try again.'));
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
          <img src={mediaShippers} alt="Logo" />
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
