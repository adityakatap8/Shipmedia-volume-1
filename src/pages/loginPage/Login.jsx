import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthToken, clearMessages } from '../../redux/authSlice/authSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import mediaShippers from '../../assets/mediaShippers.png';
import SubmitButton from '../../components/submit/Submit';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import Toast from '../../components/toast/Toast.jsx'; // ✅ Toast component

function Login() {
  const { refreshUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const showToast = (message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearMessages());

    if (!validateForm()) return;

    try {
      const response = await axios.post('https://www.mediashippers.com/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.success) {
        const { userId, token } = response.data;

        dispatch(setAuthToken({
          token,
          user: { userId, email },
        }));

        sessionStorage.setItem('userData', JSON.stringify({ userId, email }));

        if (token) {
          sessionStorage.setItem('token', token);
        }

        showToast('Login successful!', 'success');
        // showToast(`Token: ${token}`, 'info');

        await refreshUser();
        navigate('/projects');
      } else {
        showToast('Failed to login, please try again.', 'error');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        showToast('User not found', 'error');
      } else if (err.response?.status === 401) {
        showToast('Invalid credentials', 'error');
      } else {
        showToast(err.response?.data?.errorMessage || 'An unknown error occurred', 'error');
      }
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      showToast('Please enter your email.', 'error');
      return false;
    }

    if (!password.trim()) {
      showToast('Please enter your password.', 'error');
      return false;
    }

    return true;
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

      {/* ✅ Toast for success/error/info */}
      <Toast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleToastClose}
      />
    </div>
  );
}

export default Login;
