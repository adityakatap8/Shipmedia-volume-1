import { useState, useEffect } from "react"
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
          onClick={() => navigate("/projects-form")}
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
                    View Project
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




// // src/components/ProjectsDashboard.js
// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './index.css';
// import movie from '../../assets/clapper-board.png';
// import videoEditing from '../../assets/video-editing.png';
// import { UserContext } from '../../contexts/UserContext';
// import { useSelector, useDispatch } from 'react-redux';
// import axios from 'axios';
// import { setProjectName, setMovieName } from '../../redux/projectInfoSlice/projectInfoSlice';  // Import actions
// import { useProjectInfo } from '../../contexts/projectInfoContext';  // Import the custom hook
// import ClipLoader from 'react-spinners/ClipLoader';  // Importing the spinner
// import Cookies from "js-cookie";
// import Loader from '../loader/Loader';
// import Toast from '../toast/Toast';


// function ProjectsDashboard() {
//   const [projectData, setProjectData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [projectName, setProjectNameState] = useState('');  // Changed to store the project name
//   const [movieName, setMovieNameState] = useState('');  // Local state for movie name
//   const [isCreating, setIsCreating] = useState(false);  // Track the creating state
//   const [isSuccess, setIsSuccess] = useState(false);  // Track the success state
//   const navigate = useNavigate();

//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState('info');

//   const dispatch = useDispatch(); // Initialize dispatch

//   // Access user data from UserContext
//   const { userData } = useContext(UserContext);
//   const orgName = userData ? userData.orgName : '';

//   const [showWelcome, setShowWelcome] = useState(false);
//   const [welcomeMessage, setWelcomeMessage] = useState('');

//    const token = Cookies.get("token");

//   useEffect(() => {
//     if (userData && userData.name) {
//       const { name, role } = userData;
  
//       console.log('User data:', userData); // Existing
//       console.log('User role:', role);     // ✅ NEW: log the role
  
//       setWelcomeMessage(`Welcome, ${name}!`);
//       setShowWelcome(true);
//     }
//   }, [userData]);
  
//   useEffect(() => {
//     console.log('Toast visibility:', showWelcome); // Check the toast visibility in production
//   }, [showWelcome]);



//   // Access projectName and movieName from the context
//   const { setProjectName, setMovieName } = useProjectInfo();



//   // Fetch existing projects from the server
//   useEffect(() => {
//     console.log("Component mounted or updated");
  
//     const token = Cookies.get("token");
//     const userDataCookie = Cookies.get("userData");
  
//     if (token && userDataCookie) {
//       try {
//         const userData = JSON.parse(userDataCookie);
//         console.log("Token from cookies:", token);
//         console.log("User data from cookies:", userData);
  
//         if (userData.userId) {
//           console.log("Making API call with token...");
  
//           axios
//             .get(`https://www.mediashippers.com/api/projects/${userData.userId}`, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//               },
//               withCredentials: true,
//             })
//             .then((res) => {
//               console.log("Project data:", res.data);
//               setProjectData(res.data);  // ✅ Correct usage
//               setLoading(false);
//             })
//             .catch((err) => {
//               console.error("Error fetching projects:", err.response?.data || err.message);
//               setLoading(false);
//             });
  
//         } else {
//           console.log("User data does not contain userId");
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error parsing userData from cookies:", error);
//         setLoading(false);
//       }
//     } else {
//       console.log("No token or user data found in cookies");
//       setLoading(false);
//     }
//   }, []);
  

//   // Function to fetch project data
//   const fetchProjectData = () => {
//     console.log("Fetching data...");

//     // Get user data from cookies
//     const storedUserData = Cookies.get("userData");
//     const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

//     console.log("User Data:", parsedUserData);

//     if (parsedUserData && parsedUserData.userId) {
//       setLoading(true);

//       // Make request with cookies included
//       axios.get(`https://www.mediashippers.com/api/projects/${parsedUserData.userId}`, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${Cookies.get("token")}`,
//         },
//       })
//         .then((response) => {
//           setProjectData(response.data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching projects:", err);
//           setLoading(false);
//         });
//     } else {
//       console.error("User data not found in cookies.");
//       setLoading(false);
//     }
//   };


//   // Call the function inside useEffect
//   useEffect(() => {
//     fetchProjectData();
//   }, [userData]);


//   const handleCreateProject = () => {
//     if (orgName && projectName) {
//       setProjectName(projectName);
//       setMovieName(movieName);
//       setIsCreating(true);
//       setShowModal(false);
  
//       const token = Cookies.get("token");

//       // Step 1: Create the project folder in S3
//       axios
//         .post(
//           `https://www.mediashippers.com/api/folders/create-project-folder`,
//           {
//             orgName: orgName,
//             projectName: projectName,
//           },
//           {
//             withCredentials: true,
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//           }
//         )
//         .then((response) => {
//           console.log('Project folder created successfully:', response.data);
  
//           const subFolders = [
//             'trailer',
//             'film stills',
//             'cast and crew details',
//             'srt files',
//             'info docs',
//             'master',
//           ];
  
