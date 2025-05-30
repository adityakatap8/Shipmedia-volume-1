import { Box } from "@mui/material"
import { keyframes } from "@mui/system"
import logo from "../../assets/LOGO UPSCALE.png"

// Define keyframes for animations
const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const colorShift = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(180deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
`

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

export default function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        position: "fixed", // Ensure it stays centered
        top: 0,
        left: 0,
        backgroundColor: "#000", // Optional: Add a background color
        zIndex: 9999, // Ensure it appears above other elements
      }}
    >
      {/* Main Logo Container */}
      <Box
        sx={{
          position: "relative",
          width: "100px",
          height: "100px",
          animation: `${floatAnimation} 3s ease-in-out infinite`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer rotating ring */}
        <Box
          sx={{
            position: "absolute",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#3f51b5",
            borderBottomColor: "#f50057",
            animation: `${rotate} 2s linear infinite`,
          }}
        />

        {/* Middle rotating ring (opposite direction) */}
        <Box
          sx={{
            position: "absolute",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "3px dashed transparent",
            borderLeftColor: "#00bcd4",
            borderRightColor: "#ff9800",
            animation: `${rotate} 3s linear infinite reverse`,
          }}
        />

        {/* Logo placeholder with pulsing effect */}
        {/* <Box
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "20%",
            backgroundColor: "#1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: `${pulse} 2s ease-in-out infinite, ${colorShift} 8s linear infinite`,
            boxShadow: "0 0 20px rgba(25, 118, 210, 0.7)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-50%",
              left: "-50%",
              right: "-50%",
              bottom: "-50%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              backgroundSize: "200% 100%",
              animation: `${shimmer} 2s infinite`,
            },
          }}
        > */}
          {/* Replace this with your actual logo or icon */}
          <img
            src={logo} // Replace with the actual path to your logo
            alt="Logo"
            style={{
              width: "40px", // Adjust the size as needed
              height: "40px",
            }}
          />
        {/* </Box> */}
      </Box>

      {/* Loading text with fade effect */}
      <Box
        sx={{
          marginTop: "30px",
          position: "relative",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#1976d2",
            opacity: 0.8,
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        >
          LOADING
        </Box>
        <Box
          component="span"
          sx={{
            display: "inline-block",
            marginLeft: "5px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              component="span"
              sx={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#1976d2",
                margin: "0 2px",
                opacity: 0.8,
                animation: `${pulse} 1s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
