import React, { useEffect, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import ShakaPlayer from '../../shakaPlayer/pages/ShakaPlayer'; 

function ProjectMedia({ onInputChange, errors, setProjectInfoErrors, userId, projectName, movieName }) {

      const [trailerUrl, setTrailerUrl] = useState(null);  // To store trailer video URL
      const [movieUrl, setMovieUrl] = useState(null);  // To store movie video URL
      const [stillImages, setStillImages] = useState([]); // To store still images
      const [accessKey, setAccessKey] = useState(''); // To store S3 access key
      const [secretKey, setSecretKey] = useState('');


       // Initialize projectInfo state with default values
  const [projectInfo, setProjectInfo] = useState({
    projectTitle: '',
    projectName: '',
    projectPoster: '',
    projectPosterUrl: '',
    projectBanner: '',
    projectBannerUrl: '',
    trailerFile: '',
    movieFile: '',
    movieUrl: '',
    posterOption: 'upload',
  });

        useEffect(() => {
          console.log("recieved from projectForm:", projectName);
          console.log("recieved from projectForm:", movieName);
        }, [])

         
      
        useEffect(() => {
          // Automatically set projectTitle to movieName when it is received
          if (movieName && !projectInfo.projectTitle) {
            onInputChange({ projectTitle: movieName });
          }
        }, [movieName, onInputChange, projectInfo.projectTitle]);
      
        useEffect(() => {
          // Automatically set projectTitle to movieName when it is received
          if (movieName && !projectInfo.projectName) {
            onInputChange({ projectName: projectName });
          }
        }, [movieName, onInputChange, projectInfo.projectName]);

      // On drop poster image
  const onDropPoster = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onInputChange({ projectPoster: file.name });  // Store only the file name
      const imageUrl = URL.createObjectURL(file);    // Create object URL for the image
      onInputChange({ projectPosterUrl: imageUrl }); // Store the URL for rendering
    }
  };

  // New code for Project Banner
  const onDropBanner = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onInputChange({ projectBanner: file.name });  // Store only the file name
      const bannerUrl = URL.createObjectURL(file);    // Create object URL for the banner image
      onInputChange({ projectBannerUrl: bannerUrl }); // Store the URL for rendering
    }
  };

  // Adjusted code for Project Trailer
  const onDropTrailer = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const trailerFileName = file.name;  // Get the file name

      // Set the trailer file name in the project info
      onInputChange({ trailerFile: trailerFileName });

      // Generate the S3 URL dynamically
      const projectFolder = projectInfo.projectTitle.replace(/\s+/g, '_');  // Sanitize project title
      const trailerS3Url = `s3://mediashippers-filestash/${orgName}/${projectFolder}/trailer/${trailerFileName}`;  // S3 URL

      console.log(`Trailer File Name: ${trailerFileName}`);  // Log the file name
      console.log(`Trailer S3 URL: ${trailerS3Url}`);  // Log the generated S3 URL

      // Set the S3 trailer URL to the project info
      onInputChange({ trailerUrl: trailerS3Url });

      // Set the local trailer URL for display using ShakaPlayer
      setTrailerUrl(URL.createObjectURL(file));  // This creates a URL for displaying in ShakaPlayer
    }
  };

  // Adjusted code for Movie File
  const onDropMovie = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onInputChange({ movieFile: file.name });      // Store only the file name

      // Generate the movie URL (for the ShakaPlayer)
      const movieUrl = URL.createObjectURL(file);   // Create object URL for the movie video
      onInputChange({ movieUrl: movieUrl });         // Store the URL for rendering (ShakaPlayer)

      // Generate the S3 URL for the movie (similar to how we did with trailer)
      const projectFolder = projectInfo.projectTitle.replace(/\s+/g, '_');  // Project folder (sanitized)
      const movieS3Url = `s3://mediashippers-filestash/${orgName}/${projectFolder}/master/${file.name}`;  // S3 URL

      console.log(`Movie File Name: ${file.name}`);  // Log the movie file name
      console.log(`Movie S3 URL: ${movieS3Url}`);    // Log the generated S3 URL

      // Now, save the S3 URL to the state
      onInputChange({ movieS3Url: movieS3Url });
    }
  };




  const { getRootProps: getRootPropsPoster, getInputProps: getInputPropsPoster } = useDropzone({
    onDrop: onDropPoster,
    accept: 'image/*',
    multiple: false
  });

  const { getRootProps: getRootPropsTrailer, getInputProps: getInputPropsTrailer } = useDropzone({
    onDrop: onDropTrailer,
    accept: 'video/*, .mp4, .mov', // Allow video files
    multiple: false
  });

  const { getRootProps: getRootPropsMovie, getInputProps: getInputPropsMovie } = useDropzone({
    onDrop: onDropMovie,
    accept: 'video/*, .mp4, .mov', // Allow video files
    multiple: false
  });



  const { getRootProps: getRootPropsBanner, getInputProps: getInputPropsBanner } = useDropzone({
    onDrop: onDropBanner,
    accept: 'image/*',
    multiple: false
  });






  // Reset functions for cancel button
  const resetProjectPoster = () => {
    onInputChange({ projectPoster: '' });
    onInputChange({ projectPosterUrl: '' });
  };

  const resetTrailerFile = () => {
    onInputChange({ trailerFile: '' });
    setTrailerUrl(null);
  };

  const resetMovieFile = () => {
    onInputChange({ movieFile: '' });
    setMovieUrl(null);
  };

  const resetProjectBanner = () => {
    onInputChange({ projectBanner: '' });
    onInputChange({ projectBannerUrl: '' });
  };



    useEffect(() => {
        if (projectInfo.projectTitle) {
          const projectFolder = projectInfo.projectTitle.replace(/\s+/g, '+'); // Replace spaces with '+'
    
          // Create base URL for film stills
          let posterUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/film+stills/`;
          let bannerUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/film+stills/`;
    
          // Create base URL for trailers and movies (assuming you want these to be stored separately)
          let trailerUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/trailers/`;
          let movieUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/movies/`;
    
          // Append the poster URL if it exists
          if (projectInfo.projectPoster) {
            posterUrl += projectInfo.projectPoster;
            console.log('Project Poster URL:', posterUrl);  // Log poster URL
          }
    
          // Append the banner URL if it exists
          if (projectInfo.projectBanner) {
            bannerUrl += projectInfo.projectBanner;
            console.log('Project Banner URL:', bannerUrl);  // Log banner URL
          }
    
          // Append the trailer URL if it exists
          if (projectInfo.projectTrailer) {
            trailerUrl += projectInfo.projectTrailer;
            console.log('Project Trailer URL:', trailerUrl);  // Log trailer URL
          }
    
          // Append the movie URL if it exists
          if (projectInfo.projectMovie) {
            movieUrl += projectInfo.projectMovie;
            console.log('Project Movie URL:', movieUrl);  // Log movie URL
          }
        }
      }, [projectInfo.projectTitle, projectInfo.projectPoster, projectInfo.projectBanner, projectInfo.projectTrailer, projectInfo.projectMovie]);
    


  return (
    <div>
         {/* Project Poster */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Project Poster <span className="required">*</span></div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            {/* Option for uploading a file or providing S3 URL */}
            <div className="upload-or-url-option d-flex text-white">
              {/* Option for file upload */}
              <div>
                <input
                  type="radio"
                  id="uploadPoster"
                  name="posterOption"
                  value="upload"
                  checked={projectInfo.posterOption === 'upload'}
                  onChange={() => onInputChange({ posterOption: 'upload' })}
                />
                <label htmlFor="uploadPoster">Upload Poster</label>
              </div>

              {/* Option for S3 URL input */}
              <div>
                <input
                  type="radio"
                  id="urlPoster"
                  name="posterOption"
                  value="url"
                  checked={projectInfo.posterOption === 'url'}
                  onChange={() => onInputChange({ posterOption: 'url' })}
                />
                <label htmlFor="urlPoster">Provide S3 URL</label>
              </div>
            </div>

            {/* If user chooses 'Upload Poster' option */}
            {projectInfo.posterOption === 'upload' && !projectInfo.projectPosterUrl && (
              <div
                className="input optional form-field-input dropzone"
                {...getRootPropsPoster()}
                style={{
                  border: '2px dashed #ccc',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '188px',
                  height: '265px',
                  cursor: 'pointer',
                }}
              >
                <input {...getInputPropsPoster()} />
                <p>Drag & Drop or Click to Upload Poster</p>
              </div>
            )}

            {/* If user chooses 'Provide S3 URL' option */}
            {projectInfo.posterOption === 'url' && (
              <div className="input optional form-field-input">

                {/* Input for Access Key and Secret Key when providing S3 URL */}
                <input
                  type="text"
                  name="accessKey"
                  value={accessKey || ''}
                  onChange={handleAccessKeyChange}
                  placeholder="Enter S3 Access Key"
                />

                <input
                  type="password"
                  name="secretKey"
                  value={secretKey || ''}
                  onChange={handleSecretKeyChange}
                  placeholder="Enter S3 Secret Key"
                />
                

                <input
                  type="text"
                  name="projectPosterUrl"
                  value={projectInfo.projectPosterUrl || ''}
                  onChange={handleChange}
                  placeholder="Enter S3 URL for Poster"
                />
              </div>
            )}

            {/* Display the uploaded poster if available */}
            {projectInfo.projectPosterUrl && projectInfo.posterOption === 'upload' && (
              <div>
                <img
                  src={projectInfo.projectPosterUrl} // Use the stored URL for display
                  alt="Project Poster"
                  style={{ maxWidth: '188px', maxHeight: '266px' }}
                />
                <button onClick={resetProjectPoster} className="changeFile-button">Change File</button>
              </div>
            )}
          </div>
        </div>
      </div>


        {/* Project Banner Section */}
        <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Project Banner <span className="required">*</span></div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="form-field span-3 span-8-tablet span-12-phone">
            {projectInfo.projectBannerUrl ? (
              <div>
                <img
                  src={projectInfo.projectBannerUrl} // Use the stored URL for display
                  alt="Project Banner"
                  style={{ maxWidth: '645px', maxHeight: '365px' }}
                />
                <button onClick={resetProjectBanner} className="changeFile-button">Change File</button>
              </div>
            ) : (
              <div
                className="input optional form-field-input dropzone"
                {...getRootPropsBanner()}
                style={{
                  border: '2px dashed #ccc',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '645px',
                  height: '280px',
                  cursor: 'pointer',
                  borderRadius: '20px'
                }}
              >
                <input {...getInputPropsBanner()} />
                <p>Drag & Drop or Click to Upload Banner</p>
              </div>
            )}
          </div>
        </div>
      </div>



        {/* Trailer File Upload */}
        <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Trailer/Video File <span className="required">*</span>
        </div>
        <div className="form-field span-6 span-8-tablet span-12-phone text-left">
          {projectInfo.trailerFile && trailerUrl ? (
            <div>
              <ShakaPlayer
                width="100%"
                height="100%"
                url={trailerUrl}
                style={{ width: '100%', height: '100%' }}
              />
              <button onClick={resetTrailerFile} className="changeFile-button">Change File</button>
            </div>
          ) : (
            <div
              className="input optional form-field-input dropzone"
              {...getRootPropsTrailer()}
              style={{
                border: '2px dashed #ccc',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '645px',
                height: '365px',
                cursor: 'pointer',
                borderRadius: '20px'
              }}
            >
              <input {...getInputPropsTrailer()} />
              <p>Drag & Drop or Click to Upload Trailer</p>
            </div>
          )}

        </div>
      </div>

      {/* Movie File Upload */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Movie File <span className="required">*</span>
        </div>
        <div className="form-field span-6 span-8-tablet span-12-phone text-left">
          {projectInfo.movieFile && movieUrl ? (
            <div>
              <ShakaPlayer
                width="100%"
                height="100%"
                url={movieUrl}
                style={{ width: '100%', height: '100%' }}
              />
              <button onClick={resetMovieFile} className="changeFile-button">Change File</button>
            </div>
          ) : (
            <div
              className="input optional form-field-input dropzone"
              {...getRootPropsMovie()}
              style={{
                border: '2px dashed #ccc',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '645px',
                height: '365px',
                cursor: 'pointer',
                borderRadius: '20px'
              }}
            >
              <input {...getInputPropsMovie()} />
              <p>Drag & Drop or Click to Upload Movie</p>
            </div>
          )}



        </div>
      </div>
    </div>
  )
}

export default ProjectMedia