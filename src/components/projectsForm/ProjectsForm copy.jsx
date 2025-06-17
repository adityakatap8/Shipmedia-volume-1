import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './projectFormCss.css';
import ProjectInfo from './Formcomponents/ProjectInfo.jsx';
import SubmitterInfo from './Formcomponents/SubmitterInfo.jsx';
import CreditsInfo from './Formcomponents/CreditsInfo.jsx';
import SpecificationsInfo from './Formcomponents/SpecificationsInfo.jsx';
import ScreeningsInfo from './Formcomponents/ScreeningsInfo.jsx';
import RightsInfo from './Formcomponents/RightsInfo.jsx';
import { setProjectFolderRequest, setProjectFolderSuccess, setProjectFolderFailure } from '../../redux/projectSlice/projectSlice.js';
import { useProjectInfo } from '../../contexts/projectInfoContext.jsx';
import SrtFileUpload from './Formcomponents/SrtFileUpload.jsx';

function ProjectsForm() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Access user data from UserContext

  const { projectName, movieName } = useProjectInfo();
  const [formData, setFormData] = useState({
    projectInfo: {
      s3SourcePosterUrl: '',
      s3SourceBannerUrl: '',
      s3SourceTrailerUrl: '',
      s3SourceMovieUrl: '',
      srtFileName: '', // Store the SRT file name
      infoDocFileName: [], // Store the Info Document file name
    },
    submitterInfo: {},
    creditsInfo: {},
    specificationsInfo: {},
    screeningsInfo: {
      screenings: [],
      distributors: [],
    },
    rightsInfo: [],
    userId: user?.userId || '',
  });
  const [errors, setErrors] = useState({
    projectInfoErrors: {},
    submitterInfoErrors: {},
    creditsInfoErrors: {},
    specificationsInfoErrors: {},
    screeningsErrors: {},
    rightsInfoErrors: {},
  });
  const [isSubmitterInfoVisible, setIsSubmitterInfoVisible] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';



  //srt file
  // Handle SRT file change
  const handleSrtFileChange = (fileName) => {
    // Store the SRT file name in the state
    setFormData((prevData) => ({
        ...prevData,
        projectInfo: {
            ...prevData.projectInfo,
            srtFileName: fileName,  // Save the file name in the projectInfo object
        },
    }));
};

  // Handle Info Document file change
  const handleInfoDocsChange = (fileNames) => {
    // Store the Info Document file names in the state
    setFormData((prevData) => ({
        ...prevData,
        projectInfo: {
            ...prevData.projectInfo,
            infoDocFileName: fileNames,  // Save the array of file names in projectInfo
        },
    }));
};

  useEffect(() => {
    console.log('User orgName :', orgName);
  }, [orgName]);




  // Handle Banner File Change
  const handleBannerFileChange = (event) => {
    const file = event.target.files[0];
    const bannerUrl = file ? URL.createObjectURL(file) : '';
    setFormData((prevData) => ({
      ...prevData,
      projectInfo: {
        ...prevData.projectInfo,
        s3SourceBannerUrl: bannerUrl,
      },
    }));
  };

  // Handle Poster File Change
  const handlePosterFileChange = (event) => {
    const file = event.target.files[0];
    const posterUrl = file ? URL.createObjectURL(file) : '';
    setFormData((prevData) => ({
      ...prevData,
      projectInfo: {
        ...prevData.projectInfo,
        s3SourcePosterUrl: posterUrl,
      },
    }));
  };

  const handleInputChange = (section, data) => {

    setFormData((prevData) => {
      if (prevData[section] !== data) {
        return {
          ...prevData,
          [section]: { ...prevData[section], ...data },
        };
      }
      return prevData;
    });
  };

  const setRightsInfoErrors = (errors) => {
    setErrors((prevState) => ({
      ...prevState,
      rightsInfoErrors: errors,
    }));
  };

  const handleRightsChange = (selectedRights) => {
    setFormData((prevState) => ({
      ...prevState,
      rightsInfo: selectedRights,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const tempErrors = {
      projectInfoErrors: {},
      submitterInfoErrors: {},
      creditsInfoErrors: {},
      specificationsInfoErrors: {},
      screeningsErrors: {},
      rightsInfoErrors: {},
    };

    if (!formData.projectInfo.projectTitle) {
      isValid = false;
      tempErrors.projectInfoErrors.projectTitle = 'Project title is required.';
    }

    if (formData.screeningsInfo.screenings.length === 0) {
      isValid = false;
      tempErrors.screeningsErrors.screenings = 'At least one screening is required.';
    }

    if (formData.rightsInfo.length === 0) {
      isValid = false;
      tempErrors.rightsInfoErrors = 'Please select at least one right.';
    }

    setErrors(tempErrors);
    return isValid;
  };

  const transferFileToLocation = async () => {
    // Dynamically getting the orgName and projectFolder
    const orgName = userData ? userData.orgName : ''; // Fallback if orgName is not set
    const projectFolder = projectName || 'defaultProjectFolder'; // Fallback if projectName is not set

    // Ensure we are using the most recent state for formData
    const posterFileUrl = formData.projectInfo.s3SourcePosterUrl;
    const bannerFileUrl = formData.projectInfo.s3SourceBannerUrl;
    const trailerFileUrl = formData.projectInfo.s3SourceTrailerUrl;
    const movieFileUrl = formData.projectInfo.s3SourceMovieUrl;

    console.log("Poster URL:", posterFileUrl);
    console.log("Banner URL:", bannerFileUrl);
    console.log("Trailer URL:", trailerFileUrl);
    console.log("Movie URL:", movieFileUrl);

    // Extracting the file names from the source URLs if they exist
    const posterFileName = posterFileUrl ? posterFileUrl.split('/').pop() : null;
    const bannerFileName = bannerFileUrl ? bannerFileUrl.split('/').pop() : null;
    const trailerFileName = trailerFileUrl ? trailerFileUrl.split('/').pop() : null;
    const movieFileName = movieFileUrl ? movieFileUrl.split('/').pop() : null;

    // Constructing the destination URLs for all files
    const posterDestinationUrl = posterFileName ? `s3://testmediashippers /${orgName}/${projectFolder}/film stills/${posterFileName}` : null;
    const bannerDestinationUrl = bannerFileName ? `s3://testmediashippers /${orgName}/${projectFolder}/film stills/${bannerFileName}` : null;
    const trailerDestinationUrl = trailerFileName ? `s3://testmediashippers /${orgName}/${projectFolder}/trailer/${trailerFileName}` : null;
    const movieDestinationUrl = movieFileName ? `s3://testmediashippers /${orgName}/${projectFolder}/master/${movieFileName}` : null;

    // Log the destination URLs for validation
    console.log('Poster Destination URL:', posterDestinationUrl || 'No poster URL provided');
    console.log('Banner Destination URL:', bannerDestinationUrl || 'No banner URL provided');
    console.log('Trailer Destination URL:', trailerDestinationUrl || 'No trailer URL provided');
    console.log('Movie Destination URL:', movieDestinationUrl || 'No movie URL provided');


    // Check if access keys exist
    if (!accessKeyId || !secretAccessKey) {
      console.error("Access keys are missing!");
      return;
    }

    try {
      // Prepare the data to send to the backend
      const response = await fetch(`/api/folders/transfer-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posterFileUrl,
          bannerFileUrl,
          trailerFileUrl,
          movieFileUrl,
          orgName,
          projectFolder,
          accessKeyId, // Pass the accessKeyId to the backend
          secretAccessKey, // Pass the secretAccessKey to the backend
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('File transfers completed successfully:', result.message);
      } else {
        console.error('File transfer failed:', result.error);
      }
    } catch (error) {
      console.error('Error during file transfer:', error);
    }
  };



  const extractFileNameFromUrl = (url) => {
    if (url) {
      // Extract filename from the URL (this assumes URL structure like "s3://bucket/folder/filename.jpg")
      const parts = url.split('/');
      return parts[parts.length - 1]; // Get the last part (filename)
    }
    return '';
  };



//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsFormSubmitted(true);

//     console.log('Form submission started');

//     // Perform form validation
//     const errors = validateForm();
//     if (errors !== true) {
//         console.log("Form validation failed with the following errors:", errors);
//         alert('Please fix the errors before submitting.');
//         return;
//     }
//     console.log('Form validation passed');

//     // Initialize filenames based on options
//     let posterUrl = '';
//     let bannerUrl = '';
//     let trailerUrl = '';
//     let movieFileName = '';

//     // Create base URL for film stills
//     const basePosterUrl = `s3://testmediashippers /${orgName}/${projectName}/film+stills/`;
//     const baseBannerUrl = `s3://testmediashippers /${orgName}/${projectName}/film+stills/`;
//     const baseTrailerUrl = `s3://testmediashippers /${orgName}/${projectName}/trailers/`;

//     console.log('Base URLs for file uploads:', { basePosterUrl, baseBannerUrl, baseTrailerUrl });

//     try {
//         // Debug: Ensure that banner and trailer files are being passed correctly
//         console.log('Form Data:', formData.projectInfo);

//         // Upload Poster
//         if (formData.projectInfo.posterOption === 'upload' && formData.projectInfo.projectPoster) {
//             console.log('Uploading poster:', formData.projectInfo.projectPoster);
//             posterUrl = await uploadFileToS3(formData.projectInfo.projectPoster, basePosterUrl);
//         } else if (formData.projectInfo.posterOption === 'url' && formData.projectInfo.s3SourcePosterUrl) {
//             console.log('Using existing poster URL:', formData.projectInfo.s3SourcePosterUrl);
//             posterUrl = formData.projectInfo.s3SourcePosterUrl;
//         } else {
//             console.log('No poster to upload.');
//         }

//         // Upload Banner
//         if (formData.projectInfo.bannerOption === 'upload' && formData.projectInfo.bannerFileName) {
//             console.log('Uploading banner:', formData.projectInfo.bannerFileName);
//             bannerUrl = await uploadFileToS3(formData.projectInfo.bannerFileName, baseBannerUrl);
//         } else if (formData.projectInfo.bannerOption === 'url' && formData.projectInfo.s3SourceBannerUrl) {
//             console.log('Using existing banner URL:', formData.projectInfo.s3SourceBannerUrl);
//             bannerUrl = formData.projectInfo.s3SourceBannerUrl;
//         } else {
//             console.log('No banner to upload.');
//         }

//         // Upload Trailer
//         if (formData.projectInfo.trailerOption === 'upload' && formData.projectInfo.trailerFile) {
//             console.log('Uploading trailer:', formData.projectInfo.trailerFile);
//             trailerUrl = await uploadFileToS3(formData.projectInfo.trailerFile, baseTrailerUrl);
//         } else if (formData.projectInfo.trailerOption === 'url' && formData.projectInfo.s3SourceTrailerUrl) {
//             console.log('Using existing trailer URL:', formData.projectInfo.s3SourceTrailerUrl);
//             trailerUrl = formData.projectInfo.s3SourceTrailerUrl;
//         } else {
//             console.log('No trailer to upload.');
//         }

//         // Movie File (keeping as per your request)
//         movieFileName = formData.projectInfo.movieFileName || '';
//         console.log('Using movie file name:', movieFileName);

//         // Prepare the updated form data with the S3 URLs
//         const updatedFormData = {
//             projectInfo: {
//                 ...formData.projectInfo,
//                 projectName,
//                 userId: user?.userId || '',
//                 posterFileName: posterUrl, // Save the S3 URL of the poster
//                 bannerFileName: bannerUrl, // Save the S3 URL of the banner
//                 trailerFileName: trailerUrl, // Save the S3 URL of the trailer
//                 movieFileName, // Save the movie file name (either URL or uploaded file)
//             },
//             submitterInfo: {
//                 ...formData.submitterInfo,
//                 projectName,
//                 userId: user?.userId || '',
//             },
//             creditsInfo: {
//                 ...formData.creditsInfo,
//                 projectName,
//                 userId: user?.userId || '',
//             },
//             specificationsInfo: {
//                 ...formData.specificationsInfo,
//                 projectName,
//                 userId: user?.userId || '',
//             },
//             screeningsInfo: {
//                 ...formData.screeningsInfo,
//                 projectName,
//                 userId: user?.userId || '',
//             },
//             rightsInfo: {
//                 projectName,
//                 userId: user?.userId || '',
//                 rightsInfo: formData.rightsInfo,
//             },
//             userId: user?.userId || '',
//         };

//         console.log('Updated Form Data:', updatedFormData);
//         console.log('Updated form data prepared successfully');

//         // Dispatching request to start saving the project
//         dispatch(setProjectFolderRequest());
//         console.log('Dispatching setProjectFolderRequest');

//         // Sending request to the server to save the project
//         const response = await fetch('/api/projectForm/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedFormData),
//         });

//         // Check if the response is OK
//         if (response.ok) {
//             console.log('Server responded with OK');
//             alert('Project saved successfully!');
//             dispatch(setProjectFolderSuccess(formData.projectInfo.projectTitle));

//             // Trigger file transfer API after successful project save
//             console.log('Triggering file transfer...');
//             const transferResult = await transferFileToLocation();
//             console.log('File transfer result:', transferResult);
//         } else {
//             const errorData = await response.json();
//             console.error('Error response from server:', errorData);
//             alert('Failed to save project. Server error: ' + errorData.message);
//             dispatch(setProjectFolderFailure({ message: errorData.message })); // Ensure the error is serializable
//         }
//     } catch (error) {
//         // Catch network or unexpected errors
//         console.error('Error saving project:', error);
//         alert('Error saving project: ' + error.message);
//         dispatch(setProjectFolderFailure({ message: error.message })); // Ensure the error is serializable
//     }
// };



// const uploadFileToS3 = async (file, baseUrl) => {
//   if (!file) {
//       console.error('No file provided for upload.');
//       return;
//   }

//   // Log the file object to inspect its structure
//   console.log('File details before upload:', file);

//   // Check if the file is a valid File object
//   if (!(file instanceof File)) {
//       console.error('Uploaded object is not a File:', file);
//       throw new Error('Uploaded object is not a valid File.');
//   }

//   // Check if the file has a name property
//   if (!file.name) {
//       console.error('Uploaded file is missing a name property:', file);
//       throw new Error('Uploaded file is missing a name property.');
//   }

//   // Construct the file name based on the base URL and file name
//   const fileName = `${baseUrl}${file.name}`;
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//       const response = await fetch('/api/files/upload-file', {
//           method: 'POST',
//           body: formData,
//       });

//       // Check if the response is OK (status code 2xx)
//       if (!response.ok) {
//           const errorText = await response.text();
//           console.error(`Failed to upload file: ${file.name}. Server returned: ${errorText}`);
//           throw new Error(`Failed to upload file: ${file.name}`);
//       }

//       // Parse the response as JSON (assuming the response contains the file URL)
//       const data = await response.json();

//       // Log the successful upload response
//       console.log('File uploaded successfully. File URL:', data.fileUrl);

//       // Return the URL of the uploaded file (assuming the API returns this)
//       return data.fileUrl;
//   } catch (error) {
//       // Log and throw any errors during the upload process
//       console.error('Error during file upload:', error.message);
//       throw error;
//   }
// };


const uploadFileToS3 = async (file, baseUrl) => {
  if (!file) {
      console.error('No file provided for upload.');
      return;
  }

  console.log('File details before upload:', file);

  if (!(file instanceof File)) {
      console.error('Uploaded object is not a valid File:', file);
      throw new Error('Uploaded object is not a valid File.');
  }

  if (!file.name) {
      console.error('Uploaded file is missing a name property:', file);
      throw new Error('Uploaded file is missing a name property.');
  }

  const fileName = `${baseUrl}${file.name}`;
  const formData = new FormData();
  
  formData.append('file', file);
  formData.append('Filename', 'abcefg');
  console.log("Hello world")
  console.log("form data after append+++++++++=======:", formData);
  console.log("file:----====>>>", file)

  try {
      const response = await fetch(`/api/files/upload-file`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          // Log full response to see the error details
          const errorText = await response.text();
          console.error(`Failed to upload file: ${file.name}. Server returned: ${errorText}`);
          throw new Error(`Failed to upload file: ${file.name}`);
      }

      const data = await response.json();
      console.log('File uploaded successfully. File URL:', data.fileUrl);
      return data.fileUrl;
  } catch (error) {
      console.error('Error during file upload:', error.message);
      throw error;
  }
};

// Update this part of the code where you handle form submission
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setIsFormSubmitted(true);

//   console.log('Form submission started');

//   // Perform form validation
//   const errors = validateForm();
//   if (errors !== true) {
//       console.log("Form validation failed with the following errors:", errors);
//       alert('Please fix the errors before submitting.');
//       return;
//   }
//   console.log('Form validation passed');

//   // Initialize filenames based on options
//   let posterUrl = '';
//   let bannerUrl = '';
//   let trailerUrl = '';
//   let movieFileName = '';

//   // Create base URL for file uploads
//   const basePosterUrl = `s3://testmediashippers /${orgName}/${projectName}/film+stills/`;
//   const baseBannerUrl = `s3://testmediashippers /${orgName}/${projectName}/film+stills/`;
//   const baseTrailerUrl = `s3://testmediashippers /${orgName}/${projectName}/trailers/`;

//   console.log('Base URLs for file uploads:', { basePosterUrl, baseBannerUrl, baseTrailerUrl });

//   try {
//       // Debug: Ensure that banner and trailer files are being passed correctly
//       console.log('Form Data:', formData.projectInfo);

//       // Upload Poster
//       if (formData.projectInfo.posterOption === 'upload' && formData.projectInfo.projectPoster) {
//           console.log('Uploading poster:', formData.projectInfo.projectPoster);
//           posterUrl = await uploadFileToS3(formData.projectInfo.projectPoster, basePosterUrl);
//       }

//       // Upload Banner
//       if (formData.projectInfo.bannerOption === 'upload' && formData.projectInfo.bannerFileName) {
//           console.log('Uploading banner:', formData.projectInfo.bannerFileName);
//           bannerUrl = await uploadFileToS3(formData.projectInfo.bannerFileName, baseBannerUrl);
//       }

//       // Upload Trailer
//       if (formData.projectInfo.trailerOption === 'upload' && formData.projectInfo.trailerFile) {
//           console.log('Uploading trailer:', formData.projectInfo.trailerFile);
//           trailerUrl = await uploadFileToS3(formData.projectInfo.trailerFile, baseTrailerUrl);
//       }

//       movieFileName = formData.projectInfo.movieFileName || '';
//       console.log('Using movie file name:', movieFileName);

//       const updatedFormData = {
//           projectInfo: {
//               ...formData.projectInfo,
//               projectName,
//               userId: user?.userId || '',
//               posterFileName,
//               bannerFileName,
//               trailerFileName,
//               movieFileName,
//           },
//           submitterInfo: { ...formData.submitterInfo, projectName, userId: user?.userId || '' },
//           creditsInfo: { ...formData.creditsInfo, projectName, userId: user?.userId || '' },
//           specificationsInfo: { ...formData.specificationsInfo, projectName, userId: user?.userId || '' },
//           screeningsInfo: { ...formData.screeningsInfo, projectName, userId: user?.userId || '' },
//           rightsInfo: { projectName, userId: user?.userId || '', rightsInfo: formData.rightsInfo },
//           userId: user?.userId || '',
//       };

//       console.log('Updated Form Data:', updatedFormData);

//       const response = await fetch('/api/projectForm/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(updatedFormData),
//       });

//       if (response.ok) {
//           console.log('Project saved successfully!');
//           alert('Project saved successfully!');
//       } else {
//           const errorData = await response.json();
//           console.error('Error:', errorData);
//           alert('Failed to save project: ' + errorData.message);
//       }
//   } catch (error) {
//       console.error('Error:', error);
//       alert('Error saving project: ' + error.message);
//   }
// };


// url code
const handleSubmit = async (event) => {
  event.preventDefault();
  setIsFormSubmitted(true);

  console.log('Form submission started');

  // Perform form validation
  const errors = validateForm();
  if (errors !== true) {
    console.log("Form validation failed with the following errors:", errors);
    alert('Please fix the errors before submitting.');
    return;
  }
  console.log('Form validation passed');

  // Prepare updated form data
  console.log('Preparing updated form data');

  // Initialize filenames based on options
  let posterFileName = '';
  let bannerFileName = '';
  let trailerFileName = '';
  let movieFileName = '';

  

  // Check the selected options and extract the file names accordingly
  if (formData.projectInfo.posterOption === 'upload' && formData.projectInfo.projectPoster) {
    // If posterOption is 'upload', use the uploaded file URL to extract the filename
    posterFileName = formData.projectInfo.projectPoster;
  } else if (formData.projectInfo.posterOption === 'url' && formData.projectInfo.s3SourcePosterUrl) {
    // If posterOption is 'url', use the S3 URL to extract the filename
    posterFileName = extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl);
  }

  if (formData.projectInfo.bannerOption === 'upload' && formData.projectInfo.bannerFileName) {
    // If bannerOption is 'upload', use the uploaded file URL to extract the filename
    bannerFileName = formData.projectInfo.bannerFileName;
  } else if (formData.projectInfo.bannerOption === 'url' && formData.projectInfo.s3SourceBannerUrl) {
    // If bannerOption is 'url', use the S3 URL to extract the filename
    bannerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl);
  }

  if (formData.projectInfo.trailerOption === 'upload' && formData.projectInfo.trailerFile) {
    // If trailerOption is 'upload', use the uploaded file URL to extract the filename
    trailerFileName = formData.projectInfo.trailerFile;
  } else if (formData.projectInfo.trailerOption === 'url' && formData.projectInfo.s3SourceTrailerUrl) {
    // If trailerOption is 'url', use the S3 URL to extract the filename
    trailerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceTrailerUrl);
  }

  // if (formData.projectInfo.movieOption === 'upload' && formData.projectInfo.projectMovie) {
  //   // If movieOption is 'upload', use the uploaded file URL to extract the filename
  //   movieFileName = formData.projectInfo.projectMovieUrl;
  // } else if (formData.projectInfo.movieOption === 'url' && formData.projectInfo.s3SourceMovieUrl) {
  //   // If movieOption is 'url', use the S3 URL to extract the filename
  //   movieFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceMovieUrl);
  // }


  movieFileName = formData.projectInfo.movieFileName || ''; 

  // Prepare the data to send to the backend, including only filenames
  const updatedFormData = {
    projectInfo: {
      ...formData.projectInfo,
      projectName,
      userId: user?.userId || '',
      posterFileName, // Use only the filename here
      bannerFileName, // Use only the filename here
      trailerFileName, // Use only the filename here
      movieFileName, // Use only the filename here
    },
    // submitterInfo: {
    //   ...formData.submitterInfo,
    //   projectName,
    //   userId: user?.userId || '',
    // },
    creditsInfo: {
      ...formData.creditsInfo,
      projectName,
      userId: user?.userId || '',
    },
    specificationsInfo: {
      ...formData.specificationsInfo,
      projectName,
      userId: user?.userId || '',
    },
    screeningsInfo: {
      ...formData.screeningsInfo,
      projectName,
      userId: user?.userId || '',
    },
    rightsInfo: {
      projectName,
      userId: user?.userId || '',
      rightsInfo: formData.rightsInfo,
    },
    userId: user?.userId || '',
  };

  console.log('Updated Form Data:', updatedFormData);
  console.log('Updated form data prepared successfully');

  // Dispatching request to start saving the project
  dispatch(setProjectFolderRequest());
  console.log('Dispatching setProjectFolderRequest');

  try {
    console.log('Sending request to the server...');
    const response = await fetch(`/api/projectForm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFormData),
    });

    // Check if the response is OK
    if (response.ok) {
      console.log('Server responded with OK');
      // Project saved successfully
      alert('Project saved successfully!');
      dispatch(setProjectFolderSuccess(formData.projectInfo.projectTitle));

      // Trigger file transfer API after successful project save
      console.log('Triggering file transfer...');
      const transferResult = await transferFileToLocation();
      console.log('File transfer result:', transferResult);

      // If the file transfer is successful, redirect the user
      // navigate('/video-catalogue');
    } else {
      // Handle error response from the server
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      alert('Failed to save project. Server error: ' + errorData.message);
      dispatch(setProjectFolderFailure(errorData));
    }
  } catch (error) {
    // Catch network or unexpected errors
    console.error('Error saving project:', error);
    alert('Error saving project: ' + error.message);
    dispatch(setProjectFolderFailure(error));
  }
};



  return (
    <form className="container-fluid projects-form-container">
      <div className='text-white'>
        <h1>{user.userId}</h1>
        {/* Display orgName below userId */}
        <h1>{orgName}</h1>


        <div className='text-white'>
          <h2>Project Name: {projectName}</h2>
          <h3>Movie Name: {movieName}</h3>
        </div>

        <ProjectInfo
          onInputChange={(data) => handleInputChange('projectInfo', data)}
          projectInfo={formData.projectInfo}
          errors={isFormSubmitted ? errors.projectInfoErrors : {}}
          setProjectInfoErrors={(errors) =>
            setErrors((prev) => ({
              ...prev,
              projectInfoErrors: errors,
            }))
          }
          userId={user.userId}
          projectName={projectName}
          movieName={movieName}
          accessKey=""
          secretKey=""
          handleAccessKeyChange={() => { }}
          handleSecretKeyChange={() => { }}
          handleChange={(e) => handleInputChange('projectInfo', { s3SourcePosterUrl: e.target.value })}  // Use s3SourcePosterUrl here
          resetProjectPoster={() => { }}

        />


        <SrtFileUpload
          onSrtFileUpload={handleSrtFileChange}
          onInfoDocsUpload={handleInfoDocsChange}
        />

        <RightsInfo
          onRightsChange={handleRightsChange}
          rightsInfo={formData.rightsInfo}
          errors={errors.rightsInfoErrors}
          setRightsInfoErrors={setRightsInfoErrors}
        />

        {/* <SubmitterInfo
          onSubmitterInfoChange={(data) => handleInputChange('submitterInfo', data)}
          formData={formData.submitterInfo}
          formErrors={isFormSubmitted ? errors.submitterInfoErrors : {}}
          setSubmitterInfoErrors={(errors) =>
            setErrors((prev) => ({
              ...prev,
              submitterInfoErrors: errors,
            }))
          }
          setIsSubmitterInfoVisible={setIsSubmitterInfoVisible}
          isSubmitterInfoVisible={isSubmitterInfoVisible}
        /> */}

        <CreditsInfo
          onInputChange={(data) => handleInputChange('creditsInfo', data)}
          creditsInfo={formData.creditsInfo}
          errors={isFormSubmitted ? errors.creditsInfoErrors : {}}
          setCreditsInfoErrors={(errors) =>
            setErrors((prev) => ({
              ...prev,
              creditsInfoErrors: errors,
            }))
          }
        />
        <SpecificationsInfo
          onInputChange={(data) => handleInputChange('specificationsInfo', data)}
          formData={formData.specificationsInfo}
          errors={isFormSubmitted ? errors.specificationsInfoErrors : {}}
          setSpecsErrors={(errors) =>
            setErrors((prev) => ({
              ...prev,
              specificationsInfoErrors: errors,
            }))
          }
        />
        <ScreeningsInfo
          onInputChange={(data) => handleInputChange('screeningsInfo', data)}
          screeningsInfo={formData.screeningsInfo}
          errors={isFormSubmitted ? errors.screeningsErrors : {}}
          setScreeningErrors={(errors) =>
            setErrors((prev) => ({
              ...prev,
              screeningsErrors: errors,
            }))
          }
        />
      </div>

      <button type="submit" to="/video-catalogue" className="save-button" onClick={handleSubmit}>
        Save Project
      </button>
    </form>
  );
}

export default ProjectsForm;
