import { useState, useEffect } from "react"
import { Menu, MenuItem } from "@mui/material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  alpha,
} from "@mui/material"
import Box from '@mui/material/Box';
import { Add, Search, Movie, BarChart, Bolt, Star, Close, AccessTime } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../loader/Loader";


function ProjectDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [movieName, setMovieName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false);
  // Sample projects data
  const [projects, setProjects] = useState([])
  console.log("projects",projects)

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("filtered", filteredProjects)

  // Handle creating a new project
  const handleCreateProject = () => {
    if (movieName && projectName) {
      const newProject = {
        id: Date.now(), // Using timestamp as temporary ID
        name: projectName,
        icon: <Movie />,
        status: "active",
        lastUpdated: "just now",
        starred: false,
        category: "film",
        color: "#FF5722",
      }

      setProjects([newProject, ...projects]);
      setOpenModal(false);
      setMovieName("");
      setProjectName("");
      setShowNotification(true);
    }
  }

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50"
      case "pending":
        return "#ff9800"
      default:
        return "#2196f3"
    }
  }

  // Helper function to format date as relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };

    const [anchorEl, setAnchorEl] = useState(null);
const handleClick = (event) => setAnchorEl(event.currentTarget);
const handleClose = () => setAnchorEl(null);

const handleNavigate = (path) => {
  navigate(path);
  handleClose();
};


  useEffect(() => {
      const fetchProjects = async () => {
        try {
          setLoading(true); // Show loader
          const token = Cookies.get("token");
          const response = await axios.get(
            `https://www.mediashippers.com/api/projectsInfo/userProjects/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          console.log("Project API response:", response.data);

          const projects = response.data.projects || [];
          const transformedProjects = projects.map((project) => ({
            id: project._id,
            name: project.projectName || project.projectTitle,
            icon: <Movie />,
            status: "active",
            lastUpdated: formatRelativeTime(project.updatedAt),
            starred: false,
            category: "film",
            color: getRandomColor(),
            originalData: project,
          }));

          console.log("Transformed projects:", transformedProjects);
          setProjects(transformedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error.response?.data || error.message);
        } finally {
          setLoading(false); // Hide loader
        }
      };

      fetchProjects();
  }, [user._id]);
  

  // Helper function to generate random colors
  const getRandomColor = () => {
    const colors = [
      "#E91E63",
      "#9C27B0",
      "#00BCD4",
      "#4CAF50",
      "#FF5722",
      "#2196F3",
      "#FFC107",
      "#795548"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return <Loader />;
  }



  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(to bottom, #0a192f, #0d2240)",
        position: "relative",
        overflow: "hidden",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Animated background elements */}
      <Box className="background-elements">
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 70%)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 20}s infinite ease-in-out`,
              zIndex: 0,
            }}
          />
        ))}
      </Box>

      {/* Notification */}
      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#4caf50",
            color: "white",
            display: "flex",
            alignItems: "center",
            borderRadius: 1,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }}
        message="New project created successfully!"
        action={
          <IconButton size="small" color="inherit" onClick={() => setShowNotification(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />

      {/* Create Project Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "white",
            color: "black",
          },
        }}
        TransitionProps={{
          sx: {
            "& .MuiDialog-paper": {
              transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
              transform: "scale(0.9)",
              opacity: 0,
            },
            "&.MuiDialog-root.MuiModal-root": {
              "& .MuiDialog-paper": {
                transform: "scale(1)",
                opacity: 1,
              },
            },
          },
        }}
      >
        <DialogTitle sx={{ padding: "1.5rem 2rem 1rem", color: "#1a202c" }}>Add New Project</DialogTitle>

        <DialogContent sx={{ padding: "0 2rem" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <TextField
              fullWidth
              label="Movie Name"
              placeholder="Enter movie name"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: {
                  backgroundColor: "#edf2f7",
                  color: "#4a5568",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "#1a202c",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  transform: "translate(0, -1.5rem) scale(0.75)",
                  position: "relative",
                  top: "4px",
                },
              }}
            />

            <TextField
              fullWidth
              label="Project Name"
              placeholder="Enter custom project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: {
                  backgroundColor: "#edf2f7",
                  color: "#4a5568",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "#1a202c",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  transform: "translate(0, -1.5rem) scale(0.75)",
                  position: "relative",
                  top: "4px",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem 2rem",
            borderTop: "1px solid #e2e8f0",
            gap: "0.75rem",
          }}
        >
          <Button
            onClick={() => setOpenModal(false)}
            sx={{
              backgroundColor: "#718096",
              color: "white",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem",
              "&:hover": {
                backgroundColor: alpha("#718096", 0.9),
              },
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleCreateProject}
            sx={{
              background: "linear-gradient(135deg, #0070f3 0%, #00a2ff 100%)",
              color: "white",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem",
              boxShadow: "0 4px 6px rgba(0, 112, 243, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 8px rgba(0, 112, 243, 0.3)",
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header with Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
          opacity: 0,
          transform: "translateY(-20px)",
          animation: "fadeInDown 0.5s ease forwards",
          "@keyframes fadeInDown": {
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <TextField
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          type="search"
          fullWidth
          size="small"
          sx={{
            maxWidth: "500px",
            mr: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(30, 42, 69, 0.8)",
              backdropFilter: "blur(10px)",
              color: "white",
              borderRadius: "0.75rem",
              "& fieldset": {
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&.Mui-focused fieldset": {
                borderColor: alpha("#0070f3", 0.5),
                borderWidth: 1,
                boxShadow: `0 0 0 3px ${alpha("#0070f3", 0.25)}`,
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
        />

     <Button
  variant="contained"
  startIcon={<Add />}
  onClick={handleClick} // ✅ This opens the dropdown menu
  size="small"
  sx={{
    background: "linear-gradient(135deg, #0070f3 0%, #00a2ff 100%)",
    boxShadow: "0 4px 14px rgba(0, 112, 243, 0.4), 0 0 0 1px rgba(0, 112, 243, 0.1)",
    fontSize: "1rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
    textTransform: "none",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 6px 20px rgba(0, 112, 243, 0.5), 0 0 0 1px rgba(0, 112, 243, 0.1)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  }}
>
  Add New Project
</Button>


        <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "left",
  }}
>
  <MenuItem onClick={() => handleNavigate("/projects-form")}>
    Single Project Upload
  </MenuItem>
  <MenuItem onClick={() => handleNavigate("/bulkupload-form")}>
    Bulk Upload Projects
  </MenuItem>
</Menu>

      </Box>

      {/* Projects Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          marginTop: 4,
          padding: 2,
          opacity: 1,
          transform: "translateY(0)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "8px",
                  backgroundColor: "rgba(30, 58, 96, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    padding: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Project icon */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      background: `linear-gradient(135deg, ${project.color} 0%, ${alpha(project.color, 0.6)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 2,
                    }}
                  >
                    {project.icon}
                  </Box>

                  {/* Project name */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {project.name}
                  </Typography>

                  {/* Last updated */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#a0aec0",
                      marginBottom: 2,
                    }}
                  >
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                      Updated {project.lastUpdated}
                    </Typography>
                  </Box>

                  {/* View button */}
                  <Button
                    variant="contained"
                    sx={{
                      background: `linear-gradient(135deg, ${project.color} 0%, ${alpha(project.color, 0.8)} 100%)`,
                      color: "white",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      marginTop: "auto",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => navigate(`/view-form/${project.id}`)}
                  >
                    Edit Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                padding: 4,
                color: "#a0aec0",
              }}
            >
              <Search sx={{ fontSize: 48, opacity: 0.5, marginBottom: 2 }} />
              <Typography variant="h5" sx={{ color: "white", marginBottom: 1 }}>
                No projects found
              </Typography>
              <Typography>Try adjusting your search criteria</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default ProjectDashboard

