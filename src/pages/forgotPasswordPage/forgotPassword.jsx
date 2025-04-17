"use client"

import { useState } from "react"
import { Box, Container, Paper, Typography, TextField, Button, Link } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

// Create a custom theme to match your brand colors
const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // Blue color from your login page
        },
        secondary: {
            main: "#f26522", // Orange color from your login page
        },
    },
    typography: {
        fontFamily: "Arial, sans-serif",
    },
})

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("")

        // Basic validation
        if (!email) {
            setError("Please enter your email address")
            return
        }

        // Simulate API call
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setSuccess(true)
            // In a real app, you would make an API call here
        }, 1500)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                }}
            >

                {/* Main Card */}
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        bgcolor: "#1976d2",
                        color: "white",
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    {success ? (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h5" component="h1" gutterBottom>
                                Check Your Email
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
                                We've sent password reset instructions to your email address.
                            </Typography>
                            <Link href="#" onClick={() => setSuccess(false)} color="inherit" underline="hover">
                                Try another email
                            </Link>
                            <Box sx={{ mt: 2 }}>
                                <Link href="#" color="inherit" underline="hover">
                                    Back to Login
                                </Link>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h5" component="h1" align="center" gutterBottom>
                                Forgot Password
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Typography variant="subtitle2" component="label" htmlFor="email" sx={{display:"block", textAlign: "left" }}>
                                    Email
                                </Typography>
                                <TextField
                                    id="email"
                                    fullWidth
                                    type="email"
                                    margin="normal"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                    FormHelperTextProps={{ sx: { color: "error.light" } }}
                                    sx={{
                                        mb: 3,
                                        mt: 1,
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "rgba(255, 255, 255, 0.1)",
                                            color: "white",
                                            "& fieldset": {
                                                borderColor: "rgba(255, 255, 255, 0.3)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "rgba(255, 255, 255, 0.5)",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "white",
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "white",
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "rgba(255, 255, 255, 0.7)",
                                            opacity: 1,
                                        },
                                    }}
                                    InputProps={{
                                        sx: { height: 50 },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{
                                        mt: 2,
                                        mb: 2,
                                        bgcolor: "#f26522",
                                        color: "white",
                                        height: 48,
                                        "&:hover": {
                                            bgcolor: "#e55511",
                                        },
                                    }}
                                >
                                    {isSubmitting ? "Sending..." : "Reset Password"}
                                </Button>

                                <Box sx={{ textAlign: "right", mt: 2 }}>
                                    <Link href="/login" color="inherit" underline="hover" sx={{
                                        textDecoration: "underline",
                                        "&:hover": {
                                            color: "white",
                                        },
                                    }}>
                                        Back to Login
                                    </Link>
                                </Box>
                            </form>
                        </>
                    )}
                </Paper>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    © {new Date().getFullYear()} MediaShippers. All rights reserved.
                </Typography>
            </Container>
        </ThemeProvider>
    )
}

export default ForgotPassword
