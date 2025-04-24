import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { PlayerMenu } from "../components/PlayerMenu.jsx";
import { useToast } from "../components/ui/use-toast.js";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API calls
import './index.css';
import { Button } from "../components/ui/button.jsx"; // Adjust the path accordingly
import Search from "./Search.jsx";
import Categories from "./Categories.jsx";

const Showcase = ({ children }) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projectData, setProjectData] = useState([]); // Store project data fetched from backend
  const [specificationsData, setSpecificationsData] = useState([]); // Store specifications data for each project
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false); // State to handle trailer video play
  const [trailerUrl, setTrailerUrl] = useState(''); // To store the trailer URL
  const [isCarouselPaused, setIsCarouselPaused] = useState(false); // Pause carousel when trailer plays
  const navigate = useNavigate(); // Initialize navigate

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState); // Toggle sidebar visibility
  };

  // Fetch project data from the backend
  useEffect(() => {
    axios
      .get('https://mediashippers.com/api/projects') // Adjusted endpoint
      .then((response) => {
        setProjectData(response.data); // Store project data in state
        console.log("Fetched Project IDs:", response.data.map(project => project._id)); // Log all projectIds to console

        // Fetch specifications data for each project
        fetchSpecificationsForProjects(response.data);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
      });
  }, []);

  // Function to fetch specifications data for each project
  const fetchSpecificationsForProjects = async (projects) => {
    try {
      const specificationsPromises = projects.map((project) => {
        console.log(`Fetching specifications for project ID: ${project._id}`); // Log each project ID being requested
        return axios.get(`/api/project-form/data/${project._id}`);
      });

      const specificationsResponses = await Promise.all(specificationsPromises);
      const specifications = specificationsResponses.map((response) => {
        if (response.status === 200) {
          return {
            projectId: response.data.projectInfoData._id, // Use the correct ID field
            genre: response.data.specificationsInfoData.genres,
            completionDate: response.data.specificationsInfoData.completionDate,
          };
        } else {
          return {
            projectId: null,
            genre: null,
            completionDate: null,
            error: "Failed to fetch specifications data.",
          };
        }
      });

      setSpecificationsData(specifications); // Store specifications data in state
      console.log("Specifications data fetched:", specifications); // Log the fetched specifications data
    } catch (error) {
      console.error("Error fetching specifications data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch specifications data for projects.",
      });
    }
  };

  // HeroCarousel component to render project data dynamically
  const HeroCarousel = ({ items }) => {
    useEffect(() => {
      if (!items || items.length === 0 || isCarouselPaused) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 5000); // Slide every 5 seconds

      return () => clearInterval(timer);
    }, [items.length, isCarouselPaused]);

    const currentItem = items[currentIndex];

    // Find the specifications data for the current item
    const currentSpec = specificationsData.find(spec => spec.projectId === currentItem._id);
    const genre = currentSpec?.genre || "Unknown Genre";
    const completionDate = currentSpec?.completionDate
      ? new Date(currentSpec.completionDate).getFullYear()
      : "Unknown Year"; // Extract year from the completionDate field

    const title = currentItem?.projectTitle || "default";
    
    // Check the image URL
    const backgroundImageURL = currentItem?.backgroundImage || `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${title}/film+stills/banner.jpg`;
    
    // Log the URL for debugging
    console.log('Background Image URL:', backgroundImageURL);

    const logoImageURL = currentItem?.logoImage || `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${title}/film+stills/logo.jpg`;

    const trailerVideoURL = `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${title}/trailer/trailer.mp4`;
    const movieVideoURL = `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${title}/master/master.mp4`;

    const handlePlayTrailer = () => {
      setIsCarouselPaused(true);
      setTrailerUrl(trailerVideoURL);
      setIsTrailerPlaying(true);
    };

    const handlePlayMovie = () => {
      setIsCarouselPaused(true);
      setTrailerUrl(movieVideoURL);
      setIsTrailerPlaying(true);
    };

    const handleCloseTrailer = () => {
      setIsCarouselPaused(false);
      setIsTrailerPlaying(false);
    };

    return (
      <div className="relative h-[80vh] w-full overflow-hidden showcase-main">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${backgroundImageURL})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-stream-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stream-background via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 pt-40 w-1/2 ">
          <img
            src={logoImageURL}
            alt={title}
            className="w-64 mb-6 flex items-start"
            style={{ height: '250px', objectFit: 'contain' }}
          />
          <h3 className="text-white text-3xl font-semibold mb-4 text-left pl-10">
            {title}
          </h3>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 ml-10"
              onClick={handlePlayMovie}
            >
              <Play className="mr-2 h-5 w-5" />
              Explore Movie
            </Button>
          </div>
        </div>

        {isTrailerPlaying && trailerUrl && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center">
            <div className="relative">
              <video width="80%" controls autoPlay>
                <source src={trailerUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={handleCloseTrailer}
                className="absolute top-0 right-0 p-4 text-white text-3xl"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <PlayerMenu />
      {projectData.length > 0 && <HeroCarousel items={projectData} />}
      <div className="flex justify-between mb-8 p-8">
        <div className={`flex flex-col md:w-1/4 transition-all ${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white-800`}>
          <Search />
          <Categories />
        </div>

        <div className={`flex-1 p-4 ml-${isSidebarCollapsed ? '16' : '0'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {projectData.length > 0 && projectData.map((project) => {
              const title = project?.projectTitle || "Untitled Project";
              const logoImageURL = project?.logoImage || `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${title}/film+stills/logo.jpg`;

              return (
                <div
                  key={project._id}
                  className="flex flex-col items-center cursor-pointer showcase-card transition-all duration-300"
                  onClick={() => navigate(`/movie/${project._id}`)}
                >
                  <img
                    src={logoImageURL}
                    alt={title}
                    className=" h-40 object-contain mb-4"
                  />
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
