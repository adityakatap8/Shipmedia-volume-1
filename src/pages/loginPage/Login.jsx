import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  FormHelperText,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import mediaShippers from '../../assets/mediaShippers.png';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';


const LoginPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
}))

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const { refreshUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  // Email validation function
  const validateEmail = (email, checkEmpty = false) => {
    if (checkEmpty && (!email || email.length === 0)) {
      setEmailError('Email is required');
      return false;
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Password validation function
  const validatePassword = (password, checkEmpty = false) => {
    if (checkEmpty && (!password || password.length === 0)) {
      setPasswordError('Password is required');
      return false;
    } else if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    } else if (password && !/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one capital letter');
      return false;
    } else if (password && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Only validate format, not required field
    validateEmail(newEmail, false);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Only validate format, not required field
    validatePassword(newPassword, false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;

    if (!email || email.length === 0) {
      setEmailError('Email is required');
      hasError = true;
    }

    if (!password || password.length === 0) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Set form as submitted to show validation errors
    setFormSubmitted(true);

    // Validate format for both fields
    const isEmailValid = validateEmail(email, false);
    const isPasswordValid = validatePassword(password, false);

    if (!isEmailValid || !isPasswordValid) {
      showToast('Please check your email and password format', 'error');
      return;
    }

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
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left side - Features */}
      <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, display: "flex", flexDirection: "column" }}>
        <Container maxWidth="sm">

          <div className="col-md-6 left-section flex-grow-1 d-flex justify-content-center align-items-center mb-0" style={{ width: "40vw" }}>
            <div className="text-center">
              <img src={mediaShippers} alt="Logo" />
            </div>
          </div>
        </Container>
      </Box>

      {/* Right side - Login Form */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <LoginPaper elevation={6} sx={{ width: "100%", maxWidth: 400 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{color: "#ec6b32"}}>
              Login
            </Typography>
            {/* <Typography sx={{ mt: 1 }}>Access your MediaShippers account</Typography> */}
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography component="label" htmlFor="email" sx={{ display: "block", mb: 1, textAlign: "left" }}>
                  Email <span style={{ color: '#ff6b6b' }}>*</span>
                </Typography>
                <TextField
                  id="email"
                  size="small"
                  fullWidth
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  placeholder="Enter your email"
                  InputProps={{
                    sx: {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      color: "white",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.6)",
                        opacity: 1,
                      },
                    },
                  }}
                />
                {emailError && (
                  <Box sx={{ 
                    mt: 1,
                    p: 0.5, 
                    bgcolor: 'white', 
                    borderRadius: 1,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                    width: 'fit-content',
                    display: 'block',
                    textAlign: 'left',
                    ml: 0
                  }}>
                    <Typography sx={{ 
                      color: '#d32f2f', 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold',
                      lineHeight: 1.2
                    }}>
                      {emailError}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box>
                <Typography component="label" htmlFor="password" sx={{ display: "block", textAlign: "left" }}>
                  Password <span style={{ color: '#ff6b6b' }}>*</span>
                </Typography>
                <TextField
                  id="password"
                  fullWidth
                  size="small"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!passwordError}
                  placeholder="Enter your password"
                  InputProps={{
                    sx: {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      color: "white",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.6)",
                        opacity: 1,
                      },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {passwordError && (
                  <Box sx={{ 
                    mt: 1,
                    p: 0.5, 
                    bgcolor: 'white', 
                    borderRadius: 1,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                    width: 'fit-content',
                    display: 'block',
                    textAlign: 'left',
                    ml: 0
                  }}>
                    <Typography sx={{ 
                      color: '#d32f2f', 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold',
                      lineHeight: 1.2
                    }}>
                      {passwordError}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button 
                type="submit"
                variant="contained" 
                fullWidth 
                size="large" 
                sx={{
                  backgroundColor: "#ec6b32",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#ec6b32",
                  },
                }}
              >
                Login
              </Button>

              <Box sx={{ textAlign: "right" }}>
                <Link href="/forgot-password" sx={{
                  color: "white",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "white",
                  },
                }}>
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </form>
        </LoginPaper>
      </Box>

      {/* Footer */}
      <Box sx={{ position: "absolute", bottom: 2, left: "40%", typography: "body2", color: "text.secondary" }}>
        © 2025 MediaShippers. All rights reserved.
      </Box>
    </Box>
  )
}

export default Login;
