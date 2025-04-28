import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Play } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { PlayerMenu } from "../components/PlayerMenu";
import placeholder from "../../../assets/placeholder.svg"; // Import the placeholder image
import ShakaPlayer from "./ShakaPlayer"; // Import ShakaPlayer component
import './index.css';
import { UserContext } from "../../../contexts/UserContext";
import zIndex from "@mui/material/styles/zIndex";
import Loader from "../../loader/Loader";
import Cookies from "js-cookie";
import defaultBanner from '../../../assets/Banner-Holder.png'
import defaultPoster from '../../../assets/Logo-Holder.png'


// Function to generate image URL for crew members (directors, writers, actors, producers)
const getCrewImageURL = (firstName, lastName, title) => {
  // Convert names to lowercase, trim spaces, and replace multiple spaces with a single '+'
  const sanitizedFirstName = firstName.trim().toLowerCase().replace(/\s+/g, '+');  // Convert to lowercase and handle spaces
  const sanitizedLastName = lastName.trim().toLowerCase().replace(/\s+/g, '+');    // Same for last name

  // Construct the URL using sanitized first and last names
  return `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${title}/cast+and+crew+details/${sanitizedFirstName}+${sanitizedLastName}.jpg`;
};

const MovieDetails = () => {
  const { projectId } = useParams(); // Extract the projectId from URL
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false); // Manage trailer playback state
  const [trailerUrl, setTrailerUrl] = useState(''); // Store trailer URL
  const [movieUrl, setMovieUrl] = useState(''); // Store movie URL
  const [isMoviePlaying, setIsMoviePlaying] = useState(false); // Manage movie playback state

  const [feedback, setFeedback] = useState({
    comment: "",
    rating: "Yet to Decide",
  });

  const token = Cookies.get("token");
  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';


  // Fetch movie data logic
  const fetchMovieData = async () => {
    if (!projectId) {
      setError("Invalid project ID.");
      setIsLoading(false);
      return;
    }

    console.log("Fetching data for projectId:", projectId); // Log the projectId to confirm

    try {
      const response = await axios.get(
        `http://localhost:3000/api/project-form/data/${projectId}`,
        {
          withCredentials: true, 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      if (response.status === 200) {
        console.log("Fetched data:", response.data); // Log the response data
        setMovieData(response.data); // Store the fetched movie data
      } else {
        setError("Failed to load data.");
      }
    } catch (error) {
      console.error("Error occurred while fetching data:", error); // Log error for debugging
      setError("An error occurred while fetching the data.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load project details. Please try again later.",
      });
    } finally {
      setIsLoading(false); // Stop loading indicator once the data is fetched or error is handled
    }
  };

  useEffect(() => {
    // Call fetchMovieData every time the projectId changes
    fetchMovieData();
  }, [projectId]);

  // Show loading state or error message while waiting for data
  if (isLoading) return <div><Loader /></div>;
  if (error) return <div>{error}</div>; // Show error message if there's an error
  if (!movieData) return <div>No data available.</div>; // If movieData is still null after loading, show message

  // Destructure the movieData into required parts
  const projectInfoData = movieData?.projectInfoData || {};
  const creditsInfoData = movieData?.creditsInfoData || {};
  const specificationsInfoData = movieData?.specificationsInfoData || {};


  // Use the title directly, no need to sanitize it
  // const title = projectInfoData.projectTitle || "default";

  const title = projectInfoData.projectTitle;
  const poster = projectInfoData.posterFileName;
  const banner = projectInfoData.bannerFileName;
  const trailer = projectInfoData.trailerFileName;
  const movie = projectInfoData.movieFileName;
  const project = projectInfoData.projectTitle

  console.log("title", title)



  // Default URLs for logo and background images if not provided
  const backgroundImageURL = banner ? `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${orgName}/${project}/film+stills/${banner} ` : defaultBanner;;
  const logoImageURL = poster
    ? `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${orgName}/${project}/film+stills/${poster}`
    : defaultPoster;

  // Trailer URL construction using the title directly
  const trailerVideoURL = `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${orgName}/${project}/trailer/${trailer}`;
  const movieVideoURL = `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${orgName}/${project}/master/${movie}`;

  // Play Movie handler
  const handlePlayMovie = () => {
    setMovieUrl(movieVideoURL); // Set the movie URL dynamically
    setIsMoviePlaying(true); // Trigger movie to play
    console.log("Playing movie from URL:", movieVideoURL); // Log for debugging
  };

  // Play Trailer handler
  const handlePlayTrailer = () => {
    setTrailerUrl(trailerVideoURL); // Set the trailer URL dynamically
    setIsTrailerPlaying(true); // Trigger trailer to play
    console.log("Playing trailer from URL:", trailerVideoURL); // Log for debugging
  };

  // Close Movie handler
  const handleCloseMovie = () => {
    setIsMoviePlaying(false); // Stop movie playback
    setMovieUrl(''); // Reset movie URL
  };

  // Close Trailer handler
  const handleCloseTrailer = () => {
    setIsTrailerPlaying(false); // Stop trailer playback
    setTrailerUrl(''); // Reset trailer URL
  };

  const handleFeedbackChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    console.log("Feedback submitted for", project._id, feedback);
    // Replace with an API call if needed
  };



  return (
    <div className="min-h-screen bg-black">
      <PlayerMenu />


      {/* Movie Hero Section */}
      <div className="relative h-[70vh] w-full bg-cover bg-center">
        {/* Image tag to load the background banner */}
        <img
          src={backgroundImageURL}
          alt={projectInfoData.projectTitle}
          className="absolute inset-0 object-cover w-full h-[50vh] transition-all duration-700"
          style={{ objectFit: 'cover' }} // Ensure it's in the background
        />

        {/* Dark backdrop with gradient overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div> {/* Gradient effect */}

        {/* Content Section (Logo, Buttons, and Description) */}
        <div className="relative h-[70vh] w-full bg-cover bg-center">
          {/* Image tag to load the background banner */}
          <img
            src={backgroundImageURL}
            alt={projectInfoData.projectTitle}
            className="absolute inset-0 object-cover w-full h-full transition-all duration-700"
            style={{ objectFit: 'cover' }} // Ensure it's in the background
          />

          {/* Dark backdrop with gradient overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div> {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div> {/* Gradient effect */}

          {/* Content Section (Logo, Buttons, and Description) */}
          <div className="absolute bottom-0 left-0 flex items-end pl-5 pt-20"> {/* Position content as flex container */}
            <img
              src={logoImageURL}
              alt={projectInfoData.projectTitle}
              className="w-64 mb-6"
              style={{ height: '250px', objectFit: 'contain' }}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 ml-10 mb-6"> {/* Align buttons inline (side-by-side) */}
              <Button
                size="lg"
                className="btn-play-trailer"
                onClick={handlePlayTrailer}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
              <Button
                size="lg"
                className="btn-play-movie"
                onClick={handlePlayMovie}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Sample
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Show Trailer Video when playing */}
      {isTrailerPlaying && trailerUrl && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <ShakaPlayer width="80%" height="auto" url={trailerUrl} />
            <button
              onClick={handleCloseTrailer}
              className="absolute top-2 right-2 text-white text-3xl player-close-button"
              style={{ zIndex: 10 }}
            >
              X
            </button>
          </div>
        </div>
      )}


      {/* Show Movie Video when playing */}
      {isMoviePlaying && movieUrl && (
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-75 flex justify-center items-center">
          <div className="relative">
            <ShakaPlayer width="80%" height="auto" url={movieUrl} />
            <button onClick={handleCloseMovie} className="text-white text-3xl player-close-button" style={{ zIndex: 1 }}>X</button>
          </div>
        </div>
      )}

      {/* Project Information */}
      <div className="container mx-auto px-4 text-white glass-effect" style={{ background: "black" }}>
        <div
          className="flex items-center p-3 rounded-lg shadow-lg bg-opacity-50 bg-black"
          style={{ borderBottom: "0.5px solid white" }}
        >
          <p className="text-white" style={{ fontSize: "50px", paddingRight: "20px" }}>
            {projectInfoData.projectTitle}
          </p>
          <span
            className="text-md text-gray-300"
            style={{ marginTop: "20px" }}
          >
            ({new Date(specificationsInfoData.completionDate).getFullYear()})
          </span>
        </div>

        {/* Specifications Information */}
        <div className="mt-2">
          <div className="specifications-container">
            <p className="spec-item">{specificationsInfoData.projectType}</p>
            <p className="spec-item">{specificationsInfoData.genres}</p>
            <p className="spec-item">{new Date(specificationsInfoData.completionDate).getFullYear()}</p>
            <p className="spec-item">{specificationsInfoData.language}</p>
          </div>
        </div>
        {/* Brief Synopsis Section */}
