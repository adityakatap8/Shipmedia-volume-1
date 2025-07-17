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
  Checkbox,
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
  Close as X,
} from "@mui/icons-material"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import ShakaPlayer from "../../../components/shakaPlayer/pages/ShakaPlayer"
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb" // Import Breadcrumb

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
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState("")
  const [trailerLanguages, setTrailerLanguages] = useState([
    { id: "english", name: "English", url: "" },
    { id: "spanish", name: "Spanish", url: "" },
    { id: "french", name: "French", url: "" },
    { id: "german", name: "German", url: "" },
    { id: "japanese", name: "Japanese", url: "" },
  ])
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState([])
  console.log("selectedMovies", selectedMovies)

  const navigate = useNavigate(); // Initialize useNavigate

  const dealStatuses = [
    'submitted_by_buyer',
    'admin_filtered_content',
    'curated_list_sent_to_buyer',
    'shortlisted_by_buyer',
    'sent_to_seller',
    'deal_verified',
    'in_negotiation_seller',
    'in_negotiation_buyer',
    'rejected_by_buyer',
    'rejected_by_seller',
    'deal_closed',
  ];

  const formatStatusLabel = (status) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

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

  const statusDetails = deal?.status ? getStatusDetails(deal.status) : defaultStatus

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const fetchDealDetails = async () => {
    try {
      const response = await axios.get(`https://media-shippers-backend.vercel.app/api/deal/${dealId}`)
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
    // If we have a selected movie with a trailer URL, populate the language options
    if (selectedMovie && selectedMovie.projectTrailerS3Url) {
      // For demo purposes, we'll use the same URL for all languages
      // In a real implementation, you would have different URLs for each language
      const updatedLanguages = trailerLanguages.map((lang) => ({
        ...lang,
        url: selectedMovie.projectTrailerS3Url,
      }))
      setTrailerLanguages(updatedLanguages)
      setShowLanguageSelection(true)
    }
  }

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId)
  }

  const handlePlaySelectedLanguage = () => {
    if (selectedLanguage) {
      const selectedLang = trailerLanguages.find((lang) => lang.id === selectedLanguage)
      if (selectedLang) {
        setTrailerUrl(selectedLang.url)
        setIsTrailerPlaying(true)
        setShowLanguageSelection(false)
      }
    }
  }

  const handleCloseLanguageSelection = () => {
    setShowLanguageSelection(false)
    setSelectedLanguage("")
  }

  const handleCloseTrailer = () => {
    setIsTrailerPlaying(false)
    setTrailerUrl("")
  }

  const handleCheckboxChange = (movieId, status) => {
    setSelectedMovies((prev) => {
      const existingMovie = prev.find((movie) => movie.movieId === movieId);

      if (status === "rejected") {
        // Remove the movie from the selected list if unchecked
        return prev.filter((movie) => movie.movieId !== movieId);
      } else if (existingMovie) {
        // Update the status if the movie is already selected
        return prev.map((movie) =>
          movie.movieId === movieId ? { ...movie, status } : movie
        );
      } else {
        // Add the movie to the selected list
        return [...prev, { movieId, status }];
      }
    });
  }

  const handleSubmitDeal = async () => {
    try {
      const payload = {
        movies: deal.movieDetails.map((movie) => ({
          movieId: movie._id,
          status: selectedMovies.some((selected) => selected.movieId === movie._id)
            ? "accepted"
            : "rejected",
          remarks: ""
        })),
      };

      console.log("Payload:", payload);

      const response = await axios.patch(
        `https://media-shippers-backend.vercel.app/api/deal/${dealId}/action`,
        payload
      );

      // Redirect to /deals after successful submission
      navigate("/deals");
    } catch (error) {
      console.error("Error submitting deal:", error)
      alert("Failed to submit deal.")
    }
  }

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

  const breadcrumbItems = [
    { label: "Deals", path: "/deals" },
    { label: "Deal Details", path: `/deal-details/${dealId}` },
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          p: { xs: 2, md: 2 },
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

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
        <Paper sx={{ p: 2, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Deal Progress
          </Typography>
          <Stepper activeStep={dealStatuses.indexOf(deal.status)} alternativeLabel>
            {dealStatuses.map((status, index) => {
              const isCompleted = index <= dealStatuses.indexOf(deal.status);
              const stepColor = isCompleted ? "#52a447" :  "gray";

              return (
                <Step key={index}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        color: stepColor,
                        fontWeight: isCompleted ? "bold" : "normal",
                      },
                      "& .MuiStepIcon-root": {
                        color: stepColor,
                      },
                    }}
                  >
                    {formatStatusLabel(status)}
                  </StepLabel>
                </Step>
              );
            })}
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

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created Date
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">{formatDate(deal.createdAt)}</Typography>
                </Box>
              </Box>

              {/* <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Updated Date
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: theme.palette.primary.main }}>
                    <Person sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body1">ID: {deal.assignedTo.substring(0, 8)}...</Typography>
                </Box>
              </Box> */}

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Rights
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  <Chip
                    label={deal?.rights}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Including Regions
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.includingRegions.map((item, index) => (
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

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Excluding Countries
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {deal.excludingCountries.map((item, index) => (
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

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  License Term
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>

                  <Chip
                    icon={<CalendarMonth fontSize="small" />}
                    label={deal.licenseTerm}
                    size="small"
                    sx={{
                      bgcolor: "#4caf5015",
                      color: "#4caf50",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Usage Rights
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>

                  <Chip
                    icon={<Copyright fontSize="small" />}
                    label={deal.usageRights}
                    size="small"
                    sx={{
                      bgcolor: "#9c27b015",
                      color: "#9c27b0",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Payment Terms
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>

                  <Chip
                    icon={<AttachMoney fontSize="small" />}
                    label={deal.paymentTerms}
                    size="small"
                    sx={{
                      bgcolor: "#ff570015",
                      color: "#ff5700",
                      fontWeight: 500,
                    }}
                  />

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
                    {deal.movieDetails.map((movie, index) => {
                      // Find the corresponding movie in the movies array
                      const movieStatus = deal.movies.find((dealMovie) => dealMovie.movieId === movie._id)?.status || "Unknown";

                      return (
                        <Grid item xs={12} sm={6} key={movie._id}>
                          <Card
                            sx={{
                              display: "flex",
                              height: "100%",
                              position: "relative",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            {/* Checkbox for Buyer */}
                            {user?.role === "Buyer" && deal.status === 'curated_list_sent_to_buyer' && (
                              <Checkbox
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  "&.Mui-checked": {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                                checked={selectedMovies.some((selected) => selected.movieId === movie._id && selected.status === "accepted")} // Keep checked for "accepted"
                                disabled={movieStatus === "rejected"} // Disable editing for "rejected"
                                onChange={(e) => {
                                  if (movieStatus === "pending") {
                                    // Allow editing only for "pending" status
                                    handleCheckboxChange(movie._id, e.target.checked ? "accepted" : "rejected");
                                  }
                                }}
                              />)}

                            {(user?.role !== 'Buyer' && <Typography
                              variant="body2"
                              sx={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                color: movieStatus === "accepted"
                                  ? "green"
                                  : movieStatus === "rejected"
                                    ? "red"
                                    : "orange", // Default color for "pending"
                                padding: "4px 8px",
                                marginBottom: 1,
                                fontWeight: "bold", // Optional: Make the text bold for better visibility
                              }}
                            >
                              {/* Add icons for each status */}
                              {movieStatus === "accepted" && <CheckCircle sx={{ fontSize: 16, color: "green" }} />}
                              {movieStatus === "rejected" && <X sx={{ fontSize: 16, color: "red" }} />}
                              {movieStatus === "pending" && <AccessTime sx={{ fontSize: 16, color: "orange" }} />}
                              {movieStatus}
                            </Typography>
                            )}

                            {/* Movie Poster */}
                            <CardMedia
                              component="img"
                              sx={{ width: 120, objectFit: "cover" }}
                              image={movie.projectPosterS3Url}
                              alt={movie.projectTitle}
                            />

                            {/* Movie Details */}
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
                      );
                    })}
                  </Grid>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: "capitalize" }}
                      onClick={handleSubmitDeal}
                      disabled={deal.status === "sent_to_shipper" || selectedMovies.length === 0}
                    >
                      Submit Deal
                    </Button>
                  </Box>
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
                  {/* Cross Icon for Closing Modal */}
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      color: "text.secondary",
                    }}
                  >
                    <X />
                  </IconButton>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                    <Typography variant="h5" component="h2" fontWeight={700}>
                      {selectedMovie.projectTitle}
                    </Typography>
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
                            height: 250,
                          }}
                          image={selectedMovie.projectPosterS3Url}
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
                        </Paper>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={8} md={9}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #2a2e45",
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
                              Created Date
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(selectedMovie.createdAt)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Last Updated
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(selectedMovie.updatedAt)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  )
}
