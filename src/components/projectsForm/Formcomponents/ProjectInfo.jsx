import React, { useEffect, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import './index.css';
import ShakaPlayer from '../../shakaPlayer/pages/ShakaPlayer'; // Import the ShakaPlayer component
import { UserContext } from '../../../contexts/UserContext';
import SrtFileUpload from './SrtFileUpload';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';




const ProjectInfo = ({ onInputChange, projectInfo, errors, setProjectInfoErrors, userId, projectName, movieName }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orgName } = user.user;

  const [trailerUrl, setTrailerUrl] = useState(null);  // To store trailer video URL
  const [movieUrl, setMovieUrl] = useState(null);  // To store movie video URL
  const [stillImages, setStillImages] = useState([]); // To store still images
  const [accessKey, setAccessKey] = useState(''); // To store S3 access key
  const [secretKey, setSecretKey] = useState('');

  const [dubbedTrailerUrl, setDubbedTrailerUrl] = useState(null);

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
        const response = await axios.get(`https://www.mediashippers.com/api/projectInfo/${userId}`, {
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

  // Handle input changes for the URL input field (when URL option is selected)
 const handlePosterUrlChange = (url) => {
  if (url) {
    const fileName = extractFileNameFromUrl(url);
    const s3Url = generateS3Url(fileName, 'poster');

    onInputChange({
      s3SourcePosterUrl: url,
      projectPosterUrl: url,
      projectPosterName: fileName,
      projectPoster: null,
      projectPosterS3Url: s3Url,
      posterS3Url: s3Url
    });

    console.log("Poster via S3 URL:", { url, fileName, s3Url });
  }
};

const handleBannerUrlChange = (url) => {
  if (url) {
    const fileName = extractFileNameFromUrl(url);
    const s3Url = generateS3Url(fileName, 'banner');

    onInputChange({
      s3SourceBannerUrl: url,
      projectBannerUrl: url,
      projectBannerName: fileName,
      projectBanner: null,
      projectBannerS3Url: s3Url,
      bannerUrl: s3Url
    });

    console.log("Banner via S3 URL:", { url, fileName, s3Url });
  }
};

const handleTrailerUrlChange = (url) => {
  if (url) {
    const fileName = extractFileNameFromUrl(url);
    const s3Url = generateS3Url(fileName, 'trailer');

    onInputChange({
      s3SourceTrailerUrl: url,         // Raw URL entered by user
      trailerFileName: fileName,       // Just the filename
      trailerFile: null,               // Clear previous file if any
      projectTrailerS3Url: s3Url,      // ✅ Main field used for saving
      trailerUrl: s3Url                // Still used for ShakaPlayer preview
    });

    setTrailerUrl(url); // Show preview (ShakaPlayer)

    console.log("Trailer via S3 URL:", { url, fileName, s3Url });
  }
};



  // 🔧 1. Generate S3 URL utility
  const generateS3Url = (fileName, folderType = 'poster') => {
    const folder = projectInfo.projectName || projectName || 'unknown_project';
    return `s3://mediashippers-filestash/${orgName}/${folder}/${folderType}/${fileName}`;
  };

  // 🔎 2. Extract file name from provided S3 URL
  const extractFileNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // 📥 3. Handle file drop for poster
  const onDropPoster = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileName = file.name;
      const s3Url = generateS3Url(fileName, 'poster');
      const localPreviewUrl = URL.createObjectURL(file);

      onInputChange({
        projectPoster: file,
        projectPosterName: fileName,
        projectPosterUrl: localPreviewUrl, // For image preview
        projectPosterS3Url: s3Url,
        posterS3Url: s3Url,                // Unified S3 URL field
        s3SourcePosterUrl: '',             // Clear URL input if file is selected
      });

      console.log("Poster Upload:", { fileName, s3Url });
    }
  };

  // 🌐 4. Handle S3 URL input manually
  const handleUrlChange = (e) => {
    const url = e.target.value;

    if (url) {
      const fileName = extractFileNameFromUrl(url);
      const s3Url = generateS3Url(fileName, 'poster');

      onInputChange({
        s3SourcePosterUrl: url,         // Raw user-provided S3 URL
        projectPosterUrl: url,          // For preview
        projectPosterName: fileName,    // Show the name in UI if needed
        projectPoster: null,            // Clear file object if user chose URL
        projectPosterS3Url: s3Url,
        posterS3Url: s3Url              // Unified S3 destination
      });

      console.log("Poster via URL:", { url, fileName, s3Url });
    }
  };



  // On drop banner image
  const onDropBanner = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const bannerFileName = file.name;

      // Use fallback to ensure project name is always present
      const folder = projectInfo.projectName || projectName || 'unknown_project';
      const bannerS3Url = `s3://mediashippers-filestash/${orgName}/${folder}/trailer/${bannerFileName}`;

      const bannerUrl = URL.createObjectURL(file);

      // Save everything at once
      onInputChange({
        projectBanner: file,
        projectBannerName: bannerFileName,
        projectBannerUrl: bannerUrl,         // local preview
        projectBannerS3Url: bannerS3Url,     // S3 URL
        bannerUrl: bannerS3Url               // ✅ for handleSubmit fallback
      });

      console.log(`Banner File Name: ${bannerFileName}`);
      console.log(`Banner S3 URL: ${bannerS3Url}`);
    }
  };


  // On drop trailer file (e.g., video)
  // On drop trailer file (e.g., video)
  const onDropTrailer = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const trailerFileName = file.name;

      // 🐞 Debug: Log values to verify availability
      console.log("Using project name for trailer:", projectInfo.projectName, projectName);

      // Use fallback to ensure project name is always present
      const folder = projectInfo.projectName || projectName || 'unknown_project';
      const trailerS3Url = `s3://mediashippers-filestash/${orgName}/${folder}/trailer/${trailerFileName}`;

      const trailerUrl = URL.createObjectURL(file);

      // Save everything at once
      onInputChange({
        trailerFile: file,
        trailerFileName: trailerFileName,
        trailerUrl: trailerS3Url, // ✅ S3 + fallback for handleSubmit
      });

      setTrailerUrl(trailerUrl); // for preview in ShakaPlayer

      // 📦 Final logs
      console.log(`Trailer File Name: ${trailerFileName}`);
      console.log(`Trailer S3 URL: ${trailerS3Url}`);
    }
  };


