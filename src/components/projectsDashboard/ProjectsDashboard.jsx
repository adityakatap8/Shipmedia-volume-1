// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './index.css';
// import movie from '../../assets/movie.png';

// function ProjectsDashboard() {
//   const [projectData, setProjectData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get('http://localhost:3000/api/projects')
//       .then((response) => {
//         setProjectData(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching projects:', err);
//         setError('Failed to load project data');
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="projects-dashboard">
//       <button
//         className="add-project-button"
//         onClick={() => navigate('/projects-form')}
//       >
//         Add New Project
//       </button>

//       {projectData.length > 0 ? (
//         <div className="projects-list">
//           {projectData.map((project) => (
//             <div key={project._id} className="project-card">
//               <div className="movie-poster">
//                 <img src={movie} alt="Movie Poster" />
//               </div>
//               <div className="project-info">
//                 <h3>{project.projectTitle}</h3>
//                 <div className="buttons">
//                   <button
//                     className="view-button"
//                     onClick={() => navigate(`/view-form/${project._id}`)} // Pass project._id
//                   >
//                     View Project
//                   </button>
//                   <button
//                     className="edit-button"
//                     onClick={() => navigate(`/edit-form/${project._id}`)}
//                   >
//                     Edit Project
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div>No projects found. Please create a new project.</div>
//       )}
//     </div>
//   );
// }

// export default ProjectsDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import movie from '../../assets/movie.png';

function ProjectsDashboard() {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/projects') // Adjusted endpoint
      .then((response) => {
        setProjectData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setError('Failed to load project data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="projects-dashboard">
      <button
        className="add-project-button"
        onClick={() => navigate('/projects-form')}
      >
        Add New Project
      </button>

      {projectData.length > 0 ? (
        <div className="projects-list">
          {projectData.map((project) => (
            <div key={project._id} className="project-card">
              <div className="movie-poster">
                <img src={movie} alt="Movie Poster" />
              </div>
              <div className="project-info">
                <h3>{project.projectTitle}</h3>
                <p>Project ID: {project._id}</p> {/* Display the projectId */}
                <div className="buttons">
                  <button
                    className="view-button"
                    onClick={() => navigate(`/view-form/${project._id}`)} // Pass project._id
                  >
                    View Project
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/edit-form/${project._id}`)}
                  >
                    Edit Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No projects found. Please create a new project.</div>
      )}
    </div>
  );
}

export default ProjectsDashboard;

