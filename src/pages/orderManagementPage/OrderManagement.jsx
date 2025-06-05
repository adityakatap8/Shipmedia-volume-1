import { useState, useEffect, useRef } from "react"
import { Box, Typography, Button, Container, Divider, Paper } from "@mui/material"
import { motion } from "framer-motion"

const services = [
  { id: 1, name: "Lip Sync Check", icon: "🔊" },
  { id: 2, name: "Subtitling", icon: "📝" },
  { id: 3, name: "Artwork Automation", icon: "🎨" },
  { id: 4, name: "Automated QC", icon: "✓" },
  { id: 5, name: "Transcoding/Encoding", icon: "🔄" },
  { id: 6, name: "Metadata Generation", icon: "📊" },
  { id: 7, name: "Trailers", icon: "🎬" },
  { id: 8, name: "Shorts/Reels", icon: "📱" },
  { id: 9, name: "Content Delivery", icon: "🚀" },
  { id: 10, name: "Dubbing", icon: "🎤" },
  { id: 11, name: "Closed Captioning", icon: "💬" },
  { id: 12, name: "Artwork Localization", icon: "🌐" },
]

export default function PremiumServiceSelection() {
  const [selectedServices, setSelectedServices] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    setIsLoaded(true)

    // Background animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 100

    class Particle {
      x
      y
      size
      speedX
      speedY
      color

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `rgba(66, 133, 244, ${Math.random() * 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const serviceVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  }

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      elevation={0}
      sx={{
        minHeight: "89vh",
        background: "linear-gradient(135deg, #0A1122 0%, #1A2235 50%, #0A1122 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ zIndex: 1, position: "relative" }}
      >
        <Box
          sx={{
            background: "rgba(10, 17, 34, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            padding: { xs: 3, md: 3 },
            transform: "perspective(1000px) rotateX(0deg)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "perspective(1000px) rotateX(1deg)",
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 2,
                ml: 1,
                textShadow: "0 2px 10px rgba(66, 133, 244, 0.3)",
                display: "inline-block",
                background: "linear-gradient(90deg, #fff, #4285F4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Choose Services
            </Typography>
          </motion.div>

          <Divider
            component={motion.div}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            sx={{
              background: "linear-gradient(90deg, transparent, #4285F4, transparent)",
              height: "2px",
              mb: 5,
              mt: 2,
              opacity: 0.8,
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              mb: 6,
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                custom={index}
                variants={serviceVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  onClick={() => handleServiceToggle(service.id)}
                  sx={{
                    px: 3,
                    py: 1.8,
                    borderRadius: 6,
                    cursor: "pointer",
                    background: selectedServices.includes(service.id)
                      ? `linear-gradient(135deg, rgba(66, 133, 244, 0.4), rgba(66, 133, 244, 0.1))`
                      : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid",
                    borderColor: selectedServices.includes(service.id)
                      ? "rgba(66, 133, 244, 0.6)"
                      : "rgba(255, 255, 255, 0.1)",
                    color: selectedServices.includes(service.id) ? "#fff" : "rgba(255, 255, 255, 0.8)",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    boxShadow: selectedServices.includes(service.id)
                      ? "0 0 20px rgba(66, 133, 244, 0.4)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    position: "relative",
                    "&::before": selectedServices.includes(service.id)
                      ? {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "radial-gradient(circle at center, rgba(66, 133, 244, 0.2), transparent)",
                          opacity: 0.6,
                          zIndex: 0,
                        }
                      : {},
                  }}
                >
                  <Box component="span" sx={{ fontSize: "1.2rem", mr: 1, opacity: 0.9, zIndex: 1 }}>
                    {service.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: selectedServices.includes(service.id) ? 600 : 400,
                      zIndex: 1,
                    }}
                  >
                    {service.name}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              disabled={selectedServices.length === 0}
              sx={{
                borderRadius: 8,
                px: 6,
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: 600,
                background:
                  selectedServices.length === 0
                    ? "linear-gradient(90deg, #666, #999)"
                    : "linear-gradient(90deg, #4285F4, #34A853)",
                boxShadow:
                  selectedServices.length === 0
                    ? "none"
                    : "0 8px 20px rgba(66, 133, 244, 0.5), 0 0 15px rgba(66, 133, 244, 0.3)",
                position: "relative",
                overflow: "hidden",
                textTransform: "none",
                "&::before":
                  selectedServices.length > 0
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        animation: "shine 3s infinite",
                        "@keyframes shine": {
                          "0%": { left: "-100%" },
                          "20%": { left: "100%" },
                          "100%": { left: "100%" },
                        },
                      }
                    : {},
              }}
            >
              Submit
            </Button>
          </Box>

          {selectedServices.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Typography
                sx={{
                  textAlign: "center",
                  mt: 3,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.9rem",
                }}
              >
                {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected
              </Typography>
            </motion.div>
          )}
        </Box>
      </Container>
    </Paper>
  )
}