//           // Step 2: Create subfolders
//           axios
//             .post(
//               `https://www.mediashippers.com/api/folders/create-subfolders`,
//               {
//                 orgName: orgName,
//                 projectName: projectName,
//                 subFolders: subFolders,
//               },
//               {
//                 withCredentials: true,
//                 headers: {
//                   'Authorization': `Bearer ${token}`,
//                   'Content-Type': 'application/json'
//                 },
//               }
//             )
//             .then((subfolderResponse) => {
//               console.log('Subfolders created successfully:', subfolderResponse.data);
  
//               // Step 3: Create project info in DB
//               axios
//                 .post(
//                   `https://www.mediashippers.com/api/projectsInfo/createProjectInfo`,
//                   {
//                     projectName: projectName,
//                     projectTitle: movieName,
//                     userId: userData.userId,
//                   },
//                   {
//                     withCredentials: true,
//                     headers: {
//                       'Authorization': `Bearer ${token}`,
//                       'Content-Type': 'application/json'
//                     },
//                   }
//                 )
//                 .then((projectResponse) => {
//                   console.log('Project saved successfully:', projectResponse.data);
//                   setIsSuccess(true);
//                   setToastMessage('Project created successfully!');
//                   setToastSeverity('success');
//                   setToastOpen(true);
//                   setTimeout(() => {
//                     navigate(`/projects-form`);
//                   }, 2000);
//                 })
//                 .catch((error) => {
//                   console.error('Error saving project info:', error);
//                   setToastMessage('Failed to save project info.');
//                   setToastSeverity('error');
//                   setToastOpen(true);
//                   setIsCreating(false);
//                 });
//             })
//             .catch((subfolderError) => {
//               console.error('Error creating subfolders:', subfolderError);
//               setToastMessage('Failed to create subfolders');
//               setToastSeverity('error');
//               setToastOpen(true);
//               setIsCreating(false);
//             });
//         })
//         .catch((error) => {
//           console.error('Error creating folder:', error);
//           setToastMessage('Failed to create folder for the project.');
//           setToastSeverity('error');
//           setToastOpen(true);
//           setIsCreating(false);
//         });
//     } else {
//       setToastMessage('Please provide a valid project name.');
//       setToastSeverity('warning');
//       setToastOpen(true);
//     }
//   };

//   const handleCloseToast = () => {
//     setToastOpen(false);
//   };


//   if (loading) return <div><Loader /></div>;

//   return (
//     <div className="projects-dashboard">
//       <div className="add-button">
//         <button
//           className="add-project-button flex items-center gap-2"
//           onClick={() => setShowModal(true)}
//         >
//           Add New Project
//           <img src={videoEditing} alt="Clapper Board" className="w-12 h-12" />
//         </button>
//       </div>

//       {/* <div className="add-button">
//         <button
//           className="add-project-button flex items-center gap-2"
//           onClick={fetchProjectData}
//         >
//           Refresh the Page
//         </button>
//       </div> */}

//       {showModal && (
//         <div className="modal fade show" style={{ display: 'block' }} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="exampleModalLabel">Add New Project</h5>
//                 <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
//                   <span aria-hidden="true">&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <div className="form-group">
//                   <label htmlFor="movieName">Movie Name:</label>
//                   <input
//                     type="text"
//                     id="movieName"
//                     value={movieName}
//                     onChange={(e) => setMovieNameState(e.target.value)}
//                     className="form-control"
//                     placeholder="Enter movie name"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="projectName">Project Name:</label>
//                   <input
//                     type="text"
//                     id="projectName"
//                     value={projectName}
//                     onChange={(e) => setProjectNameState(e.target.value)}
//                     className="form-control"
//                     placeholder="Enter custom project name"
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
//                   Close
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={handleCreateProject}>
//                   Create
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {isCreating && (
//         <div className="loading-container p-10">
//           {/* <ClipLoader color="#EE794E" loading={isCreating} size={70} /> */}
//           <Loader />
//           <p className='text-white text-xl'>Creating your project... Please wait.</p>
//         </div>
//       )}

//       {isSuccess && (
//         <div className="alert alert-success" role="alert">
//           <h4 className="alert-heading">Project Created Successfully!</h4> <br />
//           <p>Your project has been successfully created. Redirecting...</p>
//         </div>
//       )}

//       {projectData.length > 0 ? (
//         <div className="projects-list">
//           {projectData.map((project) => (
//             <div key={project._id} className="project-card">
//               {/* <div className="movie-poster">
//                 <img src={movie} alt="Movie Poster" />
//               </div> */}
//               <div className="movie-poster">
//                 <img
//                   src={movie}
//                   alt="Movie Poster"
//                   width="400"  // Set your desired width
//                   height="600" // Set your desired height
//                 />
//               </div>

//               <div className="project-info">
//                 <h3>{project.projectTitle}</h3>
//                 <div className="buttons">
//                   <button
//                     className="view-button"
//                     
//                   >
//                     View Project
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="no-projects-message">
//           <h1>No projects found for this user. Please create a new project.</h1>
//           <br />
//           <p>"If you build it, they will come." – Field of Dreams</p>
//         </div>
//       )}

//       <Toast
//         message={welcomeMessage}
//         severity="success"
//         open={showWelcome}
//         onClose={() => setShowWelcome(false)}
//       />
//     </div>


//   );
// }

// export default ProjectsDashboard;
