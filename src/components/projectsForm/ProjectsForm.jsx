import React, { useEffect, useState, useContext, useCallback } from 'react';
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
import Cookies from 'js-cookie';
import Loader from '../loader/Loader.jsx';



function ProjectsForm() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Access user data from UserContext

  const [srtFiles, setSrtFiles] = useState([]);
  const [infoDocs, setInfoDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);


  const token = Cookies.get('token');



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
    // screeningsInfo: {
    //   screenings: [],
    //   distributors: [],
    // },
    rightsInfo: [],
    userId: user?.userId || '',
  });
  const [errors, setErrors] = useState({
    projectInfoErrors: {},
    submitterInfoErrors: {},
    creditsInfoErrors: {},
    specificationsInfoErrors: {},
    // screeningsErrors: {},
    rightsInfoErrors: {},
  });
  const [isSubmitterInfoVisible, setIsSubmitterInfoVisible] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';

  // useEffect(() => {
  //   console.log('Updated srtFiles:', srtFiles);
  //   console.log('Updated infoDocs:', infoDocs);
  // }, [srtFiles, infoDocs]);

  const handleSrtFileChange = (files) => {
    // console.log('📥 SRT Files received:', files);
    setSrtFiles(files);
    handleCombinedFilesChange(files, infoDocs);
  };

  const handleInfoDocsChange = (files) => {
    // console.log('📥 Info Docs received:', files);
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



  const handleInputChange = useCallback((section, data) => {
    setFormData((prevData) => {
      if (prevData[section] !== data) {
        return {
          ...prevData,
          [section]: { ...prevData[section], ...data },
        };
      }
      return prevData;
    });
  }, []);


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
      // screeningsErrors: {},
      rightsInfoErrors: {},
    };