const onDropDubbedTrailer = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    const file = acceptedFiles[0];
    const trailerFileName = file.name;

    const folder = projectInfo.projectName || projectName || 'unknown_project';
    const trailerS3Url = `s3://mediashippers-filestash/${orgName}/${folder}/dubbed_trailer/${trailerFileName}`;

    const previewUrl = URL.createObjectURL(file);

    onInputChange({
      dubbedTrailerFile: file,
      dubbedTrailerFileName: trailerFileName,
      dubbedTrailerUrl: trailerS3Url,
    });

    setDubbedTrailerUrl(previewUrl);

    console.log(`Dubbed Trailer File Name: ${trailerFileName}`);
    console.log(`Dubbed Trailer S3 URL: ${trailerS3Url}`);
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

  useEffect(() => {
    console.log(trailerUrl);
  }, [trailerUrl])

  const { getRootProps: getRootPropsPoster, getInputProps: getInputPropsPoster } = useDropzone({
    onDrop: onDropPoster,
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    multiple: false
  });

  const { getRootProps: getRootPropsTrailer, getInputProps: getInputPropsTrailer } = useDropzone({
    onDrop: onDropTrailer,
    accept: {
      'video/*': ['.mp4', '.mov', '.webm', '.ogg', '.mkv']
    }, // Allow video files
    multiple: false
  });

  const {
  getRootProps: getRootPropsDubbedTrailer,
  getInputProps: getInputPropsDubbedTrailer,
} = useDropzone({
  onDrop: onDropDubbedTrailer,
  accept: {
    'video/*': ['.mp4', '.mov', '.webm', '.ogg', '.mkv']
  },
  multiple: false
});


  const { getRootProps: getRootPropsMovie, getInputProps: getInputPropsMovie } = useDropzone({
    onDrop: onDropMovie,
    accept: {
      'video/*': ['.mp4', '.mov', '.webm', '.ogg', '.mkv']
    },
    multiple: false
  });

  const { getRootProps: getRootPropsBanner, getInputProps: getInputPropsBanner } = useDropzone({
    onDrop: onDropBanner,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    },
    multiple: false
  });





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

  console.log("User id from projectInfo", userId)
  console.log("orgname from projectInf", orgName)
useEffect(() => {
  const fetchProjectCount = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token missing");

      const res = await axios.get(
        `https://www.mediashippers.com/api/projectsInfo/userProjects/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const projects = res.data?.projects || [];
      const projectCount = projects.length;

      console.log('📊 Total number of projects created by user:', projectCount);

      // Auto-generate project name
      const autoName = generateProjectName(orgName, projectCount);
      console.log('🆕 Auto-generated project name:', autoName);

      onInputChange({ projectName: autoName });

    } catch (err) {
      console.error('❌ Error fetching project count:', err);
      setProjectInfoErrors(prev => ({
        ...prev,
        projectName: 'Failed to generate project name',
      }));
    }
  };

  if (userId && orgName) {
    fetchProjectCount();
  }
}, [userId, orgName]);





  const generateProjectName = (orgName, projectCount) => {
    const prefix = orgName?.slice(0, 4).toUpperCase().padEnd(4, 'X'); // fallback for shorter names
    const count = String(projectCount + 1).padStart(5, '0'); // always 5 digits
    return `${prefix}-${count}`;
  };




  useEffect(() => {
    if (projectInfo.projectTitle) {
      const projectFolder = projectInfo.projectTitle.replace(/\s+/g, '+'); // Replace spaces with '+'

      // Create base URL for film stills
      let posterUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/film+stills/`;
      let bannerUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/film+stills/`;

      // Create base URL for trailers and movies
      let trailerUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/trailers/`;
      let movieUrl = `s3://mediashippers-filestash/${orgName}/${projectFolder}/movies/`;

      // Append the poster URL if it exists 
      if (projectInfo.projectPoster) {
        posterUrl += projectInfo.projectPoster.name;
        console.log('Project Poster URL:', posterUrl);  // Log poster URL
      }

      // Check and append the banner URL if it exists
      if (projectInfo.projectBanner) {
        console.log('projectInfo.projectBanner:', projectInfo.projectBanner); // Log the banner data
        bannerUrl += projectInfo.projectBanner.name;  // Ensure you are accessing the correct property here
        console.log('Project Banner URL:', bannerUrl);  // Log banner URL
      }

      // Append the trailer URL if it exists
      if (projectInfo.projectTrailer) {
        trailerUrl += projectInfo.projectTrailer.name;  // Assuming projectTrailer is an object
        console.log('Project Trailer URL:', trailerUrl);  // Log trailer URL
      }

      // Append the movie URL if it exists
      if (projectInfo.projectMovie) {
        movieUrl += projectInfo.projectMovie.name;  // Assuming projectMovie is an object
        console.log('Project Movie URL:', movieUrl);  // Log movie URL
      }
    }
  }, [projectInfo.projectTitle, projectInfo.projectPoster, projectInfo.projectBanner, projectInfo.projectTrailer, projectInfo.projectMovie]);




  return (
    <div className="section-One text-left">
      <h1 className="header-numbered">
        <span>1</span> Title Information
      </h1>



      {/* Project Title */}
      <div className="form-section" >
        <div className="form-label grid-3 span-12-phone">
          Title <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              name="projectTitle"
              value={projectInfo.projectTitle || ''}
              onChange={handleChange}
              placeholder="Enter title"
            />
            {errors.projectTitle && (
              <span className="error-text">{errors.projectTitle}</span>
            )}
          </div>
        </div>
      </div>


      {/* Project Name */}
      {/* Project Name */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          S3 Bucket Name <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
           <input
  type="text"
  name="projectName"
  value={projectInfo.projectName || ''}
  onChange={handleChange}
  placeholder="Auto-generated project name"
/>
            {errors.projectName && (
              <span className="error-text">{errors.projectName}</span>
            )}
          </div>
        </div>
      </div>



      {/* Brief Synopsis */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Brief Synopsis <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <textarea
              name="briefSynopsis"
              value={projectInfo.briefSynopsis || ''}
              onChange={handleChange}
              placeholder="Enter a brief synopsis of your movie"
              rows={4}
              style={{ color: 'black' }}
            />
            {errors.briefSynopsis && (
              <span className="error-text">{errors.briefSynopsis}</span>
            )}
          </div>
        </div>
      </div>




      {/* Project Poster */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Poster <span className="required">*</span>
        </div>

        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">

            {/* Radio Buttons */}
            <div className="upload-or-url-option d-flex text-white">
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

            {/* Upload Poster Dropzone */}
            {projectInfo.posterOption === 'upload' && !projectInfo.projectPosterUrl && (
              <div
                className="dropzone"
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

            {/* S3 URL Input */}
            {projectInfo.posterOption === 'url' && (
              <div className="input optional form-field-input">
                <input
                  type="text"
                  name="s3SourcePosterUrl"
                  value={projectInfo.s3SourcePosterUrl || ''}
                  onChange={handlePosterUrlChange} // Use the actual URL handler
                  placeholder="Enter S3 Source URL for Poster"
                />
                {errors.s3SourcePosterUrl && (
                  <div className="error">{errors.s3SourcePosterUrl}</div>
                )}

                {projectInfo.s3SourcePosterUrl && (
                  <button
                    type="button"
                    onClick={() => handleClearField('s3SourcePosterUrl')}
                    className="btn btn-primary mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Poster Preview (applies to both URL or uploaded) */}
            {projectInfo.projectPosterUrl && (
              <div>
                <img
                  src={projectInfo.projectPosterUrl}
                  alt="Poster"
                  style={{ maxWidth: '188px', maxHeight: '266px' }}
                />
                <button
                  onClick={resetProjectPoster}
                  className="changeFile-button"
                >
                  Change Poster
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
                  onChange={handleBannerUrlChange}
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
  onChange={(e) => handleTrailerUrlChange(e.target.value)}
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
          Screener/Sample File Name <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone text-left">
          <div className="input optional form-field-input">

            <div className="upload-or-url-option d-flex text-white">


            </div>



            <div className="input optional form-field-input">
              <input
                type="text"
                name="movieFileName"
                value={projectInfo.movieFileName || ''}
                onChange={handleChange}
                placeholder="Enter Movie File Name"
              />
              {errors.movieFileName && <div className="error">{errors.movieFileName}</div>}
            </div>


            {projectInfo.movieFileName && (
              <div>
                <p>Uploaded Movie File Name: {projectInfo.movieFileName}</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Public or Private Selection */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Project Visibility <span className="required">*</span>
        </div>

        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <div className="visibility-toggle inline-radio-group">
              <label htmlFor="public">
                <input
                  type="radio"
                  id="public"
                  name="isPublic"
                  value="public"
                  checked={projectInfo.isPublic === 'public'}
                  onChange={() => onInputChange({ isPublic: 'public' })}
                />
                Public
              </label>

              <label htmlFor="private" className="ml-4">
                <input
                  type="radio"
                  id="private"
                  name="isPublic"
                  value="private"
                  checked={projectInfo.isPublic === 'private'}
                  onChange={() => onInputChange({ isPublic: 'private' })}
                />
                Private
              </label>
            </div>
          </div>

          {errors.isPublic && (
            <span className="error-text">{errors.isPublic}</span>
          )}
        </div>
      </div>



    </div>

  );
};

export default ProjectInfo;
