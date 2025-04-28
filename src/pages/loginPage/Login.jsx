"use client"

import { Box, Container, Typography, TextField, Button, Paper, InputAdornment, IconButton, Link } from "@mui/material"
import { styled } from "@mui/material/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import mediaShippers from "../../assets/mediaShippers.png"
import { useState, useContext, useEffect, useRef } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../utils/AuthContext"
import { setAuthToken } from "../../redux/authSlice/authSlice"
import Cookies from "js-cookie"

const LoginPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
}))

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastSeverity, setToastSeverity] = useState("success")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const animationRef = useRef(null)

  useEffect(() => {
    // Create particles for the animation
    if (animationRef.current) {
      const container = animationRef.current
      
      // Clear any existing particles
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      
      // Create new particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.classList.add('particle')
        
        // Random size between 5px and 20px
        const size = Math.random() * 15 + 5
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        
        // Random starting position
        particle.style.left = `${Math.random() * 100}%`
        particle.style.top = `${Math.random() * 100}%`
        
        // Random animation duration between 15s and 30s
        const duration = Math.random() * 15 + 15
        particle.style.animationDuration = `${duration}s`
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 10}s`
        
        container.appendChild(particle)
      }
    }
  }, [])

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const { refreshUser } = useContext(AuthContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const showToast = (message, severity = "success") => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleToastClose = () => {
    setToastOpen(false)
  }

  // Email validation function
  const validateEmail = (email, checkEmpty = false) => {
    if (checkEmpty && (!email || email.length === 0)) {
      setEmailError("Email is required")
      return false
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    } else {
      setEmailError("")
      return true
    }
  }

  // Password validation function
  const validatePassword = (password, checkEmpty = false) => {
    if (checkEmpty && (!password || password.length === 0)) {
      setPasswordError("Password is required")
      return false
    } else if (password && password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return false
    } else if (password && !/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one capital letter")
      return false
    } else if (password && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Password must contain at least one special character")
      return false
    } else {
      setPasswordError("")
      return true
    }
  }

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    // Only validate format, not required field
    validateEmail(newEmail, false)
  }

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    // Only validate format, not required field
    validatePassword(newPassword, false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous errors
    setEmailError("")
    setPasswordError("")

    let hasError = false

    if (!email || email.length === 0) {
      setEmailError("Email is required")
      hasError = true
    }

    if (!password || password.length === 0) {
      setPasswordError("Password is required")
      hasError = true
    }

    if (hasError) {
      showToast("Please fill in all required fields", "error")
      return
    }

    // Set form as submitted to show validation errors
    setFormSubmitted(true)

    // Validate format for both fields
    const isEmailValid = validateEmail(email, false)
    const isPasswordValid = validatePassword(password, false)

    if (!isEmailValid || !isPasswordValid) {
      showToast("Please check your email and password format", "error")
      return
    }

    try {
      const response = await axios.post(
        "https://www.mediashippers.com/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 200 && response.data.success) {
        const { userId, user, token } = response.data
        console.log("Login successful, token received:", token)

        // Store token in both cookies and sessionStorage
        Cookies.set("token", token, { expires: 1 }) // Expires in 1 day
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("userData", JSON.stringify({ userId, email }))

        dispatch(
          setAuthToken({
            token,
            user: { userId, email, user },
          }),
        )

        showToast("Login successful!", "success")
        await refreshUser()
        navigate("/showcase-projects")
      } else {
        showToast("Failed to login, please try again.", "error")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (err.response?.status === 404) {
        showToast("User not found", "error")
      } else if (err.response?.status === 401) {
        showToast("Invalid credentials", "error")
      } else {
        showToast(err.response?.data?.errorMessage || "An unknown error occurred", "error")
      }
    }
  }

  const validateForm = () => {
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    return isEmailValid && isPasswordValid
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated Background */}
      <div className="animated-background" ref={animationRef}>
        <div className="gradient-overlay"></div>
      </div>
      
      {/* Right side background */}
      <div className="right-background"></div>

      {/* Left side - Features - 7 columns */}
      <Box sx={{ 
        flex: 7, 
        display: "flex", 
        flexDirection: "column",
        position: "relative",
        zIndex: 1
      }}>
        <Container maxWidth="md">
          <div
            className="col-md-6 left-section flex-grow-1 d-flex justify-content-center align-items-center mb-0"
            style={{ width: "100%" }}
          >
            <div className="text-center">
              <div style={{ marginBottom: "-8px" }}>
                <img src={mediaShippers || "/placeholder.svg"} alt="Logo" style={{ maxWidth: "70%", height: "auto" }} />
              </div>

              <Box sx={{ 
                mt: 1, 
                textAlign: "left", 
                color: "#333",
                p: 3,
                borderRadius: "16px",
                background: "#fbe1d6",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
              }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, textAlign: "center" }}>
                  Browse. Order. Pack & Ship
                </Typography>

                {/* First Row: Browse and Order */}
                <Box sx={{ display: "flex", flexDirection: "row", mb: 3 }}>
                  {/* Browse */}
                  <Box sx={{ flex: 1, mr: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box component="span" sx={{ mr: 1, fontSize: "1.5rem" }}>
                        🎬
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ec6b32" }}>
                          Browse
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Discover Stories - Curated for Global Reach.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Search Less, Find More - Smarter Content Browsing.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Your Marketplace for Stream-Ready Titles.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Order */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box component="span" sx={{ mr: 1, fontSize: "1.5rem" }}>
                        🤝
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ec6b32" }}>
                          Order
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Deals Made Simple - Rights, Regions, Terms, All in One Flow.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Negotiate, Confirm, and Move On - Seamlessly.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          From Interest to Agreement in Clicks, Not Weeks.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Second Row: Pack and Ship */}
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  {/* Pack */}
                  <Box sx={{ flex: 1, mr: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box component="span" sx={{ mr: 1, fontSize: "1.5rem" }}>
                        📦
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ec6b32" }}>
                          Pack
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Delivery - Ready Masters with Subtitles, Metadata, & More.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Fully Prepped. Fully Compliant. Fully Yours.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Transcode. Tag. Track. All in One Shot.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Ship */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box component="span" sx={{ mr: 1, fontSize: "1.5rem" }}>
                        🚚
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ec6b32" }}>
                          Ship
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Deliver Worldwide - Fast, Secure, Verified.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          We Ship to Any Screen, Any Format, Anywhere.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                          Trusted Delivery from Cloud to Broadcaster.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </div>
          </div>
        </Container>
      </Box>

      {/* Right side - Login Form - 5 columns */}
      <Box sx={{ 
        flex: 5, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        p: 4,
        position: "relative",
        zIndex: 1,
        marginTop: "80px"
      }}>
        <LoginPaper elevation={6} sx={{ 
          width: "100%", 
          maxWidth: 400,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
            transform: "rotate(45deg)",
            animation: "shine 3s infinite",
          },
          "@keyframes shine": {
            "0%": { transform: "translateX(-100%) rotate(45deg)" },
            "100%": { transform: "translateX(100%) rotate(45deg)" }
          }
        }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#fbe1d6" }}>
              Login
            </Typography>
            {/* <Typography sx={{ mt: 1 }}>Access your MediaShippers account</Typography> */}
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography component="label" htmlFor="email" sx={{ display: "block", mb: 1, textAlign: "left" }}>
                  Email <span style={{ color: "#ff6b6b" }}>*</span>
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
                  <Box
                    sx={{
                      mt: 1,
                      p: 0.5,
                      bgcolor: "white",
                      borderRadius: 1,
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      width: "fit-content",
                      display: "block",
                      textAlign: "left",
                      ml: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#d32f2f",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        lineHeight: 1.2,
                      }}
                    >
                      {emailError}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box>
                <Typography component="label" htmlFor="password" sx={{ display: "block", textAlign: "left" }}>
                  Password <span style={{ color: "#ff6b6b" }}>*</span>
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
                  <Box
                    sx={{
                      mt: 1,
                      p: 0.5,
                      bgcolor: "white",
                      borderRadius: 1,
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      width: "fit-content",
                      display: "block",
                      textAlign: "left",
                      ml: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#d32f2f",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        lineHeight: 1.2,
                      }}
                    >
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
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#d45a28",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(236, 107, 50, 0.4)",
                  },
                }}
              >
                Login
              </Button>

              <Box sx={{ textAlign: "right" }}>
                <Link
                  href="/forgot-password"
                  sx={{
                    color: "white",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </form>
        </LoginPaper>
      </Box>

      {/* Footer */}
      <Box sx={{ position: "absolute", bottom: 2, left: "40%", typography: "body2", color: "text.secondary", zIndex: 2 }}>
        © 2025 MediaShippers. All rights reserved.
      </Box>
    </Box>
  )
}

export default Login