console.log(tempErrors);

    if (!formData.projectInfo.projectTitle) {
      isValid = false;
      tempErrors.projectInfoErrors.projectTitle = 'Project title is required.';
    }

    // if (formData.screeningsInfo.screenings.length === 0) {
    //   isValid = false;
    //   tempErrors.screeningsErrors.screenings = 'At least one screening is required.';
    // }

    if (!formData.rightsInfo.rights || formData.rightsInfo.rights.length === 0) {
      isValid = false;
      tempErrors.rightsInfoErrors = 'Please select at least one right.';
    }


    setErrors(tempErrors);
    return isValid;
  };


  const transferFileToLocation = async () => {
    const orgName = userData ? userData.orgName : '';
    // const projectFolder = projectName || 'defaultProjectFolder';
    const projectFolder = formData.projectInfo.projectName;

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
      const response = await fetch(`http://localhost:3000/api/folders/transfer-file`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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





  const extractFileNameFromUrl = (url) => {
    if (!url) return '';
    const parts = String(url).split('/');
    return parts[parts.length - 1];
  };
  




  // utils/uploadFilesToS3.js

  const uploadFilesToS3 = async ({ projectPoster, projectBanner, projectTrailer }, projectName, orgName) => {
    console.log('Uploading files with orgName:', orgName);  // Log orgName here to confirm it's passed correctly

    // Check projectBanner content before appending to FormData
    console.log('projectBanner:', projectBanner);
    if (projectBanner) {
      console.log('projectBanner Type:', typeof projectBanner);
    }

    const formData = new FormData();

    if (projectPoster) {
      console.log('Appending projectPoster to formData');
      formData.append('projectPoster', projectPoster);
    }

    if (projectBanner) {
      console.log('Appending projectBanner to formData');
      formData.append('projectBanner', projectBanner);
    }

    if (projectTrailer) {
      console.log('Appending projectTrailer to formData');
      formData.append('projectTrailer', projectTrailer);
    }

    formData.append('projectName', projectName);
    formData.append('orgName', orgName);

    try {
      const response = await fetch('http://localhost:3000/api/files/upload-file', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          
          'Authorization': `Bearer ${token}`, // Authorization header with Bearer token
        },
      });
   
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      console.log('✅ All files uploaded successfully:');
      if (data.projectPosterUrl) {
        console.log('Poster Uploaded:', data.projectPosterUrl.fileName);
        console.log('Poster URL:', data.projectPosterUrl.fileUrl);
      }
      if (data.projectBannerUrl) {
        console.log('Banner Uploaded:', data.projectBannerUrl.fileName);
        console.log('Banner URL:', data.projectBannerUrl.fileUrl);
      }
      if (data.projectTrailerUrl) {
        console.log('Trailer Uploaded:', data.projectTrailerUrl.fileName);
        console.log('Trailer URL:', data.projectTrailerUrl.fileUrl);
      }

      return data;
    } catch (error) {
      console.error('❌ Error uploading files:', error.message);
      throw error;
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFormSubmitted(true);
    setIsUploading(true); // 🔥 Start loader
    console.log('Form submission started');
  
    if (!userData || !userData.orgName) {
      alert('Organization name is not available.');
      setIsUploading(false);
      return;
    }
  
    const orgName = userData.orgName;
    const userId = user?.userId || '';
    const errors = validateForm();
  
    if (errors !== true) {
      const errorMessages = Object.entries(errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
  
      alert('Form validation failed:\n' + errorMessages);
      setIsUploading(false);
      return;
    }
  
    try {
      // Uploading files
      const { projectPoster, projectBanner, trailerFile: projectTrailer, projectName, orgName: organizationName } = formData.projectInfo;
      const shouldUploadPoster = formData.projectInfo.posterOption === 'upload' && projectPoster;
      const shouldUploadBanner = formData.projectInfo.bannerOption === 'upload' && projectBanner;
      const shouldUploadTrailer = formData.projectInfo.trailerOption === 'upload' && projectTrailer;
  
      let uploadedFiles = {};
      if (shouldUploadPoster || shouldUploadBanner || shouldUploadTrailer) {
        const orgNameToUse = organizationName || orgName;
  
        uploadedFiles = await uploadFilesToS3(
          {
            projectPoster: shouldUploadPoster ? projectPoster : null,
            projectBanner: shouldUploadBanner ? projectBanner : null,
            projectTrailer: shouldUploadTrailer ? projectTrailer : null,
          },
          projectName,
          orgNameToUse
        );
  
        if (uploadedFiles.projectPosterUrl) formData.projectInfo.s3SourcePosterUrl = uploadedFiles.projectPosterUrl;
        if (uploadedFiles.projectBannerUrl) formData.projectInfo.s3SourceBannerUrl = uploadedFiles.projectBannerUrl;
        if (uploadedFiles.projectTrailerUrl) formData.projectInfo.s3SourceTrailerUrl = uploadedFiles.projectTrailerUrl;
      } else {
        // URLs fallback
        const { posterUrl, bannerUrl, trailerUrl } = formData.projectInfo;
        if (posterUrl) formData.projectInfo.s3SourcePosterUrl = posterUrl;
        if (bannerUrl) formData.projectInfo.s3SourceBannerUrl = bannerUrl;
        if (trailerUrl) formData.projectInfo.s3SourceTrailerUrl = trailerUrl;
      }
  
      // Form submission
      const updatedFormData = {
        projectInfo: {
          ...formData.projectInfo,
          projectName,
          userId,
          posterFileName: extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl),
          bannerFileName: extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl),
          trailerFileName: extractFileNameFromUrl(formData.projectInfo.s3SourceTrailerUrl),
          movieFileName: formData.projectInfo.movieFileName || ''
        },
        creditsInfo: { ...formData.creditsInfo, projectName, userId },
        specificationsInfo: { ...formData.specificationsInfo, projectName, userId },
        rightsInfo: { ...formData.rightsInfo, projectName, userId },
        srtInfo: {
          srtFiles: formData.srtInfo.map(pair => pair.srtFile),
          infoDocuments: formData.srtInfo.map(pair => pair.infoDocFile),
          projectName,
          userId
        }
      };
  
      const response = await fetch('http://localhost:3000/api/projectForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(updatedFormData),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
  
      dispatch(setProjectFolderSuccess(projectName));
      alert('✅ Project saved successfully!');
  
      const transferResult = await transferFileToLocation();
      if (transferResult.success) {
        alert('✅ File transfer successful!');
        navigate('/showcase-projects');
      } else {
        alert(`⚠️ File transfer failed: ${transferResult.error}`);
        navigate('/projects-form');
      }
  
    } catch (error) {
      console.error('❌ Error during submission:', error);
      alert('Error saving project: ' + error.message);
      dispatch(setProjectFolderFailure(error));
    } finally {
      setIsUploading(false); // 🔁 End loader
    }
  };
  



  return (
    <form className="container-fluid projects-form-container">
      {isUploading && <Loader />} 
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

      </div>

      <button type="submit" to="/showcase-projects" className="save-button" onClick={handleSubmit}>
        Save Project
      </button>
    </form>
  );
}

export default ProjectsForm;