<div className="mt-2">
  <div className="brief-synopsis-container">
    <p className="spec-label"><strong>Brief Synopsis:</strong></p>
    <p className="spec-item">{projectInfoData?.briefSynopsis || "N/A"}</p>
  </div>
</div>


        {/* Credits Information */}
        <div className="mt-2 rounded-lg shadow-lg bg-opacity-50 p-6">
          <div className="">
            <p><strong>Directors:</strong></p>
            <div className="flex flex-wrap gap-6 mb-4">
              {creditsInfoData.directors && creditsInfoData.directors.length ? creditsInfoData.directors.map((director, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={director.photo ? director.photo : getCrewImageURL(director.firstName, director.lastName, title)}
                    alt={director.firstName} className="w-20 h-20 rounded-full mb-2 object-cover" />
                  <p>{director.firstName}{director.lastName}</p>
                </div>
              )) : <img src={placeholder} alt="director" className="w-20 h-20 rounded-full mb-2 object-cover" />}

            </div>

            <p><strong>Writers:</strong></p>
            <div className="flex flex-wrap gap-6 mb-4">
              {creditsInfoData.writers && creditsInfoData.writers.length ? creditsInfoData.writers.map((writer, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={writer.photo ? writer.photo : getCrewImageURL(writer.firstName, writer.lastName, title)}
                    alt={writer.firstName} className="w-20 h-20 rounded-full mb-2 object-cover" />
                  <p>{writer.firstName} {writer.lastName}</p>
                </div>
              )) : <img src={placeholder} alt="writer" className="w-20 h-20 rounded-full mb-2 object-cover" />}
            </div>

            <p><strong>Producers:</strong></p>
            <div className="flex flex-wrap gap-6 mb-4">
              {creditsInfoData.producers && creditsInfoData.producers.length ? creditsInfoData.producers.map((producer, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={producer.photo ? producer.photo : getCrewImageURL(producer.firstName, producer.lastName, title)}
                    alt={producer.firstName} className="w-20 h-20 rounded-full mb-2 object-cover" />
                  <p>{producer.firstName} {producer.lastName}</p>
                </div>
              )) : 'Not available'}
            </div>

            <p><strong>Actors:</strong></p>
            <div className="flex flex-wrap gap-6 mb-4">
              {creditsInfoData.actors && creditsInfoData.actors.length ? creditsInfoData.actors.map((actor, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={actor.photo ? actor.photo : getCrewImageURL(actor.firstName, actor.lastName, title)}
                    alt={actor.firstName} className="w-20 h-20 rounded-full mb-2 object-cover" />
                  <p>{actor.firstName} {actor.lastName}</p>
                </div>
              )) : 'No actors available'}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default MovieDetails;
