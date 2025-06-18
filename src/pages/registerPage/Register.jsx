import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Eye, EyeOff, User, Building, Mail, CheckCircle } from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import mediaShippers from '../../assets/mediaShippers.png';
import SubmitButton from '../../components/submit/Submit';
import { Box, Button, Container, IconButton, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles"

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

const LoginPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
}))

export default function Register() {
  const [name, setName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!name || !email || !password || !confirmPassword || !orgName) {
      setError("Please fill out all fields")
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError("Password requirements: Minimum 8 characters, one capital letter, one number, and one special character")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `https://www.mediashippers.com/api/auth/register`,
        {
          name,
          orgName,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        setSuccessMessage("User registered successfully!")
        setError(null)
        setName("")
        setOrgName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")

        const token = response.data.token
        const userId = response.data.userId

        console.log("Generated token:", token)

        // Store token and user data in cookies
        Cookies.set("token", token, { expires: 1 })
        Cookies.set("userData", JSON.stringify({ userId, email }), { expires: 1 })
      } else if (response.status === 409 || response.status === 500) {
        setError("Email already registered. Please choose a different email.")
      } else {
        setError("Unexpected error. Status code: " + response.status)
      }
    } catch (err) {
      console.error("Registration failed")

      if (err.response) {
        console.error("Error status:", err.response.status)
        console.error("Error data:", err.response.data)
        setError(err.response.data?.errorMessage || "Server responded with an error")
      } else if (err.request) {
        console.error("No response received:", err.request)
        setError("No response from server. Please check your connection.")
      } else {
        console.error("Axios config error:", err.message)
        setError("Unexpected error occurred while making the request.")
      }
    } finally {
      setIsLoading(false)
    }
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
                    Join. Create. Pack & Ship
                    </Typography>
    
                    {/* First Row: Browse and Order */}
                    <Box sx={{ display: "flex", flexDirection: "row", mb: 3 }}>
                      {/* Browse */}
                      <Box sx={{ flex: 1, mr: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <Box component="span" sx={{ mr: 1, fontSize: "1.5rem" }}>
                          <User className="w-6 h-6 text-orange-600" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ec6b32" }}>
                              Join
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                            Create your personal profile and manage your media content with ease.
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
    
                      {/* Order */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <Box component="span" sx={{ mr: 1, fontSize: "1.5rem" }}>
                          <Building className="w-6 h-6 text-blue-600" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ec6b32" }}>
                              Create
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                            Set up your organization and collaborate with your team members.
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
                            Your data is protected with enterprise-grade security measures.
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
                  Register
                </Typography>
                {/* <Typography sx={{ mt: 1 }}>Access your MediaShippers account</Typography> */}
              </Box>
    
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Full Name Field */}
                  <Box>
                    <Typography component="label" htmlFor="name" sx={{ display: "block", mb: 1, textAlign: "left" }}>
                      Full Name <span style={{ color: "#ff6b6b" }}>*</span>
                    </Typography>
                    <TextField
                      id="name"
                      size="small"
                      fullWidth
                      variant="outlined"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
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
                  </Box>

                  {/* Organization Field */}
                  <Box>
                    <Typography component="label" htmlFor="orgName" sx={{ display: "block", mb: 1, textAlign: "left" }}>
                      Organization <span style={{ color: "#ff6b6b" }}>*</span>
                    </Typography>
                    <TextField
                      id="orgName"
                      size="small"
                      fullWidth
                      variant="outlined"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Enter organization name"
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
                  </Box>

                  {/* Email Field */}
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
                      onChange={(e) => setEmail(e.target.value)}
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
                  </Box>

                  {/* Phone Number Field */}
                  <Box>
                    <Typography component="label" htmlFor="phone" sx={{ display: "block", mb: 1, textAlign: "left" }}>
                      Phone Number <span style={{ color: "#ff6b6b" }}>*</span>
                    </Typography>
                    <TextField
                      id="phone"
                      size="small"
                      fullWidth
                      variant="outlined"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
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
                  </Box>

                  {/* Address Field */}
                  <Box>
                    <Typography component="label" htmlFor="address" sx={{ display: "block", mb: 1, textAlign: "left" }}>
                      Address <span style={{ color: "#ff6b6b" }}>*</span>
                    </Typography>
                    <TextField
                      id="address"
                      size="small"
                      fullWidth
                      variant="outlined"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
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
                  </Box>

                  {/* Submit Button */}
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
                    Register
                  </Button>
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

