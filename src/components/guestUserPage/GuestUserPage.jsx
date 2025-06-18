"use client"

import { useEffect, useState } from "react"
import { Box, Card, CardContent, Button, Typography, Container } from "@mui/material"
import { AccessTime, AutoAwesome } from "@mui/icons-material"

export default function GuestUserPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const backgroundStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    position: "relative",
    overflow: "hidden",
  }

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  }

  const floatingElementStyle1 = {
    position: "absolute",
    top: "-160px",
    right: "-160px",
    width: "320px",
    height: "320px",
    background: "rgba(147, 51, 234, 0.1)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite",
  }

  const floatingElementStyle2 = {
    position: "absolute" ,
    bottom: "-160px",
    left: "-160px",
    width: "320px",
    height: "320px",
    background: "rgba(59, 130, 246, 0.1)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite 1s",
  }

  const floatingElementStyle3 = {
    position: "absolute" ,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "384px",
    height: "384px",
    background: "rgba(99, 102, 241, 0.05)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite 0.5s",
  }

  const cardStyle = {
    maxWidth: "400px",
    width: "100%",
    background: "rgba(55, 65, 81, 0.5)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(75, 85, 99, 0.5)",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(32px)",
    transition: "all 1s ease-out",
  }

  const iconContainerStyle = {
    position: "relative" ,
    width: "64px",
    height: "64px",
    margin: "0 auto 24px",
  }

  const iconBackgroundStyle = {
    position: "absolute" ,
    inset: 0,
    background: "linear-gradient(45deg, #fbbf24, #f97316)",
    borderRadius: "50%",
    opacity: 0.2,
    animation: "spin 8s linear infinite",
  }

  const iconStyle = {
    position: "relative" ,
    background: "linear-gradient(45deg, #fbbf24, #f97316)",
    borderRadius: "50%",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(251, 191, 36, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const headingStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ffffff, #d1d5db)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "8px",
  }

  const subHeadingStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: "24px",
  }

  const personalizedTextStyle = {
    color: "#d1d5db",
    lineHeight: 1.6,
    marginBottom: "16px",
  }

  const brandHighlightStyle = {
    background: "linear-gradient(45deg, #fbbf24, #f97316)",
    color: "#000000",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
  }

  const descriptionStyle = {
    color: "#9ca3af",
    fontSize: "0.875rem",
    lineHeight: 1.6,
    marginBottom: "24px",
  }

  const buttonStyle = {
    width: "100%",
    background: "linear-gradient(45deg, #dc2626, #b91c1c)",
    color: "#ffffff",
    fontWeight: "600",
    padding: "12px 24px",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(220, 38, 38, 0.3)",
    textTransform: "none" ,
    fontSize: "1rem",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(45deg, #b91c1c, #991b1b)",
      transform: "scale(1.05)",
      boxShadow: "0 15px 35px rgba(220, 38, 38, 0.4)",
    },
  }

  const statusIndicatorStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
  }

  const statusDotStyle = {
    width: "8px",
    height: "8px",
    backgroundColor: "#eab308",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
  }

  const statusTextStyle = {
    fontSize: "0.75rem",
    color: "#6b7280",
  }

  // Create floating particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <Box
      key={i}
      sx={{
        position: "absolute",
        width: "4px",
        height: "4px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 3}s`,
      }}
    />
  ))

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Box sx={backgroundStyle}>
        {/* Animated background elements */}
        <Box sx={floatingElementStyle1} />
        <Box sx={floatingElementStyle2} />
        <Box sx={floatingElementStyle3} />

        {/* Floating particles */}
        <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>{particles}</Box>

        <Container maxWidth="sm" sx={containerStyle}>
          <Card sx={cardStyle}>
            <CardContent sx={{ padding: "32px", textAlign: "center" }}>
              {/* Icon with animation */}
              <Box sx={iconContainerStyle}>
                <Box sx={iconBackgroundStyle} />
                <Box sx={iconStyle}>
                  <AccessTime sx={{ color: "#ffffff", fontSize: "32px", animation: "pulse 2s ease-in-out infinite" }} />
                </Box>
              </Box>

              {/* Main heading */}
              <Typography sx={headingStyle}>Bear with us...</Typography>
              <Typography sx={subHeadingStyle}>Your registration is being reviewed.</Typography>

              {/* Personalized message */}
              <Typography sx={personalizedTextStyle}>
                Thank you for registering with{" "}
                <Box component="span" sx={brandHighlightStyle}>
                  mediashippers
                </Box>
                .
              </Typography>

              <Typography sx={descriptionStyle}>
                Our team is busy verifying your account. You will receive a status update from us very soon.
              </Typography>

              {/* Action button */}
              <Button variant="contained" sx={buttonStyle} startIcon={<AutoAwesome />}>
                Visit mediashippers
              </Button>

              {/* Status indicators */}
              <Box sx={statusIndicatorStyle}>
                <Box sx={statusDotStyle} />
                <Typography sx={statusTextStyle}>Processing</Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  )
}
