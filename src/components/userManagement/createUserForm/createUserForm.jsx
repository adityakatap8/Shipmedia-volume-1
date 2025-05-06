// import React, { useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import SubmitButton from '../../submit/Submit';
// import Toast from '../../toast/Toast'; // Import Toast component

// const validateEmail = (email) => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
//   return emailRegex.test(email);
// };

// const validatePassword = (password) => {
//   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   return passwordRegex.test(password);
// };

// function CreateUserForm({ setShowModal }) {
//   const [name, setName] = useState('');
//   const [orgName, setOrgName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   // Toast state management
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState('info');

//   const handleCloseToast = () => setToastOpen(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!name || !email || !password || !confirmPassword || !orgName) {
//       setError('Please fill out all fields');
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError('Password requirements: Minimum 8 characters, one capital letter, one number, and one special character');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       const response = await axios.post(`https://www.mediashippers.com/api/auth/register`, {
//         name,
//         orgName,
//         email,
//         password
//       }, {
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         const token = response.data.token;
//         const userId = response.data.userId;

//         // Set success messages and handle toasts
//         setSuccessMessage('User registered successfully!');
//         setError(null);

//         // Clear the form
//         setName('');
//         setOrgName('');
//         setEmail('');
//         setPassword('');
//         setConfirmPassword('');

//         // Close modal after registration
//         setShowModal(false);

//         // Store token and user data in cookies
//         Cookies.set('token', token, { expires: 1 });
//         Cookies.set('userData', JSON.stringify({ userId, email }), { expires: 1 });

//         // Display toast for token
//         setToastMessage(`Token: ${token}`);
//         setToastSeverity('info');
//         setToastOpen(true);

//         // Display toast for success message
//         setTimeout(() => {
//           setToastMessage('User registered successfully!');
//           setToastSeverity('success');
//           setToastOpen(true);
//         }, 2000); // Show the second toast after a delay
//       } else if (response.status === 409 || response.status === 500) {
//         setError("Email already registered. Please choose a different email.");
//       } else {
//         setError("Unexpected error. Status code: " + response.status);
//       }
//     } catch (err) {
//       console.error('Registration failed');
//       if (err.response) {
//         setError(err.response.data?.errorMessage || 'Server responded with an error');
//       } else if (err.request) {
//         setError('No response from server. Please check your connection or CORS settings.');
//       } else {
//         setError('Unexpected error occurred while making the request.');
//       }
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row register-container d-flex">
//         <div className="col-md-2 flex-grow-1 d-flex justify-content-center align-items-center">
//           <form className="form-container" onSubmit={handleSubmit}>
//             <h2 className="mb-5" style={{ textAlign: 'left', fontSize: 'xx-large', fontWeight: '500' }}>Register</h2>
//             <div className="form-group">
//               <input
//                 type="text"
//                 className="form-control custom-placeholder"
//                 placeholder="Enter Your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 className="form-control custom-placeholder"
//                 placeholder="Enter Organization's name"
//                 value={orgName}
//                 onChange={(e) => setOrgName(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="email"
//                 className="form-control custom-placeholder"
//                 placeholder="Enter Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="password"
//                 className="form-control custom-placeholder"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="password"
//                 className="form-control custom-placeholder"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//             <SubmitButton label="Register" type="submit" />
//             {successMessage && (
//               <p className="mt-3 text-center text-warning" style={{ fontSize: '25px' }}>{successMessage}</p>
//             )}
//             {error && (
//               <div className="mt-3 text-left text-danger">
//                 {error}
//               </div>
//             )}
//           </form>
//         </div>
//       </div>

//       {/* Toast Notifications */}
//       <Toast
//         message={toastMessage}
//         severity={toastSeverity}
//         open={toastOpen}
//         onClose={handleCloseToast}
//       />
//     </div>
//   );
// }

// export default CreateUserForm;

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  MenuItem,
  FormControl,
  Select,
  Divider,
  Paper,
  Link,
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material"

// Styled components
const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  position: "relative",
}))

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}))

const IconContainer = styled(Box)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
}))

const StepCircle = styled(Box)(({ theme, active }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: active ? theme.palette.primary.contrastText : "rgba(255, 255, 255, 0.3)",
  color: active ? theme.palette.primary.main : theme.palette.primary.contrastText,
}))

