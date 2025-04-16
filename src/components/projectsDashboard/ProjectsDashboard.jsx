// src/components/ProjectsDashboard.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import movie from '../../assets/clapper-board.png';
import videoEditing from '../../assets/video-editing.png';
import { UserContext } from '../../contexts/UserContext';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setProjectName, setMovieName } from '../../redux/projectInfoSlice/projectInfoSlice';  // Import actions
import { useProjectInfo } from '../../contexts/projectInfoContext';  // Import the custom hook
import ClipLoader from 'react-spinners/ClipLoader';  // Importing the spinner
import Cookies from "js-cookie";
import Loader from '../loader/Loader';
import Toast from '../toast/Toast';

function ProjectsDashboard() {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectNameState] = useState('');  // Changed to store the project name
  const [movieName, setMovieNameState] = useState('');  // Local state for movie name
  const [isCreating, setIsCreating] = useState(false);  // Track the creating state
  const [isSuccess, setIsSuccess] = useState(false);  // Track the success state
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info');

  const dispatch = useDispatch(); // Initialize dispatch

  // Access user data from UserContext
  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    console.log('User data:', userData); // Check if userData is available in production
    if (userData && userData.name) {
      const name = userData.name;
      setWelcomeMessage(`Welcome, ${name}!`);
      setShowWelcome(true);
    }
  }, [userData]);
  
  useEffect(() => {
    console.log('Toast visibility:', showWelcome); // Check the toast visibility in production
  }, [showWelcome]);

  // Get token and projectFolder from Redux store
  const token = useSelector((state) => state.auth.token);

  // Access projectName and movieName from the context
  const { setProjectName, setMovieName } = useProjectInfo();


  console.log("some data")


  // Fetch existing projects from the server
  useEffect(() => {
    console.log("Component mounted or updated");

    // Get the token and userData from cookies
    const token = Cookies.get("token");
    const userDataCookie = Cookies.get("userData");

    if (token && userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie);
        console.log("Token from cookies:", token);
        console.log("User data from cookies:", userData);

        // Check if userData contains userId
        if (userData.userId) {
          console.log("Making API call with token...");

          axios
            .get(`https://www.mediashippers.com/api/projects/${userData.userId}`, {
              credentials: 'include', // Ensure cookies are sent with the request
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setProjectData(response.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching projects:", err);
              setLoading(false);
            });
        } else {
          console.log("User data does not contain userId");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing userData from cookies:", error);
        setLoading(false);
      }
    } else {
      console.log("No token or user data found in cookies");
      setLoading(false);
    }
  }, []);

  // Function to fetch project data
  const fetchProjectData = () => {
    console.log("Fetching data...");

    // Get user data from cookies
    const storedUserData = Cookies.get("userData");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

    console.log("User Data:", parsedUserData);

    if (parsedUserData && parsedUserData.userId) {
      setLoading(true);

      // Make request with cookies included
      axios
        .get(`https://www.mediashippers.com/api/projects/${parsedUserData.userId}`, {
          withCredentials: true, // this ensures the browser sends cookies
        })
        .then((response) => {
          setProjectData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
          setLoading(false);
        });
    } else {
      console.error("User data not found in cookies.");
      setLoading(false);
    }
  };


  // Call the function inside useEffect
  useEffect(() => {
    fetchProjectData();
  }, [userData]);


  const handleCreateProject = () => {
    if (orgName && projectData.length >= 0 && projectName) {
      setProjectName(projectName);
      setMovieName(movieName);

      setIsCreating(true); // Start the loading state
      setShowModal(false); // Close the modal

      // Step 1: Create the project folder in S3
      axios
        .post(
          `https://www.mediashippers.com/api/folders/create-project-folder`,
          {
            orgName: orgName,
            projectName: projectName,
          },
          {
            withCredentials: true, // 🔐 Send cookies
          }
        )
        .then((response) => {
          console.log('Project folder created successfully:', response.data);

          const subFolders = [
            'trailer',
            'film stills',
            'cast and crew details',
            'srt files',
            'info docs',
            'master',
          ];

          // Step 2: Create subfolders
          axios
            .post(
              `https://www.mediashippers.com/api/folders/create-subfolders`,
              {
                orgName: orgName,
                projectName: projectName,
                subFolders: subFolders,
              },
              {
                withCredentials: true,
              }
            )
            .then((subfolderResponse) => {
              console.log('Subfolders created successfully:', subfolderResponse.data);

              // Step 3: Create project info in DB
              axios
                .post(
                  `https://www.mediashippers.com/api/projectsInfo/createProjectInfo`,
                  {
                    projectName: projectName,
                    projectTitle: movieName,
                    userId: userData.userId,
                  },
                  {
                    withCredentials: true,
                  }
                )
                .then((projectResponse) => {
                  console.log('Project saved successfully:', projectResponse.data);
                  setIsSuccess(true);
                  setToastMessage('Project created successfully!');
                  setToastSeverity('success');
                  setToastOpen(true);
                  setTimeout(() => {
                    navigate(`/projects-form`);
                  }, 2000);
                })
                .catch((error) => {
                  console.error('Error saving project info:', error);
                  setToastMessage('Failed to save project info.');
                  setToastSeverity('error');
                  setToastOpen(true);
                  setIsCreating(false);
                });
            })
            .catch((subfolderError) => {
              console.error('Error creating subfolders:', subfolderError);
              setToastMessage('Failed to create subfolders');
              setToastSeverity('error');
              setToastOpen(true);
              setIsCreating(false);
            });
        })
        .catch((error) => {
          console.error('Error creating folder:', error);
          setToastMessage('Failed to create folder for the project.');
          setToastSeverity('error');
          setToastOpen(true);
          setIsCreating(false);
        });
    } else {
      setToastMessage('Please provide a valid project name.');
      setToastSeverity('warning');
      setToastOpen(true);
    }
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };


  if (loading) return <div><Loader /></div>;

  return (
    <div className="projects-dashboard">
      <div className="add-button">
        <button
          className="add-project-button flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          Add New Project
          <img src={videoEditing} alt="Clapper Board" className="w-12 h-12" />
        </button>
      </div>

      {/* <div className="add-button">
        <button
          className="add-project-button flex items-center gap-2"
          onClick={fetchProjectData}
        >
          Refresh the Page
        </button>
      </div> */}

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add New Project</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="movieName">Movie Name:</label>
                  <input
                    type="text"
                    id="movieName"
                    value={movieName}
                    onChange={(e) => setMovieNameState(e.target.value)}
                    className="form-control"
                    placeholder="Enter movie name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectName">Project Name:</label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectNameState(e.target.value)}
                    className="form-control"
                    placeholder="Enter custom project name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateProject}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="loading-container p-10">
          {/* <ClipLoader color="#EE794E" loading={isCreating} size={70} /> */}
          <Loader />
          <p className='text-white text-xl'>Creating your project... Please wait.</p>
        </div>
      )}

      {isSuccess && (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Project Created Successfully!</h4> <br />
          <p>Your project has been successfully created. Redirecting...</p>
        </div>
      )}

      {projectData.length > 0 ? (
        <div className="projects-list">
          {projectData.map((project) => (
            <div key={project._id} className="project-card">
              {/* <div className="movie-poster">
                <img src={movie} alt="Movie Poster" />
              </div> */}
              <div className="movie-poster">
                <img
                  src={movie}
                  alt="Movie Poster"
                  width="400"  // Set your desired width
                  height="600" // Set your desired height
                />
              </div>

              <div className="project-info">
                <h3>{project.projectTitle}</h3>
                <div className="buttons">
                  <button
                    className="view-button"
                    onClick={() => navigate(`/view-form/${project._id}`)}
                  >
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-projects-message">
          <h1>No projects found for this user. Please create a new project.</h1>
          <br />
          <p>"If you build it, they will come." – Field of Dreams</p>
        </div>
      )}

      <Toast
        message={welcomeMessage}
        severity="success"
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
    </div>


  );
}

export default ProjectsDashboard;
