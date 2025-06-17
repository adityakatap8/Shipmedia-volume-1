import React, { useEffect, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import ShakaPlayer from '../../shakaPlayer/pages/ShakaPlayer'; // Import the ShakaPlayer component
import { UserContext } from '../../../contexts/UserContext';
import SrtFileUpload from './SrtFileUpload';



const ProjectInfo = ({ onInputChange, projectInfo, errors, setProjectInfoErrors, userId, projectName, movieName }) => {
  const [trailerUrl, setTrailerUrl] = useState(null);  // To store trailer video URL
  const [movieUrl, setMovieUrl] = useState(null);  // To store movie video URL
  const [stillImages, setStillImages] = useState([]); // To store still images
  const [accessKey, setAccessKey] = useState(''); // To store S3 access key
  const [secretKey, setSecretKey] = useState('');




  const [trailerUploadUrl, setTrailerUploadUrl] = useState(''); 

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



  useEffect(() => {
    console.log('User ID received in ProjectInfo:', userId);
  }, [userId]);



  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };

  const handleClearField = (field) => {
    onInputChange({ [field]: '' });
  };


  const handleAccessKeyChange = (e) => {
    setAccessKey(e.target.value);  // Update accessKey state
  };

  const handleSecretKeyChange = (e) => {
    setSecretKey(e.target.value);  // Update secretKey state
  };


  const fetchProjectData = async () => {
    const userId = userData?.userId;
    if (userId && projectName) {
      try {
        const response = await axios.get(`https://media-shippers-backend.vercel.app/api/projectInfo/${userId}`, {
          params: { projectName }
        });
        console.log('Project Data:', response.data);
        if (response.data) {
          onInputChange(response.data);  // Populate project info with the fetched data
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError("Failed to fetch project data. Please try again later.");
      }
    }
  };



  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
    if (!email) {
      return 'Email is required';
    } else if (!emailRegex.test(email)) {
      return 'Invalid email address format.';
    }
    return null;
  };

  const validateWebsite = (url) => {
    const urlRegex = /^(https?:\/\/)?(www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6})?$/;
    if (url && !urlRegex.test(url)) {
      return 'Please enter a valid URL (e.g., www.example.com)';
    }
    return null;
  };

  const validateProjectInfo = () => {
    const errors = {};

    if (!projectInfo.projectTitle) {
      errors.projectTitle = 'Project title is required';
    }
    if (!projectInfo.briefSynopsis) {
      errors.briefSynopsis = 'Brief synopsis is required';
    }

    const emailError = validateEmail(projectInfo.email);
    if (emailError) {
      errors.email = emailError;
    }

    if (projectInfo.website) {
      const websiteError = validateWebsite(projectInfo.website);
      if (websiteError) {
        errors.website = websiteError;
      }
    }

    setProjectInfoErrors(errors);
  };

  useEffect(() => {
    validateProjectInfo();
  }, [projectInfo]);



  // Handle the file drop for the poster image
const onDropPoster = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    const file = acceptedFiles[0]; // Get the first file from accepted files
    const posterFileName = file.name;  // Get the file name

    // Save the poster file object and the file name (if needed)
    onInputChange({
      projectPoster: file, // Store the actual file object
      projectPosterName: posterFileName // Store the file name if needed
    });

    const posterUrl = URL.createObjectURL(file); // Create an object URL for local rendering
    onInputChange({ projectPosterUrl: posterUrl }); // Store the URL for displaying the uploaded poster
  }
};

// Handle input changes for the URL input field (when URL option is selected)
const handlePosterUrlChange = (e) => {
  const { value } = e.target;
  onInputChange({ projectPosterUrl: value }); // Store the URL directly when the user inputs it
};

// On drop banner image
const onDropBanner = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    const file = acceptedFiles[0];

    // Save the banner file object and the file name
    onInputChange({
      bannerFile: file, // Store the actual file object
      bannerFileName: file.name // Store the file name if needed
    });

    // Create object URL for the banner image (for rendering)
    const bannerUrl = URL.createObjectURL(file);

    // Save the URL for rendering
    onInputChange({ projectBannerUrl: bannerUrl });
  }
};

