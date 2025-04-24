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

  const [srtFiles, setSrtFiles] = useState([]);
  const [infoDocs, setInfoDocs] = useState([]);
  

  const { projectName, movieName } = useProjectInfo();
  const [formData, setFormData] = useState({
    projectInfo: {
      s3SourcePosterUrl: '',
      s3SourceBannerUrl: '',
      s3SourceTrailerUrl: '',
      s3SourceMovieUrl: '',
   
    },
    srtInfo: {
      srtFiles: [],
      infoDocuments: []
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

  useEffect(() => {
    console.log('Updated srtFiles:', srtFiles);
    console.log('Updated infoDocs:', infoDocs);
  }, [srtFiles, infoDocs]);

  const handleSrtFileChange = (files) => {
    console.log('📥 SRT Files received:', files);
    setSrtFiles(files);
    handleCombinedFilesChange(files, infoDocs);
  };

  const handleInfoDocsChange = (files) => {
    console.log('📥 Info Docs received:', files);
    setInfoDocs(files);
    handleCombinedFilesChange(srtFiles, files);
  };

  const handleCombinedFilesChange = (srtFiles, infoDocs) => {
    const combinedPairs = [];
    const maxLength = Math.max(srtFiles.length, infoDocs.length);
    for (let i = 0; i < maxLength; i++) {
      combinedPairs.push({
        srtFile: srtFiles[i] || null,
        infoDocFile: infoDocs[i] || null,
      });
    }
    setFormData((prevData) => ({
      ...prevData,
      srtInfo: combinedPairs,
    }));
  };

  useEffect(() => {
    console.log("Current SRT Info:", formData.srtInfo);
  }, [formData.srtInfo]);
  
  
  useEffect(() => {
    console.log("Current SRT Info:", formData.srtInfo);
  }, [formData.srtInfo]);

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

  const handleRightsChange = (rightsData) => {
    setFormData((prevState) => ({
      ...prevState,
      rightsInfo: {
        ...rightsData, // now it's an object, not array
      },
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

    if (!formData.rightsInfo.rights || formData.rightsInfo.rights.length === 0) {
      isValid = false;
      tempErrors.rightsInfoErrors = 'Please select at least one right.';
    }
    

    setErrors(tempErrors);
    return isValid;
  };


  const transferFileToLocation = async () => {
    const orgName = userData ? userData.orgName : '';
    const projectFolder = projectName || 'defaultProjectFolder';
  
    const posterFileUrl = formData.projectInfo.s3SourcePosterUrl;
    const bannerFileUrl = formData.projectInfo.s3SourceBannerUrl;
    const trailerFileUrl = formData.projectInfo.s3SourceTrailerUrl;
    const movieFileUrl = formData.projectInfo.s3SourceMovieUrl;
  
    const accessKeyId = 'AKIATKPD3X56KBBSX2K2';
    const secretAccessKey = '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';
  
    if (!accessKeyId || !secretAccessKey) {
      console.error("Access keys are missing!");
      return { success: false, error: "Missing access keys" };
    }
  
    try {
      const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          posterFileUrl,
          bannerFileUrl,
          trailerFileUrl,
          movieFileUrl,
          orgName,
          projectFolder,
          accessKeyId,
          secretAccessKey,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('✅ File transfers completed successfully:', result.message);
        return { success: true, message: result.message };
      } else {
        console.error('❌ File transfer failed:', result.error);
        return { success: false, error: result.error || 'Unknown error from server' };
      }
    } catch (error) {
      console.error('❗ Error during file transfer:', error);
      return { success: false, error: error.message };
    }
  };
  

  // const transferFileToLocation = async () => {
  //   // Dynamically getting the orgName and projectFolder
  //   const orgName = userData ? userData.orgName : ''; // Fallback if orgName is not set
  //   const projectFolder = projectName || 'defaultProjectFolder'; // Fallback if projectName is not set

  //   // Ensure we are using the most recent state for formData
  //   const posterFileUrl = formData.projectInfo.s3SourcePosterUrl;
  //   const bannerFileUrl = formData.projectInfo.s3SourceBannerUrl;
  //   const trailerFileUrl = formData.projectInfo.s3SourceTrailerUrl;
  //   const movieFileUrl = formData.projectInfo.s3SourceMovieUrl;

  //   console.log("Poster URL:", posterFileUrl);
  //   console.log("Banner URL:", bannerFileUrl);
  //   console.log("Trailer URL:", trailerFileUrl);
  //   console.log("Movie URL:", movieFileUrl);

  //   // Extracting the file names from the source URLs if they exist
  //   const posterFileName = posterFileUrl ? posterFileUrl.split('/').pop() : null;
  //   const bannerFileName = bannerFileUrl ? bannerFileUrl.split('/').pop() : null;
  //   const trailerFileName = trailerFileUrl ? trailerFileUrl.split('/').pop() : null;
  //   const movieFileName = movieFileUrl ? movieFileUrl.split('/').pop() : null;

  //   // Constructing the destination URLs for all files
  //   const posterDestinationUrl = posterFileName ? `s3://mediashippers-filestash/${orgName}/${projectFolder}/film stills/${posterFileName}` : null;
  //   const bannerDestinationUrl = bannerFileName ? `s3://mediashippers-filestash/${orgName}/${projectFolder}/film stills/${bannerFileName}` : null;
  //   const trailerDestinationUrl = trailerFileName ? `s3://mediashippers-filestash/${orgName}/${projectFolder}/trailer/${trailerFileName}` : null;
  //   const movieDestinationUrl = movieFileName ? `s3://mediashippers-filestash/${orgName}/${projectFolder}/master/${movieFileName}` : null;

  //   // Log the destination URLs for validation
  //   console.log('Poster Destination URL:', posterDestinationUrl || 'No poster URL provided');
  //   console.log('Banner Destination URL:', bannerDestinationUrl || 'No banner URL provided');
  //   console.log('Trailer Destination URL:', trailerDestinationUrl || 'No trailer URL provided');
  //   console.log('Movie Destination URL:', movieDestinationUrl || 'No movie URL provided');

  //   // Retrieve the access keys from the old code directly (hardcoded as in the old version)
  //   const accessKeyId = 'AKIATKPD3X56KBBSX2K2';  // Hardcoded as in old code
  //   const secretAccessKey = '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';  // Hardcoded as in old code

  //   // Check if access keys exist
  //   if (!accessKeyId || !secretAccessKey) {
  //     console.error("Access keys are missing!");
  //     return;
  //   }

  //   try {
  //     // Prepare the data to send to the backend
  //     const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },credentials: 'include',
  //       body: JSON.stringify({
  //         posterFileUrl,
  //         bannerFileUrl,
  //         trailerFileUrl,
  //         movieFileUrl,
  //         orgName,
  //         projectFolder,
  //         accessKeyId, // Pass the accessKeyId to the backend
  //         secretAccessKey, // Pass the secretAccessKey to the backend
  //       }),
  //     });

  //     const result = await response.json();
  //     if (response.ok) {
  //       console.log('File transfers completed successfully:', result.message);
  //     } else {
  //       console.error('File transfer failed:', result.error);
  //     }
  //   } catch (error) {
  //     console.error('Error during file transfer:', error);
  //   }
  // };





  const extractFileNameFromUrl = (url) => {
    if (url) {
      // Extract filename from the URL (this assumes URL structure like "s3://bucket/folder/filename.jpg")
      const parts = url.split('/');
      return parts[parts.length - 1]; // Get the last part (filename)
    }
    return '';
  };



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


// url code
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setIsFormSubmitted(true);

//   console.log('Form submission started');

//   const userId = user?.userId || ''; // Use the userId from Redux or fallback to empty string
//   console.log('User ID before adding to updated form data:', userId);

//   // Perform form validation
//   const errors = validateForm();
//   if (errors !== true) {
//     console.log("Form validation failed with the following errors:", errors);
//     alert('Please fix the errors before submitting.');
//     return;
//   }
//   console.log('Form validation passed');

//   // Prepare updated form data
//   console.log('Preparing updated form data');

//   // Initialize filenames based on options
//   let posterFileName = '';
//   let bannerFileName = '';
//   let trailerFileName = '';
//   let movieFileName = '';

  

//   // Check the selected options and extract the file names accordingly
//   if (formData.projectInfo.posterOption === 'upload' && formData.projectInfo.projectPoster) {
//     // If posterOption is 'upload', use the uploaded file URL to extract the filename
//     posterFileName = formData.projectInfo.projectPoster;
//   } else if (formData.projectInfo.posterOption === 'url' && formData.projectInfo.s3SourcePosterUrl) {
//     // If posterOption is 'url', use the S3 URL to extract the filename
//     posterFileName = extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl);
//   }

//   if (formData.projectInfo.bannerOption === 'upload' && formData.projectInfo.bannerFileName) {
//     // If bannerOption is 'upload', use the uploaded file URL to extract the filename
//     bannerFileName = formData.projectInfo.bannerFileName;
//   } else if (formData.projectInfo.bannerOption === 'url' && formData.projectInfo.s3SourceBannerUrl) {
//     // If bannerOption is 'url', use the S3 URL to extract the filename
//     bannerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl);
//   }

//   if (formData.projectInfo.trailerOption === 'upload' && formData.projectInfo.trailerFile) {
//     // If trailerOption is 'upload', use the uploaded file URL to extract the filename
//     trailerFileName = formData.projectInfo.trailerFile;
//   } else if (formData.projectInfo.trailerOption === 'url' && formData.projectInfo.s3SourceTrailerUrl) {
//     // If trailerOption is 'url', use the S3 URL to extract the filename
//     trailerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceTrailerUrl);
//   }


//   movieFileName = formData.projectInfo.movieFileName || ''; 

  

//   // Prepare the data to send to the backend, including only filenames
// const updatedFormData = {
//   projectInfo: {
//     ...formData.projectInfo,
//     projectName,
//     userId: user?.userId || '',
//     posterFileName,
//     bannerFileName,
//     trailerFileName,
//     movieFileName
//   },
//   creditsInfo: {
//     ...formData.creditsInfo,
//     projectName,
//     userId: user?.userId || '',
//   },
//   specificationsInfo: {
//     ...formData.specificationsInfo,
//     projectName,
//     userId: user?.userId || '',
//   },
//   screeningsInfo: {
//     ...formData.screeningsInfo,
//     projectName,
//     userId: user?.userId || '',
//   },
//   rightsInfo: {
//     ...formData.rightsInfo,
//     projectName,
//     userId: user?.userId || '',
//   },

//   srtInfo: {
//     srtFiles: formData.srtInfo.map(pair => pair.srtFile),
//     infoDocuments: formData.srtInfo.map(pair => pair.infoDocFile),
//     projectName,
//     userId,
//   },
  
  
// };






//   console.log('Updated Form Data:', updatedFormData);
//   console.log('Updated form data prepared successfully');

  

//   // Dispatching request to start saving the project
//   dispatch(setProjectFolderRequest());
//   console.log('Dispatching setProjectFolderRequest');

//   try {
//     console.log('Sending request to the server...');
//     const response = await fetch(`https://www.mediashippers.com/api/projectForm`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },credentials: 'include',
//       body: JSON.stringify(updatedFormData),
//     });

//     // Check if the response is OK
//     if (response.ok) {
//       console.log('Server responded with OK');
//       // Project saved successfully
//       alert('Project saved successfully!');
//       dispatch(setProjectFolderSuccess(formData.projectInfo.projectTitle));

//       // Trigger file transfer API after successful project save
//       console.log('Triggering file transfer...');
//       const transferResult = await transferFileToLocation();
//       console.log('File transfer result:', transferResult);

//       // If the file transfer is successful, redirect the user
//       // navigate('/video-catalogue');
//     } else {
//       // Handle error response from the server
//       const errorData = await response.json();
//       console.error('Error response from server:', errorData);
//       alert('Failed to save project. Server error: ' + errorData.message);
//       dispatch(setProjectFolderFailure(errorData));
//     }
//   } catch (error) {
//     // Catch network or unexpected errors
//     console.error('Error saving project:', error);
//     alert('Error saving project: ' + error.message);
//     dispatch(setProjectFolderFailure(error));
//   }
// };


const handleSubmit = async (event) => {
  event.preventDefault();
  setIsFormSubmitted(true);

  console.log('Form submission started');

  const userId = user?.userId || '';
  console.log('User ID before adding to updated form data:', userId);

  const errors = validateForm();
  if (errors !== true) {
    console.log("Form validation failed with the following errors:", errors);
    alert('Please fix the errors before submitting.');
    return;
  }

  console.log('Form validation passed');

  let posterFileName = '';
  let bannerFileName = '';
  let trailerFileName = '';
  let movieFileName = '';

  if (formData.projectInfo.posterOption === 'upload' && formData.projectInfo.projectPoster) {
    posterFileName = formData.projectInfo.projectPoster;
  } else if (formData.projectInfo.posterOption === 'url' && formData.projectInfo.s3SourcePosterUrl) {
    posterFileName = extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl);
  }

  if (formData.projectInfo.bannerOption === 'upload' && formData.projectInfo.bannerFileName) {
    bannerFileName = formData.projectInfo.bannerFileName;
  } else if (formData.projectInfo.bannerOption === 'url' && formData.projectInfo.s3SourceBannerUrl) {
    bannerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl);
  }

  if (formData.projectInfo.trailerOption === 'upload' && formData.projectInfo.trailerFile) {
    trailerFileName = formData.projectInfo.trailerFile;
  } else if (formData.projectInfo.trailerOption === 'url' && formData.projectInfo.s3SourceTrailerUrl) {
    trailerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceTrailerUrl);
  }

  movieFileName = formData.projectInfo.movieFileName || '';

  const updatedFormData = {
    projectInfo: {
      ...formData.projectInfo,
      projectName,
      userId,
      posterFileName,
      bannerFileName,
      trailerFileName,
      movieFileName
    },
    creditsInfo: {
      ...formData.creditsInfo,
      projectName,
      userId,
    },
    specificationsInfo: {
      ...formData.specificationsInfo,
      projectName,
      userId,
    },
    screeningsInfo: {
      ...formData.screeningsInfo,
      projectName,
      userId,
    },
    rightsInfo: {
      ...formData.rightsInfo,
      projectName,
      userId,
    },
    srtInfo: {
      srtFiles: formData.srtInfo.map(pair => pair.srtFile),
      infoDocuments: formData.srtInfo.map(pair => pair.infoDocFile),
      projectName,
      userId,
    },
  };

  console.log('Updated Form Data:', updatedFormData);

  dispatch(setProjectFolderRequest());
  console.log('Dispatching setProjectFolderRequest');

  try {
    const response = await fetch(`https://www.mediashippers.com/api/projectForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedFormData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Server responded with OK:', result);
      alert('Project saved successfully!');
      dispatch(setProjectFolderSuccess(formData.projectInfo.projectTitle));

      // ✅ Trigger file transfer and wait for response
      console.log('Triggering file transfer...');
      const transferResult = await transferFileToLocation();
      console.log('📦 File transfer result:', transferResult);

      if (transferResult?.success) {
        alert('🎉 File transfer successful!');
        // Optionally navigate or do something here
      } else {
        alert(`⚠️ File transfer failed: ${transferResult?.error || 'Unknown error'}`);
      }

    } else {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      alert('Failed to save project. Server error: ' + errorData.message);
      dispatch(setProjectFolderFailure(errorData));
    }
  } catch (error) {
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


<SrtFileUpload
  onSrtFileChange={handleSrtFileChange}
  onInfoDocsFileChange={handleInfoDocsChange}
/>

        
     

        <RightsInfo
          onRightsChange={handleRightsChange}
          rightsInfo={formData.rightsInfo}
          errors={errors.rightsInfoErrors}
          setRightsInfoErrors={setRightsInfoErrors}
        />

      

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