const StepConnector = styled(Box)(({ theme, active }) => ({
  height: 2,
  backgroundColor: active ? theme.palette.primary.contrastText : "rgba(255, 255, 255, 0.3)",
  flex: 1,
  margin: theme.spacing(0, 1),
  transition: "background-color 0.5s ease",
}))

const PasswordStrengthBar = styled(LinearProgress)(({ theme, strength }) => {
  let color = theme.palette.grey[300]
  if (strength > 0) color = theme.palette.error.main
  if (strength > 25) color = theme.palette.warning.main
  if (strength > 50) color = theme.palette.info.main
  if (strength > 75) color = theme.palette.success.main

  return {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.palette.grey[200],
    "& .MuiLinearProgress-bar": {
      backgroundColor: color,
    },
  }
})

const SocialButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}))

// Framer Motion variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
}

const MotionBox = ({ children, ...props }) => (
  <Box
    component={motion.div}
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    {...props}
  >
    {children}
  </Box>
)

const CreateUserForm = ({ showForm, setShowForm }) => {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formProgress, setFormProgress] = useState(33)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  })

  // Calculate form completion percentage
  useEffect(() => {
    const calculateProgress = () => {
      const fields = [
        formData.name,
        formData.company,
        formData.email && emailVerified,
        formData.role,
        formData.password,
        formData.confirmPassword && formData.password === formData.confirmPassword,
        acceptTerms,
      ]

      const filledFields = fields.filter(Boolean).length
      return Math.round((filledFields / fields.length) * 100)
    }

    setFormProgress(calculateProgress())
  }, [formData, emailVerified, acceptTerms])

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0

    // Length check
    if (formData.password.length >= 8) strength += 25

    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 25

    // Contains number
    if (/[0-9]/.test(formData.password)) strength += 25

    // Contains special char
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25

    setPasswordStrength(strength)
  }, [formData.password])



  const handleClose = () => {
    setShowForm(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendVerification = () => {
    if (formData.email) {
      setVerificationLoading(true)
      // Simulate API call
      setTimeout(() => {
        setEmailSent(true)
        setVerificationLoading(false)
      }, 1500)
    }
  }

  const handleVerify = () => {
    setVerificationLoading(true)
    // Simulate verification process
    setTimeout(() => {
      setEmailVerified(true)
      setVerificationLoading(false)
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)

    // Show loading state
    setVerificationLoading(true)

    // Simulate API call
    setTimeout(() => {
      setVerificationLoading(false)
      setShowForm(false)

      // You would redirect or show success message here
    }, 2000)
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "No password"
    if (passwordStrength <= 25) return "Weak"
    if (passwordStrength <= 50) return "Fair"
    if (passwordStrength <= 75) return "Good"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "text.disabled"
    if (passwordStrength <= 25) return "error.main"
    if (passwordStrength <= 50) return "warning.main"
    if (passwordStrength <= 75) return "info.main"
    return "success.main"
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <MotionBox sx={{ width: "100%" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  size="small"
                  variant="standard" // Keep the border only here
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Company Name
                </Typography>
                <TextField
                  fullWidth
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  required
                  size="small"
                  variant="standard" // <- No border
                />
              </Box>

            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  required
                  disabled={emailVerified}
                  size="small"
                  InputProps={{
                    endAdornment: emailVerified && (
                      <InputAdornment position="end">
                        <CheckCircleIcon color="success" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: emailVerified
                      ? {
                        bgcolor: "success.light",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.main",
                        },
                      }
                      : {},
                  }}
                />
                {!emailVerified && (
                  <Button
                    variant="contained"
                    onClick={handleSendVerification}
                    disabled={!formData.email || verificationLoading}
                    color="secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {verificationLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : emailSent ? (
                      "Resend"
                    ) : (
                      "Verify"
                    )}
                  </Button>
                )}
              </Box>
              {emailSent && !emailVerified && (
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    borderRadius: 1,
                  }}
                  elevation={0}
                >
                  <EmailIcon fontSize="small" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2">Verification email sent! Check your inbox.</Typography>
                    <Button
                      size="small"
                      onClick={handleVerify}
                      disabled={verificationLoading}
                      sx={{ color: "primary.contrastText", textDecoration: "underline", mt: 0.5, p: 0 }}
                    >
                      {verificationLoading ? (
                        <>
                          <CircularProgress size={12} color="inherit" sx={{ mr: 1 }} />
                          Verifying...
                        </>
                      ) : (
                        "Click here to simulate verification"
                      )}
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Role
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.role}
                  onChange={handleChange}
                  name="role"
                  displayEmpty
                  inputProps={{ "aria-label": "Select your role" }}
                >
                  <MenuItem value="" disabled>
                    Select your role
                  </MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                  <MenuItem value="buyer">Buyer</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={nextStep}
                disabled={!formData.name || !formData.company || !emailVerified || !formData.role}
                endIcon={<ArrowForwardIcon />}
              >
                Next Step
              </Button>
            </Box>
          </MotionBox>
        )
      case 1:
        return (
          <MotionBox sx={{ width: "100%" }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {formData.password && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Typography variant="caption" fontWeight="medium" color={getPasswordStrengthColor()}>
                      {getPasswordStrengthText()}
                    </Typography>
                  </Box>
                  <PasswordStrengthBar variant="determinate" value={passwordStrength} strength={passwordStrength} />

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckIcon
                        fontSize="small"
                        sx={{
                          mr: 0.5,
                          color: /[A-Z]/.test(formData.password) ? "success.main" : "text.disabled",
                          fontSize: 16,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color={/[A-Z]/.test(formData.password) ? "success.main" : "text.secondary"}
                      >
                        Uppercase letter
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckIcon
                        fontSize="small"
                        sx={{
                          mr: 0.5,
                          color: /[0-9]/.test(formData.password) ? "success.main" : "text.disabled",
                          fontSize: 16,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color={/[0-9]/.test(formData.password) ? "success.main" : "text.secondary"}
                      >
                        Number
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckIcon
                        fontSize="small"
                        sx={{
                          mr: 0.5,
                          color: formData.password.length >= 8 ? "success.main" : "text.disabled",
                          fontSize: 16,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color={formData.password.length >= 8 ? "success.main" : "text.secondary"}
                      >
                        8+ characters
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckIcon
                        fontSize="small"
                        sx={{
                          mr: 0.5,
                          color: /[^A-Za-z0-9]/.test(formData.password) ? "success.main" : "text.disabled",
                          fontSize: 16,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color={/[^A-Za-z0-9]/.test(formData.password) ? "success.main" : "text.secondary"}
                      >
                        Special character
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: formData.password &&
                    formData.confirmPassword && {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: formData.password !== formData.confirmPassword ? "error.main" : "success.main",
                    },
                  },
                }}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "error.main" }}>
                  <Typography variant="caption" sx={{ display: "flex", alignItems: "center" }}>
                    Passwords do not match
                  </Typography>
                </Box>
              )}
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "success.main" }}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                  <Typography variant="caption">Passwords match</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    name="acceptTerms"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">Accept terms and conditions</Typography>
                    <Typography variant="caption" color="text.secondary">
                      By creating an account, you agree to our{" "}
                      <Link href="#" underline="hover">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" underline="hover">
                        Privacy Policy
                      </Link>
                      .
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={prevStep} startIcon={<ArrowBackIcon />}>
                Back
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                onClick={handleSubmit}
                disabled={
                  !formData.password ||
                  formData.password !== formData.confirmPassword ||
                  !acceptTerms ||
                  passwordStrength < 50 ||
                  verificationLoading
                }
              >
                {verificationLoading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </Box>
          </MotionBox>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Dialog
        open={showForm}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <HeaderBox>
          <CloseButton onClick={handleClose} size="small">
            <CloseIcon />
          </CloseButton>


          <Box sx={{ mt: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StepCircle active={currentStep >= 0}>1</StepCircle>
              <Typography variant="body2" sx={{ ml: 1 }}>
                Profile
              </Typography>
            </Box>
            <StepConnector active={currentStep >= 1} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StepCircle active={currentStep >= 1}>2</StepCircle>
              <Typography variant="body2" sx={{ ml: 1 }}>
                Security
              </Typography>
            </Box>
          </Box>
        </HeaderBox>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Registration Progress
              </Typography>
              <Typography variant="body2" fontWeight="medium" color="primary">
                {formProgress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={formProgress} sx={{ height: 6, borderRadius: 3 }} />
          </Box>

          <form onSubmit={handleSubmit}>{renderStep()}</form>

          <Divider sx={{ my: 3 }} />

        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateUserForm
