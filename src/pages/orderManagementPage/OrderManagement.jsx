import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import axios from 'axios';

// Services list
const services = [
  'Dubbing',
  'Subtitling',
  'Closed Captioning',
  'Automated QC',
  'Lip Sync Check',
  'Transcoding/Encoding',
  'Trailers',
  'Shorts/Reels',
  'Artwork Automation',
  'Artwork Localization',
  'Metadata Generation',
  'Content Delivery',
];

// Shuffle function to randomize array order
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

function Main() {
  const [selectedProject, setSelectedProject] = useState(null); // Store selected project
  const [selectedServices, setSelectedServices] = useState(new Set()); // Store selected services
  const [projectData, setProjectData] = useState([]); // Store all projects data
  const [shuffledServices, setShuffledServices] = useState([]); // Store shuffled services
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the form is submitted

  // Fetch project data from the backend
  useEffect(() => {
    axios
      .get(`https://www.mediashippers.com/api/projects`) // Replace with your actual API endpoint
      .then((response) => {
        setProjectData(response.data); // Store the fetched project data in state
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });

    // Shuffle services on load
    setShuffledServices(shuffleArray([...services]));
  }, []);

  // Handle toggle service selection
  const handleToggleServiceSelection = useCallback((service) => {
    setSelectedServices((prevSelectedServices) => {
      const newSelectedServices = new Set(prevSelectedServices);
      if (newSelectedServices.has(service)) {
        newSelectedServices.delete(service);
      } else {
        newSelectedServices.add(service);
      }
      return newSelectedServices;
    });
  }, []);

  // Handle toggle project selection
  const handleToggleProjectSelection = (project) => {
    setSelectedProject((prevSelectedProject) => {
      if (prevSelectedProject && prevSelectedProject._id === project._id) {
        return null; // Deselect the project
      }
      return project; // Select the new project
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Set submission state to true
  };

  // Handle back button click
  const handleBack = () => {
    setIsSubmitted(false); // Go back to the selection page
  };

  // Handle confirm button click
  const handleConfirm = () => {
    // Reset everything back to initial state
    setIsSubmitted(false);
    setSelectedProject(null);
    setSelectedServices(new Set());
  };

  return (
    <div className="mx-auto border-2 rounded-3xl border-customGrey-300 p-10 order-managment-background">
      {!isSubmitted ? (
        <>
          {/* Project Title and Logo Display */}
          {projectData.length > 0 && (
            <div className="mt-10">
              <div className="text-left text-2xl pb-2 mt-2 ml-10 text-white choose-project">
                <h4>Choose Project</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 ml-4 mb-8">
                {projectData.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col items-center cursor-pointer transition-all duration-300 showcase-card"
                    onClick={() => handleToggleProjectSelection(project)}
                  >
                    <img
                      src={`https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${project.projectTitle}/film+stills/logo.jpg`}
                      alt={project?.projectTitle || 'Project Logo'}
                      className={`h-40 object-contain mb-4 ${
                        selectedProject?.projectTitle === project.projectTitle ? 'selected' : ''
                      }`}
                    />
                    <h3 className="text-white text-xl font-semibold mb-2 text-center">
                      {project?.projectTitle || 'Untitled Project'}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-left text-2xl pb-4 mt-2 ml-10 text-white choose-project">
            <h4>Choose Services</h4>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Grid container with 50% width */}
            <div className="grid grid-cols p-2 mt-4 mb-4 w-full">
              <div>
                {shuffledServices.slice(0, 12).map((service) => (
                  <button
                    key={service}
                    className={`w-auto p-3 m-2 text-white border-2 rounded-full transition-all duration-300 ${
                      selectedServices.has(service)
                        ? 'bg-blue-500 border-blue-500 selected-service'
                        : 'border-white bg-transparent hover:bg-blue-500 hover:border-blue-500'
                    }`}
                    type="button"
                    onClick={() => handleToggleServiceSelection(service)} // Toggle service selection
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-full mt-4 transition-all duration-300 hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <div className="mt-10">
          {/* Display Selected Project and Services */}
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl">You have selected:</h2>
            <div className="mt-6">
              {selectedProject ? (
                <>
                  <h3 className="text-xl text-white">{selectedProject.projectTitle}</h3>
                  <img
                    src={`https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${selectedProject.projectTitle}/film+stills/logo.jpg`}
                    alt={selectedProject.projectTitle}
                    className="w-40 h-40 object-contain mx-auto mb-4"
                  />
                </>
              ) : (
                <p className="text-white">No project selected</p>
              )}
            </div>

            <h4 className="text-white text-2xl mt-4">Selected Services:</h4>
            <div className="text-white p-4 rounded-lg mt-4">
              <ul className="text-white text-lg">
                {Array.from(selectedServices).map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleBack}
              className="bg-gray-500 text-white p-3 rounded-full transition-all duration-300 hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="bg-green-500 text-white p-3 rounded-full transition-all duration-300 hover:bg-green-600"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