// On drop trailer file (e.g., video)
const onDropTrailer = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    const file = acceptedFiles[0]; // Get the first file from accepted files
    const trailerFileName = file.name;  // Get the file name

    // Set the trailer file object and name in the project info
    onInputChange({
      trailerFile: file, // Store the actual file object
      trailerFileName: trailerFileName // Store the file name if needed
    });

    // Generate the S3 URL dynamically
    const projectFolder = projectInfo.projectTitle.replace(/\s+/g, '_');  // Sanitize project title
    const trailerS3Url = `s3://testmediashippers /${orgName}/${projectFolder}/trailer/${trailerFileName}`;  // S3 URL

    // Log for debugging
    console.log(`Trailer File Name: ${trailerFileName}`);
    console.log(`Trailer S3 URL: ${trailerS3Url}`);

    // Set the S3 trailer URL to the project info
    onInputChange({ trailerUrl: trailerS3Url });

    // Set the local trailer URL for display in ShakaPlayer
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
      const movieS3Url = `s3://testmediashippers /${orgName}/${projectFolder}/master/${file.name}`;  // S3 URL

      console.log(`Movie File Name: ${file.name}`);  // Log the movie file name
      console.log(`Movie S3 URL: ${movieS3Url}`);    // Log the generated S3 URL

      // Now, save the S3 URL to the state
      onInputChange({ movieS3Url: movieS3Url });
    }
  };

  useEffect( () => {
    console.log(trailerUrl);
  },[trailerUrl])

  


 




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


// Handle SRT file change
// Handle SRT file change
// const handleSrtFileChange = (event) => {
//   const file = event.target.files[0];
//   const srtFileName = file ? file.name : ''; // Save the filename

//   console.log('Received SRT file:', srtFileName); // Log the SRT file name to check if it's received

//   setFormData((prevData) => ({
//     ...prevData,
//     projectInfo: {
//       ...prevData.projectInfo,
//       srtFileName, // Save the file name
//     },
//   }));
// };


// Handle Info Document file change
// Handle Info Document file change
// const handleInfoDocChange = (event) => {
//   const file = event.target.files[0];
//   const infoDocFileName = file ? file.name : ''; // Save the filename

//   console.log('Received Info Document file:', infoDocFileName); // Log the Info Document file name to check if it's received

