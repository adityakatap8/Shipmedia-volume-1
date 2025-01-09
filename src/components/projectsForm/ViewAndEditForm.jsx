// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './index.css';

// function ViewAndEditProject() {
//   const { projectId } = useParams(); // Get projectId from URL params
//   const navigate = useNavigate(); // Initialize navigate
//   const [projectForm, setProjectForm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch projectForms data and validate projectId
//   useEffect(() => {
//     const fetchProjectForm = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/projectForms/${projectId}`
//         );
//         if (response.data && response.data.projectInfo === projectId) {
//           setProjectForm(response.data);
//         } else {
//           throw new Error('Project ID not found in projectForms collection');
//         }
//       } catch (err) {
//         console.error('Error validating project ID:', err);
//         setError('Project not found or invalid ID');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectForm();
//   }, [projectId]);

//   // Handle input change to update the form data
//   const handleInputChange = (section, field, value) => {
//     setProjectForm((prevForm) => ({
//       ...prevForm,
//       [section]: {
//         ...prevForm[section],
//         [field]: value,
//       },
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await axios.put(
//         `http://localhost:3000/api/projectForms/${projectForm._id}`,
//         projectForm
//       );

//       if (response.status === 200) {
//         alert('Project updated successfully!');
//         navigate('/'); // Navigate back to the dashboard
//       }
//     } catch (err) {
//       console.error('Error updating project form:', err);
//       alert('Failed to update project form');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!projectForm) {
//     return <div>Project form not found</div>;
//   }

//   return (
//     <div className="view-and-edit-project">
//       <h2>{projectForm.projectInfo}</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Project Info Section */}
//         <div>
//           <h3>Project Info</h3>
//           <label>Project Title:</label>
//           <input
//             type="text"
//             value={projectForm.projectInfo || ''}
//             onChange={(e) =>
//               handleInputChange('projectInfo', 'projectTitle', e.target.value)
//             }
//           />
//         </div>

//         {/* Submitter Info Section */}
//         <div>
//           <h3>Submitter Info</h3>
//           <label>Name:</label>
//           <input
//             type="text"
//             value={projectForm.submitterInfo?.name || ''}
//             onChange={(e) =>
//               handleInputChange('submitterInfo', 'name', e.target.value)
//             }
//           />
//           <label>Email:</label>
//           <input
//             type="email"
//             value={projectForm.submitterInfo?.email || ''}
//             onChange={(e) =>
//               handleInputChange('submitterInfo', 'email', e.target.value)
//             }
//           />
//         </div>

//         {/* Credits Info Section */}
//         <div>
//           <h3>Credits Info</h3>
//           {projectForm.creditsInfo?.map((credit, index) => (
//             <div key={index}>
//               <label>Role:</label>
//               <input
//                 type="text"
//                 value={credit.role}
//                 onChange={(e) =>
//                   handleInputChange(
//                     'creditsInfo',
//                     `role-${index}`,
//                     e.target.value
//                   )
//                 }
//               />
//               <label>Name:</label>
//               <input
//                 type="text"
//                 value={credit.name}
//                 onChange={(e) =>
//                   handleInputChange(
//                     'creditsInfo',
//                     `name-${index}`,
//                     e.target.value
//                   )
//                 }
//               />
//             </div>
//           ))}
//         </div>

//         {/* Screenings Info Section */}
//         <div>
//           <h3>Screenings Info</h3>
//           {projectForm.screeningsInfo?.map((screening, index) => (
//             <div key={index}>
//               <label>Film Festival:</label>
//               <input
//                 type="text"
//                 value={screening.filmFestival}
//                 onChange={(e) =>
//                   handleInputChange(
//                     'screeningsInfo',
//                     `screening-${index}-filmFestival`,
//                     e.target.value
//                   )
//                 }
//               />
//             </div>
//           ))}
//         </div>

//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// }

// export default ViewAndEditProject;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

function ViewAndEditForm() {
  const { projectId } = useParams(); // Get projectId from the URL
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Captured Project ID:", projectId); // Debugging line to check the captured projectId

    if (!projectId) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      try {
        // Fetch the project form details using the projectId
        const response = await axios.get(`http://localhost:3000/api/project-form/${projectId}`);
        setProjectData(response.data);
      } catch (err) {
        console.error("Error fetching project data:", err.message);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-and-edit-project">
      <h2>{projectData?.projectInfo.projectTitle || 'Project Details'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields here */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ViewAndEditForm;




