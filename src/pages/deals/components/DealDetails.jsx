import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Avatar,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
} from "@mui/material"
import {
  AccessTime,
  CheckCircle,
  LocalShipping,
  Movie,
  MusicNote,
  Smartphone,
  Public,
  CalendarMonth,
  Copyright,
  AttachMoney,
  Comment,
  Person,
  ArrowForward,
  MoreVert,
  Download,
} from "@mui/icons-material"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import ShakaPlayer from "../../../components/shakaPlayer/pages/ShakaPlayer"

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#0b192c",
      paper: "#1a1a2e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b7c3",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          backgroundColor: "#1a1a2e",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a2e",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2e45",
        },
      },
    },
  },
})

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

// Status mapping for visual representation
const statusMap = {
  sent_to_shipper: {
    label: "Sent to Shipper",
    color: "#ff9800",
    icon: <LocalShipping sx={{ mr: 1 }} />,
    step: 1,
  },
}

export default function DealDashboard() {
  const { dealId } = useParams()
  const { user } = useSelector((state) => state.auth.user)
  const [tabValue, setTabValue] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  console.log("selectedMovie", selectedMovie)
  const [deal, setDeal] = useState({})
  console.log("deal", deal)
  const [loading, setLoading] = useState(true) // Add loading state
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');

  const handleOpenModal = (movie) => {
    setSelectedMovie(movie)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const getStatusDetails = (status) => {
    return (
      statusMap[status] || {
        label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        color: "#9e9e9e",
        icon: <CheckCircle sx={{ mr: 1 }} />,
        step: 0,
      }
    )
  }

  const defaultStatus = {
    label: "Loading...",
    color: "#888",
    icon: <CircularProgress size={18} sx={{ mr: 1 }} />,
    step: 0,
  }

  const statusDetails = deal?.status
    ? getStatusDetails(deal.status)
    : defaultStatus

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const fetchDealDetails = async () => {
    try {
      const response = await axios.get(`https://www.mediashippers.com/api/deal/${dealId}`)
      console.log("response", response)
      const deal = response.data.deal
      setDeal(deal)
    } catch (error) {
      console.error("Error fetching deal details:", error)
    } finally {
      setLoading(false) // Set loading to false after API call completes
    }
  }

  const handlePlayTrailer = () => {

    const trailerUrl = `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${user.orgName}/${selectedMovie.projectName}/trailer/${selectedMovie.trailerFileName}`;
    setTrailerUrl(trailerUrl);
    setIsTrailerPlaying(true);
  };

  const handleCloseTrailer = () => {
    setIsTrailerPlaying(false);
    setTrailerUrl("");
  };

  useEffect(() => {
    console.log("Fetching deal details...")
    fetchDealDetails()
  }, [dealId])

  if (loading) {
    // Show a loading spinner while data is being fetched
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Deal Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {/* ID: {deal._id.substring(0, 8)}... */}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              icon={statusDetails.icon}
              label={statusDetails.label}
              sx={{
                bgcolor: `${statusDetails.color}20`,
                color: statusDetails.color,
                fontWeight: 600,
                px: 1,
              }}
            />
            <Button variant="contained" color="primary" startIcon={<Download />} sx={{ borderRadius: 2 }}>
              Export
            </Button>
          </Box>
        </Box>

        {/* Deal Progress */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Deal Progress
          </Typography>
          <Stepper activeStep={statusDetails.step} alternativeLabel>
            <Step>
              <StepLabel>Created</StepLabel>
            </Step>
            <Step>
              <StepLabel>Sent to Shipper</StepLabel>
            </Step>
            <Step>
              <StepLabel>Under Review</StepLabel>
            </Step>
            <Step>
              <StepLabel>Approved</StepLabel>
            </Step>
            <Step>
              <StepLabel>Completed</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Deal Details */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Deal Information</Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created Date
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">{formatDate(deal.createdAt)}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Assigned To
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: theme.palette.primary.main }}>
                    <Person sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body1">ID: {deal.assignedTo.substring(0, 8)}...</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Rights
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.rights.map((right, index) => {
                    let icon
                    if (right.includes("Video")) icon = <Movie fontSize="small" />
                    else if (right.includes("Music")) icon = <MusicNote fontSize="small" />
                    else if (right.includes("Mobile")) icon = <Smartphone fontSize="small" />

                    return (
                      <Chip
                        key={index}
                        icon={icon}
                        label={right}
                        size="small"
                        sx={{
                          bgcolor: `${theme.palette.primary.main}15`,
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Territory
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.territory.map((item, index) => (
                    <Chip
                      key={index}
                      icon={<Public fontSize="small" />}
                      label={item}
                      size="small"
                      sx={{
                        bgcolor: `${theme.palette.secondary.main}15`,
                        color: theme.palette.secondary.main,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  License Term
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.licenseTerm.map((term, index) => (
                    <Chip
                      key={index}
                      icon={<CalendarMonth fontSize="small" />}
                      label={term}
                      size="small"
                      sx={{
                        bgcolor: "#4caf5015",
                        color: "#4caf50",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Usage Rights
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.usageRights.map((right, index) => (
                    <Chip
                      key={index}
                      icon={<Copyright fontSize="small" />}
                      label={right}
                      size="small"
                      sx={{
                        bgcolor: "#9c27b015",
                        color: "#9c27b0",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Payment Terms
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.paymentTerms.map((term, index) => (
                    <Chip
                      key={index}
                      icon={<AttachMoney fontSize="small" />}
                      label={term}
                      size="small"
                      sx={{
                        bgcolor: "#ff570015",
                        color: "#ff5700",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Remarks
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    p: 2,
                    bgcolor: "#131b2e",
                    borderRadius: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <Comment sx={{ color: "text.secondary", mr: 1, mt: 0.5, fontSize: 20 }} />
                  <Typography variant="body2">{deal.remarks}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Movies */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="movie tabs">
                  <Tab label="Movies" />
                  <Tab label="History" />
                  <Tab label="Documents" />
                </Tabs>
              </Box>

              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Movies in this Deal ({deal.movieDetails.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {deal.movieDetails.map((movie, index) => (
                      <Grid item xs={12} sm={6} key={movie._id}>
                        <Card
                          sx={{
                            display: "flex",
                            height: "100%",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{ width: 120, objectFit: "cover" }}
                            image={`https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${user.orgName}/${(movie.projectName)}/film stills/${movie.posterFileName}`}
                            alt={movie.projectTitle}
                          />
                          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            <CardContent sx={{ flex: "1 0 auto", pb: 1 }}>
                              <Typography variant="h6" component="div" noWrap>
                                {movie.projectTitle}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  mb: 1,
                                }}
                              >
                                {movie.briefSynopsis}
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Button
                                  size="small"
                                  endIcon={<ArrowForward />}
                                  onClick={() => handleOpenModal(movie)}
                                  sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    p: 0,
                                    minWidth: "auto",
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  View details
                                </Button>
                              </Box>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Deal History
                  </Typography>
                  {deal.historyDetails.length > 0 ? (
                    <>
                      <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: `${theme.palette.primary.main}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                          }}
                        >
                          <AccessTime sx={{ color: theme.palette.primary.main }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Deal created
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(deal.historyDetails[0].timestamp)} by Sender ID:{" "}
                            {deal.historyDetails[0].senderId.substring(0, 8)}...
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: `${statusDetails.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                          }}
                        >
                          {statusDetails.icon}
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Status updated to {statusDetails.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(deal.updatedAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          bgcolor: "#131b2e",
                          borderRadius: 2,
                          border: "1px dashed #2a2e45",
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Additional History Details
                        </Typography>
                        <Typography variant="body2">
                          This deal was created on {formatDate(deal.createdAt)} and last updated on{" "}
                          {formatDate(deal.updatedAt)}. The deal includes {deal.movieDetails.length} movies and has been
                          assigned to ID: {deal.assignedTo.substring(0, 8)}...
                        </Typography>
                      </Paper>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No history records available
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 300,
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    No documents available
                  </Typography>
                  <Button variant="outlined" startIcon={<Download />}>
                    Upload Document
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        {/* Movie Details Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{
            backdrop: Backdrop,
          }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "95%", sm: "90%", md: 1170 },
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: { xs: 2, sm: 4 },
                maxHeight: "80vh",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  display: "none", // Hide the scroll bar
                },
                "-ms-overflow-style": "none", // For Internet Explorer and Edge
                "scrollbar-width": "none", // For Firefox
              }}
            >
              {selectedMovie && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                    <Typography variant="h5" component="h2" fontWeight={700}>
                      {selectedMovie.projectTitle}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      onClick={handleCloseModal}
                      sx={{ borderRadius: 2 }}
                    >
                      Close
                    </Button>
                  </Box>

                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={4} md={3}>
                      <Box sx={{ position: "sticky", top: 20 }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            mb: 2,
                          }}
                          image={`https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${user.orgName}/${(selectedMovie.projectName)}/film stills/${selectedMovie.posterFileName}`}
                          alt={selectedMovie.projectTitle}
                        />

                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "#131b2e",
                            borderRadius: 2,
                            border: "1px solid #2a2e45",
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Quick Actions
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<Movie />}
                            sx={{ mb: 1, borderRadius: 2 }}
                            onClick={() => handlePlayTrailer()}
                          >
                            Watch Trailer
                          </Button>
                          <Button fullWidth variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2 }}>
                            Download Info
                          </Button>
                        </Paper>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={8} md={9}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: "1px solid #2a2e45",
                          mb: 3,
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Project Overview
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                          {selectedMovie.briefSynopsis}
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Project Name
                            </Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                              {selectedMovie.projectName}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                              Project ID
                            </Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                              {selectedMovie._id}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Created Date
                            </Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                              {formatDate(selectedMovie.createdAt)}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                              Last Updated
                            </Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                              {formatDate(selectedMovie.updatedAt)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: "1px solid #2a2e45",
                          mb: 3,
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Media Files
                        </Typography>

                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Poster File
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 1.5,
                                bgcolor: "#131b2e",
                                borderRadius: 1,
                                mb: 2,
                              }}
                            >
                              <img src="/placeholder-akhq1.png" alt="File" style={{ width: 30, marginRight: 10 }} />
                              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                {selectedMovie.posterFileName}
                              </Typography>
                            </Box>

                            <Typography variant="subtitle2" color="text.secondary">
                              Banner File
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 1.5,
                                bgcolor: "#131b2e",
                                borderRadius: 1,
                                mb: 2,
                              }}
                            >
                              <img src="/placeholder-akhq1.png" alt="File" style={{ width: 30, marginRight: 10 }} />
                              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                {selectedMovie.bannerFileName}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Trailer File
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 1.5,
                                bgcolor: "#131b2e",
                                borderRadius: 1,
                                mb: 2,
                              }}
                            >
                              <img
                                src="/placeholder-92508.png"
                                alt="Video File"
                                style={{ width: 30, marginRight: 10 }}
                              />
                              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                {selectedMovie.trailerFileName}
                              </Typography>
                            </Box>

                            <Typography variant="subtitle2" color="text.secondary">
                              Movie File
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 1.5,
                                bgcolor: "#131b2e",
                                borderRadius: 1,
                                mb: 2,
                              }}
                            >
                              <img
                                src="/placeholder-92508.png"
                                alt="Video File"
                                style={{ width: 30, marginRight: 10 }}
                              />
                              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                {selectedMovie.movieFileName || "Not available"}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: "1px solid #2a2e45",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Storage Information
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                          S3 Source Trailer URL
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#131b2e",
                            borderRadius: 1,
                            mb: 2,
                            overflowX: "auto",
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="code"
                            sx={{
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {selectedMovie.s3SourceTrailerUrl}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary">
                          User ID
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#131b2e",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="code"
                            sx={{
                              fontFamily: "monospace",
                            }}
                          >
                            {selectedMovie.userId}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary">
                          Info Documents
                        </Typography>
                        {selectedMovie.infoDocFileName && selectedMovie.infoDocFileName.length > 0 ? (
                          <Box sx={{ mt: 1 }}>
                            {selectedMovie.infoDocFileName.map((doc, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  p: 1.5,
                                  bgcolor: "#131b2e",
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                              >
                                <img src="/document-icon.png" alt="Document" style={{ width: 30, marginRight: 10 }} />
                                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                  {doc}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            No info documents available
                          </Typography>
                        )}
                      </Paper>

                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button variant="outlined" onClick={handleCloseModal} sx={{ borderRadius: 2 }}>
                          Close
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
              {isTrailerPlaying && trailerUrl && (
                console.log("Playing trailer:", trailerUrl),
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                  <div className="relative w-[80%] max-w-5xl">
                    <ShakaPlayer width="100%" height="100%" url={trailerUrl} />
                    <button
                      onClick={handleCloseTrailer}
                      className="absolute top-2 right-2 text-white text-3xl player-close-button"
                      style={{ zIndex: 10 }}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
            </Box>
          </Fade>
        </Modal>

      </Box>
    </ThemeProvider>
  )
}