//   setFormData((prevData) => ({
//     ...prevData,
//     projectInfo: {
//       ...prevData.projectInfo,
//       infoDocFileName, // Save the file name
//     },
//   }));
// };



  // Handle the trailer file upload
  const handleTrailerFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Assuming only one file is uploaded
    const fileUrl = URL.createObjectURL(file); // Create a URL for the uploaded file

    // Update the state with the uploaded file and its URL
    onInputChange({ trailerFile: file, trailerUrl: fileUrl });
    setTrailerUrl(fileUrl); // Set the trailer URL locally for the ShakaPlayer
  };



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


  const uploadFileToBucket = async (uploadUrl, fileUrl) => {
    try {
      // Fetch the file from the URL (blob)
      const fileResponse = await fetch(fileUrl);
      const fileBlob = await fileResponse.blob();

      // Create a FormData object to hold the file
      const formData = new FormData();
      formData.append('file', fileBlob);

      // Send the POST request to the S3 bucket URL (using pre-signed URL or direct access if possible)
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file to ${uploadUrl}`);
      }

      console.log(`File uploaded successfully to: ${uploadUrl}`);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };


  useEffect(() => {
    if (projectInfo.projectTitle) {
      const projectFolder = projectInfo.projectTitle.replace(/\s+/g, '+'); // Replace spaces with '+'

      // Create base URL for film stills
      let posterUrl = `s3://testmediashippers /${orgName}/${projectFolder}/film+stills/`;
      let bannerUrl = `s3://testmediashippers /${orgName}/${projectFolder}/film+stills/`;

      // Create base URL for trailers and movies (assuming you want these to be stored separately)
      let trailerUrl = `s3://testmediashippers /${orgName}/${projectFolder}/trailers/`;
      let movieUrl = `s3://testmediashippers /${orgName}/${projectFolder}/movies/`;
 
      // Append the poster URL if it exists
      if (projectInfo.projectPoster) {
        posterUrl += projectInfo.projectPoster.name;

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
    <div className="section-One text-left">
      <h1 className="header-numbered">
        <span>1</span> Project Information
      </h1>



      {/* Project Title */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Project Title <span className="required">*</span></div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              name="projectTitle"
              value={projectInfo.projectTitle || ''}
              onChange={handleChange}
              placeholder="Enter project title"
            />
            {errors.projectTitle && <span className="error-text">{errors.projectTitle}</span>}
          </div>
        </div>
      </div>

      {/* Project Name */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Project Name <span className="required">*</span></div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              name="projectName"
              value={projectName || ''}  // Set the value to projectName prop
              onChange={handleChange}    // Ensure handleChange function properly updates the projectName
              placeholder="Enter project name"
            />
            {errors.projectName && <span className="error-text">{errors.projectName}</span>}
          </div>
        </div>
      </div>



      {/* Project Poster */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Project Poster <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <div className="upload-or-url-option d-flex text-white">
              {/* Option for file upload */}
              <div>
                <input
                  type="radio"
                  id="uploadPoster"
                  name="posterOption"
                  value="upload"
                  checked={projectInfo.posterOption === 'upload'}
                  onChange={() => onInputChange({ posterOption: 'upload' })}  // On change select upload
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
                  onChange={() => onInputChange({ posterOption: 'url' })}  // On change select URL
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
                <input
                  type="text"
                  name="s3SourcePosterUrl"
                  value={projectInfo.s3SourcePosterUrl || ''}
                  onChange={handleChange}  // Update the poster URL when changed
                  placeholder="Enter S3 Source URL for Poster"
                />
                {errors.s3SourcePosterUrl && <div className="error">{errors.s3SourcePosterUrl}</div>}

                {projectInfo.s3SourcePosterUrl && (
                  <button
                    type="button"
                    onClick={() => handleClearField('s3SourcePosterUrl')}  // Function to clear the URL
                    className="btn btn-primary mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Display the uploaded poster if available */}
            {projectInfo.projectPosterUrl && projectInfo.posterOption === 'upload' && (
              <div>
                <img
                  src={projectInfo.projectPosterUrl} // Use the dynamically created URL for display
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
      {/* Project Banner Section */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Project Banner <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            {/* Option for uploading a file or providing S3 URL */}
            <div className="upload-or-url-option d-flex text-white">
              {/* Option for file upload */}
              <div>
                <input
                  type="radio"
                  id="uploadBanner"
                  name="bannerOption"
                  value="upload"
                  checked={projectInfo.bannerOption === 'upload'}
                  onChange={() => onInputChange({ bannerOption: 'upload' })}
                />
                <label htmlFor="uploadBanner">Upload Banner</label>
              </div>

              {/* Option for S3 URL input */}
              <div>
                <input
                  type="radio"
                  id="urlBanner"
                  name="bannerOption"
                  value="url"
                  checked={projectInfo.bannerOption === 'url'}
                  onChange={() => onInputChange({ bannerOption: 'url' })}
                />
                <label htmlFor="urlBanner">Provide S3 URL</label>
              </div>
            </div>

            {/* If user chooses 'Upload Banner' option */}
            {projectInfo.bannerOption === 'upload' && !projectInfo.projectBannerUrl && (
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
                  borderRadius: '20px',
                }}
              >
                <input {...getInputPropsBanner()} />
                <p>Drag & Drop or Click to Upload Banner</p>
              </div>
            )}

            {/* If user chooses 'Provide S3 URL' option */}
            {projectInfo.bannerOption === 'url' && (
              <div className="input optional form-field-input">
                <input
                  type="text"
                  name="s3SourceBannerUrl"  // Unique name for the S3 URL
                  value={projectInfo.s3SourceBannerUrl || ''}
                  onChange={handleChange}
                  placeholder="Enter S3 Source URL for Banner"
                />
                {errors.s3SourceBannerUrl && <div className="error">{errors.s3SourceBannerUrl}</div>}


                {/* Clear button for S3 URL */}
                {projectInfo.s3SourceBannerUrl && (
                  <button
                    type="button"

                    onClick={() => handleClearField('s3SourceBannerUrl')}

                    className="btn btn-primary mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Display the uploaded banner if available */}
            {projectInfo.projectBannerUrl && projectInfo.bannerOption === 'upload' && (
              <div>
                <img
                  src={projectInfo.projectBannerUrl} // Use the stored URL for display
                  alt="Project Banner"
                  style={{ maxWidth: '645px', maxHeight: '365px' }}
                />
                <button onClick={resetProjectBanner} className="changeFile-button">
                  Change File
                </button>
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
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone text-left">
          <div className="input optional form-field-input">
            {/* Option for uploading a file or providing S3 URL */}
            <div className="upload-or-url-option d-flex text-white">
              {/* Option for file upload */}
              <div>
                <input
                  type="radio"
                  id="uploadTrailer"
                  name="trailerOption"
                  value="upload"
                  checked={projectInfo.trailerOption === 'upload'}
                  onChange={() => onInputChange({ trailerOption: 'upload' })}
                />
                <label htmlFor="uploadTrailer">Upload Trailer</label>
              </div>

              {/* Option for S3 URL input */}
              <div>
                <input
                  type="radio"
                  id="urlTrailer"
                  name="trailerOption"
                  value="url"
                  checked={projectInfo.trailerOption === 'url'}
                  onChange={() => onInputChange({ trailerOption: 'url' })}
                />
                <label htmlFor="urlTrailer">Provide S3 URL</label>
              </div>
            </div>

            {/* If user chooses 'Upload Trailer' option */}
            {projectInfo.trailerOption === 'upload' && !projectInfo.trailerFile && (
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
                  borderRadius: '20px',
                }}
              >
                <input {...getInputPropsTrailer()} />
                <p>Drag & Drop or Click to Upload Trailer</p>
              </div>
            )}

            {/* If user chooses 'Provide S3 URL' option */}
            {projectInfo.trailerOption === 'url' && (
              <div className="input optional form-field-input">
                <input
                  type="text"
                  name="s3SourceTrailerUrl"
                  value={projectInfo.s3SourceTrailerUrl || ''}
                  onChange={handleChange}
                  placeholder="Enter S3 Source URL for Trailer"
                />
                {errors.s3SourceTrailerUrl && <div className="error">{errors.s3SourceTrailerUrl}</div>}

                {projectInfo.s3SourceTrailerUrl && (
                  <button
                    type="button"
                    onClick={() => handleClearField('s3SourceTrailerUrl')}
                    className="btn btn-primary mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Display the uploaded trailer if available */}
            {projectInfo.trailerFile && projectInfo.trailerOption === 'upload' && trailerUrl && (
              <div>
                <ShakaPlayer
                  width="100%"
                  height="100%"
                  url={trailerUrl}  // Use the dynamically created trailer URL
                  style={{ width: '100%', height: '100%' }}
                />
                <button onClick={resetTrailerFile} className="changeFile-button">
                  Change File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Movie File Upload */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Movie File <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone text-left">
          <div className="input optional form-field-input">
            {/* Option for uploading a file or providing S3 URL */}
            <div className="upload-or-url-option d-flex text-white">


            </div>


            {/* New field to store the movie file name */}
            <div className="input optional form-field-input">
              <input
                type="text"
                name="movieFileName"  // New field for storing movie file name
                value={projectInfo.movieFileName || ''}
                onChange={handleChange}
                placeholder="Enter Movie File Name"
              />
              {errors.movieFileName && <div className="error">{errors.movieFileName}</div>}
            </div>

            {/* Display the uploaded movie file name if available */}
            {projectInfo.movieFileName && (
              <div>
                <p>Uploaded Movie File Name: {projectInfo.movieFileName}</p>
              </div>
            )}

          </div>
        </div>
      </div>



      {/* Website URL */}
      {/* <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Website <span className="required"></span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.website || ''}
              name="website"
              onChange={handleChange}
              placeholder="Enter Website URL"
              onBlur={validateWebsite}
            />
            {errors?.website && <span className="error">{errors.website}</span>}
          </div>
        </div>
      </div> */}

      {/* Social Media Fields */}
      {/* <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Twitter</div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.twitter || ''}
              name="twitter"
              onChange={handleChange}
              placeholder="Enter Twitter Handle"
            />
          </div>
        </div>
      </div> */}

      {/* <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Facebook</div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.facebook || ''}
              name="facebook"
              onChange={handleChange}
              placeholder="Enter Facebook URL"
            />
          </div>
        </div>
      </div> */}

      {/* <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Instagram</div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.instagram || ''}
              name="instagram"
              onChange={handleChange}
              placeholder="Enter Instagram Handle"
            />
          </div>
        </div>
      </div> */}

 
    </div>

  );
};

export default ProjectInfo;
