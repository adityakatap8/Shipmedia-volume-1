"use client"
import { useState } from "react"
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Menu,
  MenuItem,
  Link as MuiLink,
  CssBaseline,
  Grid
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import PinterestIcon from "@mui/icons-material/Pinterest"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
// import "./App.css"
import logo from "../../assets/mediaShippers.png"
import backgroundImage from "../../assets/earth-city-bg.jpeg"
import buyer from "../../assets/Buyer2.png"
import seller from "../../assets/Seller.png"
import shippers from "../../assets/Shippers.png"

import LinkedInIcon from "@mui/icons-material/LinkedIn"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import EmailIcon from "@mui/icons-material/Email"
import { useNavigate } from "react-router-dom"
function Home() {
  // Define theme directly in the component

  const navigate = useNavigate();
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#FF6B00",
      },
      secondary: {
        main: "#FFFFFF",
      },
      background: {
        default: "#000000",
        paper: "#121212",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  })
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLoginRedirect = () => {
    console.log("login clicked")
    navigate('/login'); // <-- your login path
  };

  const ServiceIcon = (type) => {
    const iconStyle = {
      width: "50px",
      height: "50px",
      filter: "invert(1)",
      opacity: 0.8,
      marginBottom: "15px",
    }

    // Using simple div with background for icons
    return (
      <Box
        sx={{
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "15px",
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" style={iconStyle}>
          {type === "ingestion" && (
            <path d="M10 10 L40 10 L40 40 L10 40 Z M20 20 L30 20 L30 30 L20 30 Z" stroke="white" strokeWidth="2" />
          )}
          {type === "transcoding" && (
            <path d="M10 10 L40 10 L40 40 L10 40 Z M15 20 L35 20 M15 30 L35 30" stroke="white" strokeWidth="2" />
          )}
          {type === "dubbing" && (
            <path
              d="M15 15 C20 10, 30 10, 35 15 M10 25 L40 25 M15 35 C20 40, 30 40, 35 35"
              stroke="white"
              strokeWidth="2"
            />
          )}
          {type === "metadata" && (
            <path d="M10 10 L40 10 L40 40 L10 40 Z M15 20 L35 20 M15 30 L25 30" stroke="white" strokeWidth="2" />
          )}
          {type === "secure" && <path d="M25 10 L40 20 L25 30 L10 20 Z M25 30 L25 45" stroke="white" strokeWidth="2" />}
          {type === "delivery" && (
            <path d="M10 15 L40 15 L40 35 L10 35 Z M15 25 L35 25 M25 15 L25 35" stroke="white" strokeWidth="2" />
          )}
        </svg>
      </Box>
    )
  }

  // Service Card Component
  const ServiceCard = ({
    icon,
    title,
    description,


  }) => {
    return (
      <Box sx={{ marginBottom: "20px", width: "100%" }}>
        <ServiceIcon type={icon} />
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#aaa",
            fontSize: "14px",
            lineHeight: 1.5,
            marginBottom: "15px",
            maxWidth: "100%",
          }}
        >
          {description}
        </Typography>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: "white",
            borderColor: "#444",
            textTransform: "none",
            padding: "5px 15px",
            fontSize: "14px",
            "&:hover": {
              borderColor: "#666",
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          View Details
        </Button>
      </Box>
    )
  }



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            minHeight: "100vh",
            // background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Image */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1,
              },
            }}
          >
            <img
              src={backgroundImage || "/placeholder.svg"}
              alt="Earth and city background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          {/* Navigation */}
          <AppBar position="static" sx={{ backgroundColor: "transparent", padding: "10px 0", boxShadow: "none" }}>
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Media Shippers Logo"
                    style={{ height: "50px", marginRight: "10px" }}
                  />
                </Box>
                {isMobile ? (
                  <>
                    <IconButton
                      size="large"
                      edge="end"
                      color="inherit"
                      aria-label="menu"
                      onClick={handleMenu}
                      sx={{ color: "white" }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    
                      <Button onClick={handleLoginRedirect}>Login</Button>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  
                    <Button
                      variant="contained"
                      onClick={handleLoginRedirect}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        ml: 3,
                        backgroundColor: "#FF6B00",
                        "&:hover": { backgroundColor: "#E05F00" },
                        borderRadius: 0,
                        px: 3,
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          {/* Social Media Sidebar */}
          <Box
            sx={{
              position: "fixed",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              gap: 2,
              zIndex: 10,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                mb: 2,
                color: "white",
                letterSpacing: 1,
              }}
            >
              Follow
            </Typography>
            <IconButton sx={{ color: "white" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <TwitterIcon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <PinterestIcon />
            </IconButton>
          </Box>
          {/* Navigation Dots */}
          <Box
            sx={{
              position: "fixed",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              gap: 1,
              zIndex: 10,
            }}
          >
            <FiberManualRecordIcon sx={{ color: "white", fontSize: 16 }} />
            <FiberManualRecordIcon sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
            <FiberManualRecordIcon sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
          </Box>
          {/* Hero Content */}
          <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 15 }, pb: 10, position: "relative", zIndex: 2 }}>
            <Box sx={{ maxWidth: "800px" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#FF6B00",
                  mb: 2,
                  fontWeight: 500,
                  letterSpacing: 1,
                  textAlign: "left"
                }}
              >
                WORLD OF MEDIA MARKETPLACE
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", sm: "4rem", md: "6rem" },
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.1,
                  mb: 2,
                  textAlign: "left"
                }}
              >
                MEDIA
                <br />
                SHIPPERS
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  mb: 6,
                  maxWidth: "600px",
                  fontWeight: 400,

                }}
              >
                Spread your interesting stories from every corner to every screen
              </Typography>

            </Box>
          </Container>
        </Box>
      </Box>


      {/* About Buyer Section */}
      <Box
        sx={{
          backgroundColor: "#0a0a0a",
          position: "relative",
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 6 }, // ✅ Added horizontal padding
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 8 },
              alignItems: "flex-start", // ✅ Align content to top, not center
            }}
          >
            {/* Left side - Image */}
            <Box sx={{ flex: 1 }}>
              <img
                src={buyer || "/placeholder.svg"}
                alt="Person browsing Media Shippers marketplace"
                style={{
                  width: "90%", // ✅ Reduced width by 10%
                  height: "auto",
                  maxWidth: "540px", // (600 * 0.9)
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  display: "block",
                  margin: "0 auto", // ✅ Center the image horizontally
                }}
              />
            </Box>

            {/* Right side - Content */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#FF6B00",
                  mb: 3,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textAlign: "left", // ✅ Align text to left
                }}
              >
                ABOUT BUYER
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#9ba9b4",
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  textAlign: "left",
                }}
              >
                Discover, Deal, and Deliver Smarter At Media Shippers, we make finding great stories easy — and closing
                deals even easier...
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  mb: 3,
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                Search Smarter — Instantly filter by genre, territory, availability, and delivery readiness...
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                Deal with Confidence — Request titles, negotiate terms, and finalize tri-party agreements...
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* Scroll to top button */}
        <IconButton
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>


      {/* About seller Section */}
      <Box
        sx={{
          backgroundColor: "#0a0a0a",
          position: "relative",
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 6 }, // Horizontal padding added
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 8 },
              alignItems: "flex-start", // Align vertically at the top
            }}
          >
            {/* Left side - Image */}

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#FF6B00",
                  mb: 3,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textAlign: "left",
                }}
              >
                ABOUT SELLER
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#9ba9b4",
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  textAlign: "left",
                }}
              >
                Unlock New Opportunities with Media Shippers. At Media Shippers, we believe your creative energy should fuel stories — not paperwork. We're your trusted partner in getting your content to the right screens, faster and smarter...
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  mb: 3,
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                Upload and manage your content availability, rights, territories, and delivery details in one sleek dashboard.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                Get discovered by a growing network of global Buyers actively seeking premium content for their platforms.
              </Typography>
            </Box>



            {/* Right side - Content */}
            <Box sx={{ flex: 1 }}>
              <img
                src={seller || "/placeholder.svg"}
                alt="Person browsing Media Shippers marketplace"
                style={{
                  width: "90%", // 10% smaller
                  height: "auto",
                  maxWidth: "540px",
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  display: "block",
                  margin: "0 auto", // Center the image
                }}
              />
            </Box>
          </Box>
        </Container>

        {/* Scroll to top button */}
        <IconButton
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>



      {/* About shippers Section */}
      <Box
        sx={{
          backgroundColor: "#0a0a0a",
          position: "relative",
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 6 }, // Left-right padding added
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 8 },
              alignItems: "center",
            }}
          >
            {/* Left side - Image */}
            <Box sx={{ flex: 1 }}>
              <img
                src={shippers || "/placeholder.svg"}
                alt="Person browsing Media Shippers marketplace"
                style={{
                  width: "90%", // Reduced by 10%
                  height: "auto",
                  maxWidth: "540px",
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  display: "block",
                  margin: "0 auto", // Centered
                }}
              />
            </Box>

            {/* Right side - Content */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#FF6B00",
                  mb: 3,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textAlign: "left",
                }}
              >
                ABOUT SHIPPERS
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#9ba9b4",
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  textAlign: "left",
                }}
              >
                we’re a full-service platform designed to simplify and supercharge the entire content licensing journey.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  mb: 3,
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                🌎 <strong>Discover</strong> — Explore a curated catalog of films, series, and documentaries from trusted global Sellers. Instantly filter by rights, regions, and delivery status — all updated in real-time.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  mb: 3,
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                🤝 <strong>Deal-Making</strong> — Ensuring transparent, secure, and efficient negotiations, backed by platform moderation and audit trails.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  mb: 3,
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                📄 <strong>Legal Management</strong> — From drafting to signing, we facilitate tri-party agreements between Seller, Buyer, and Media Shippers — ensuring clarity, compliance, and speed at every step.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#9ba9b4",
                  fontWeight: 300,
                  textAlign: "left",
                }}
              >
                💰 <strong>Financial Services</strong> — We manage revenue processing, monthly title-wise statements, invoicing, and payment collections.
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* Scroll to top button */}
        <IconButton
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>

      {/* services */}

      <Box
          sx={{
            padding: "40px 20px",
            width: "100%",
          }}
        >
          <Container maxWidth="lg">
            {/* Services Header */}
            <Box sx={{ marginBottom: "30px" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#ff6b35",
                  fontWeight: "bold",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  marginBottom: "5px",
                }}
              >
                SERVICES
              </Typography>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "32px",
                }}
              >
                My Services
              </Typography>
            </Box>

            {/* Services Grid - 3 rows with 2 columns */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", marginBottom: "40px" }}>
              {/* Row 1 */}
              <Box>
                <ServiceCard
                  icon="ingestion"
                  title="Asset Ingestion & Validation"
                  description="We accept a wide variety of formats and securely ingest your video masters, QC reports, artwork, and metadata. Rigorous quality control checks ensure files meet platform and buyer specifications — minimizing rejection risks and costly rework."
                />
              </Box>
              <Box>
                <ServiceCard
                  icon="transcoding"
                  title="Transcoding & Packaging"
                  description="Need HLS, MPEG-DASH, ProRes, IMF, or custom deliverables? We transcode, package, and prepare your content according to the exact technical requirements of each Buyer or platform — globally."
                />
              </Box>

              {/* Row 2 */}
              <Box>
                <ServiceCard
                  icon="dubbing"
                  title="Dubbing, Subtitling & Localization"
                  description="Our network of vetted subtitling and dubbing partners ensures you have seamless multi-language versions ready for any market. We also facilitate AI+Human hybrid services for faster turnarounds without sacrificing quality or cultural nuance."
                />
              </Box>
              <Box>
                <ServiceCard
                  icon="metadata"
                  title="Metadata & Artwork Management"
                  description="From synopses to cast lists and key art — we gather, format, and validate all supporting materials. Media Shippers ensures every asset package is complete, compliant, and ready for final delivery."
                />
              </Box>

              {/* Row 3 */}
              <Box>
                <ServiceCard
                  icon="secure"
                  title="Secure Delivery & Tracking"
                  description="We use secure file delivery methods (Aspera, Signiant, SFTP, or your preferred platform) and provide full tracking until the Buyer acknowledges successful receipt."
                />
              </Box>
              <Box>
                <ServiceCard
                  icon="delivery"
                  title="Delivery Readiness Certification"
                  description="Before dispatching, our internal checklist ensures: QC Passed, Metadata Complete, Deliverables Verified, Buyer Specifications Matched."
                />
              </Box>
            </Box>

          </Container>
        </Box>

      {/* footer */}

      <Box
        sx={{
          bgcolor: "#000",
          padding: "60px 20px 20px",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Logo Section */}
            <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? "center" : "left" }}>
              <Box
                component="img"
                src={logo}
                alt="Media Shippers Logo"
                sx={{
                  maxWidth: "250px",
                  marginBottom: "20px",
                  filter: "brightness(1.2)",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#aaa",
                  fontSize: "14px",
                  maxWidth: "300px",
                  margin: isMobile ? "0 auto" : "0",
                }}
              >
                Media Shippers- We help Browse, Order, Pack & Ship Content
              </Typography>
            </Grid>

            {/* Follow Me Section */}
            <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? "center" : "left" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "20px",
                }}
              >
                Follow Me
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaa",
                  fontSize: "14px",
                  marginBottom: "15px",
                }}
              >
                Connect me with social media
              </Typography>
              <Box sx={{ display: "flex", gap: "10px", justifyContent: isMobile ? "center" : "flex-start" }}>
                <IconButton size="small" sx={{ color: "#aaa" }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "#aaa" }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "#aaa" }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "#aaa" }}>
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Contact Us Section */}
            <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? "center" : "left" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "20px",
                }}
              >
                Contact Us
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <LocationOnIcon sx={{ color: "#ff6b35", marginRight: "10px" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#aaa",
                    fontSize: "14px",
                  }}
                >
                  New Jersey, Los Angeles, India
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <EmailIcon sx={{ color: "#ff6b35", marginRight: "10px" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#aaa",
                    fontSize: "14px",
                  }}
                >
                  ashwini@entertainmenttechnologists.com
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #333",
              marginTop: "40px",
              paddingTop: "20px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "10px" : "0",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#aaa",
                fontSize: "14px",
              }}
            >
              © 2025{" "}
              <Box component="span" sx={{ color: "#ff6b35" }}>
                Media Shippers
              </Box>{" "}
              All Rights Reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaa",
                  fontSize: "14px",
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#aaa",
                  fontSize: "14px",
                }}
              >
                Terms & Condition
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* Back to Top Button */}
        <IconButton
          sx={{
            position: "absolute",
            right: "20px",
            bottom: "20px",
            bgcolor: "rgba(255,255,255,0.1)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <ArrowForwardIcon sx={{ transform: "rotate(-45deg)" }} />
        </IconButton>
      </Box>
    </ThemeProvider>
  )
}
export default Home
