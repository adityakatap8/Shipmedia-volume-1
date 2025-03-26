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

function ProjectsDashboard() {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [projectName, setProjectNameState] = useState('');  // Changed to store the project name
  const [movieName, setMovieNameState] = useState('');  // Local state for movie name
  const [isCreating, setIsCreating] = useState(false);  // Track the creating state
  const [isSuccess, setIsSuccess] = useState(false);  // Track the success state
  const navigate = useNavigate();

  const dispatch = useDispatch(); // Initialize dispatch

  // Access user data from UserContext
  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : ''; 

  // Get token and projectFolder from Redux store
  const token = useSelector((state) => state.auth.token);

  // Access projectName and movieName from the context
  const { setProjectName, setMovieName } = useProjectInfo();

  // Fetch existing projects from the server
  useEffect(() => {
    if (userData && userData.userId) {
      axios
        .get(`http://localhost:3000/api/projects/${userData.userId}`)
        .then((response) => {
          setProjectData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching projects:', err);
          setLoading(false);
        });
    }
  }, [userData]);

  const handleCreateProject = () => {
    if (orgName && projectData.length >= 0 && projectName) {
      // Set project name and movie name to the context
      setProjectName(projectName);  // Save projectName to the context
      setMovieName(movieName);       // Save movieName to the context
  
      // Check if token exists
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }
  
      setIsCreating(true);  // Start the loading state
  
      // Close the modal right after the user clicks the button
      setShowModal(false);
  
      // Call the backend to create the project folder in S3
      axios
        .post(
          'http://localhost:3000/api/folders/create-project-folder',
          {
            orgName: orgName,
            projectName: projectName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log('Project folder created successfully:', response.data);
  
          // After successfully creating the project folder, create subfolders inside it
          const subFolders = [
            'trailer',
            'film stills',
            'cast and crew details',
            'srt files',
            'info docs',
            'master',
          ];
  
          // Create subfolders inside the project folder
          axios
            .post(
              'http://localhost:3000/api/folders/create-subfolders',
              {
                orgName: orgName,
                projectName: projectName,
                subFolders: subFolders, 
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((subfolderResponse) => {
              console.log('Subfolders created successfully:', subfolderResponse.data);
  
              // After successfully creating all subfolders, create the project info in the database
              axios
                .post(
                  'http://localhost:3000/api/projectsInfo/createProjectInfo',
                  {
                    projectName: projectName,
                    projectTitle: movieName,
                    userId: userData.userId,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((projectResponse) => {
                  console.log('Project saved successfully:', projectResponse.data);
                  
                  // Show success message and wait before redirecting
                  setIsSuccess(true);  // Show success message
                  setTimeout(() => {
                    navigate(`/projects-form`);
                  }, 2000);  // Delay the redirect by 2 seconds
  
                })
                .catch((error) => {
                  console.error('Error saving project info:', error);
                  alert('Failed to save project info.');
                  setIsCreating(false);
                });
            })
            .catch((subfolderError) => {
              console.error('Error creating subfolders:', subfolderError);
              alert('Failed to create subfolders');
              setIsCreating(false);
            });
        })
        .catch((error) => {
          console.error('Error creating folder:', error);
          alert('Failed to create folder for the project.');
          setIsCreating(false);
        });
    } else {
      alert('Please provide a valid project name.');
    }
  };

  if (loading) return <div>Loading...</div>;

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
          <ClipLoader color="#EE794E" loading={isCreating} size={70} />
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
              <div className="movie-poster">
                <img src={movie} alt="Movie Poster" />
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
    </div>
  );
}

export default ProjectsDashboard;
