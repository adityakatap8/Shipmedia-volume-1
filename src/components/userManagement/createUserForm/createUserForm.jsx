import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SubmitButton from '../../submit/Submit';
import Toast from '../../toast/Toast'; // Import Toast component

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

function CreateUserForm({ setShowModal }) {
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Toast state management
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info');

  const handleCloseToast = () => setToastOpen(false);

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
        const token = response.data.token;
        const userId = response.data.userId;

        // Set success messages and handle toasts
        setSuccessMessage('User registered successfully!');
        setError(null);

        // Clear the form
        setName('');
        setOrgName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Close modal after registration
        setShowModal(false);

        // Store token and user data in cookies
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('userData', JSON.stringify({ userId, email }), { expires: 1 });

        // Display toast for token
        setToastMessage(`Token: ${token}`);
        setToastSeverity('info');
        setToastOpen(true);

        // Display toast for success message
        setTimeout(() => {
          setToastMessage('User registered successfully!');
          setToastSeverity('success');
          setToastOpen(true);
        }, 2000); // Show the second toast after a delay
      } else if (response.status === 409 || response.status === 500) {
        setError("Email already registered. Please choose a different email.");
      } else {
        setError("Unexpected error. Status code: " + response.status);
      }
    } catch (err) {
      console.error('Registration failed');
      if (err.response) {
        setError(err.response.data?.errorMessage || 'Server responded with an error');
      } else if (err.request) {
        setError('No response from server. Please check your connection or CORS settings.');
      } else {
        setError('Unexpected error occurred while making the request.');
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row register-container d-flex">
        <div className="col-md-2 flex-grow-1 d-flex justify-content-center align-items-center">
          <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="mb-5" style={{ textAlign: 'left', fontSize: 'xx-large', fontWeight: '500' }}>Register</h2>
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
            <SubmitButton label="Register" type="submit" />
            {successMessage && (
              <p className="mt-3 text-center text-warning" style={{ fontSize: '25px' }}>{successMessage}</p>
            )}
            {error && (
              <div className="mt-3 text-left text-danger">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast
        message={toastMessage}
        severity={toastSeverity}
        open={toastOpen}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default CreateUserForm;
