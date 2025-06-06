import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import movie from '../../assets/clapper-board.png';
import videoEditing from '../../assets/video-editing.png';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext
import axios from 'axios'; // Add this import

function ProjectsDashboard() {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [generatedProjectName, setGeneratedProjectName] = useState('');
  const [movieTitle, setMovieTitle] = useState(''); // Movie title input state
  const navigate = useNavigate();

  // Access user data from UserContext
  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : ''; // Get orgName

  // Fetch existing projects from the server
  useEffect(() => {
    if (userData && userData.userId) {
      console.log('Organization Name from UserContext:', orgName);

      axios
        .get(`https://media-shippers-backend-n73nu7q44.vercel.app/api/projects/${userData.userId}`)
        .then((response) => {
          console.log('Fetched projects successfully:', response.data);
          setProjectData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching projects:', err);
          setLoading(false);
        });
    }
  }, [userData, orgName]);

  // Function to handle creating a new project (Create folder and subfolders)
  const handleCreateProject = async () => {
    // Ensure orgName and movieTitle are provided
    if (orgName && movieTitle) {
      // Generate project name based on orgName and next project number
      const orgPrefix = orgName.slice(0, 4).toUpperCase(); // First 4 letters of orgName
      const nextProjectNumber = projectData.length + 1; // Get next project number
      const newGeneratedProjectName = `${orgPrefix}-${String(nextProjectNumber).padStart(3, '0')}`;
      
      setGeneratedProjectName(newGeneratedProjectName); // Set the generated project name
      console.log('Generated Project Name:', newGeneratedProjectName);
  
      // Retrieve token from localStorage (or context if that's where you store it)
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }
  
      try {
        // Create the main folder in the S3 bucket
        const response = await axios.post(
          `https://media-shippers-backend-n73nu7q44.vercel.app/api/folders/create-folder`, 
          { orgName, projectName: newGeneratedProjectName },
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add the Authorization header
            },
          }
        );
        console.log('Main folder created in S3:', response.data);
  
        // After creating the main folder, create subfolders like 'raw', 'edited', 'final'
        const subfolders = ['raw', 'edited', 'final']; // Subfolders to be created
        for (const subfolder of subfolders) {
          await axios.post(
            `https://media-shippers-backend-n73nu7q44.vercel.app/api/folders/create-folder`,
            { orgName, projectName: `${newGeneratedProjectName}/${subfolder}` },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          console.log(`Subfolder '${subfolder}' created in S3`);
        }
  
        // After folder and subfolders are created, close the modal
        setShowModal(false); // Close the modal
        alert('Project and subfolders created successfully!');
      } catch (err) {
        console.error('Error creating folder in S3:', err);
        alert('Error creating folder in S3. Please try again.');
      }
    } else {
      alert('Organization name is missing or invalid, or movie title is not provided');
    }
  };
  

  // Function to handle the input of the movie title
  const handleMovieTitleChange = (e) => {
    setMovieTitle(e.target.value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="projects-dashboard">
      {/* Always show the Add New Project button */}
      <div className="add-button">
        <button
          className="add-project-button flex items-center gap-2"
          onClick={() => {
            // When clicked, set up a new generated project name and show the modal
            const orgPrefix = orgName.slice(0, 4).toUpperCase(); // First 4 letters of orgName
            const nextProjectNumber = projectData.length + 1; // Get next project number

            const projectName = `${orgPrefix}-${String(nextProjectNumber).padStart(3, '0')}`;
            setGeneratedProjectName(projectName); // Set generated project name for display in modal
            setShowModal(true); // Show the modal
          }} // Show modal when clicked
        >
          Add New Project
          <img src={videoEditing} alt="Clapper Board" className="w-12 h-12" />
        </button>
      </div>

      {/* Modal for adding project name and movie title */}
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
                <div>
                  {/* Display the generated project name */}
                  <h4>Generated Project Name: {generatedProjectName}</h4>

                  {/* Input field for the movie title */}
                  <label htmlFor="movieTitle">Movie Title</label>
                  <input
                    type="text"
                    id="movieTitle"
                    value={movieTitle}
                    onChange={handleMovieTitleChange}
                    className="form-control"
                    placeholder="Enter Movie Title"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateProject}>
                  Create Folder
                </button>
              </div>
            </div>
          </div>
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
                <h3>{project.projectName}</h3> {/* Replaced projectTitle with projectName */}
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
