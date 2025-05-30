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
import DubbedFiles from './Formcomponents/DubbedFiles.jsx';



function ProjectsForm() {

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orgName } = user.user;

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
  console.log("form data from specs:", formData)

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


  useEffect(() => {
    console.log('Updated srtFiles:', srtFiles);
    console.log('Updated infoDocs:', infoDocs);
  }, [srtFiles, infoDocs]);

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
    console.log("📥 Inside handleInputChange:", section, data);

    setFormData((prevData) => {
      // Update the form data with the new data
      const updatedSection = { ...prevData[section], ...data };
      const updatedFormData = {
        ...prevData,
        [section]: updatedSection,
      };

      // If we're updating projectInfo, log the poster, banner, and trailer URLs
      if (section === "projectInfo") {
        const posterUrl = updatedSection.projectPosterUrl || updatedSection.posterUrl;
        const bannerUrl = updatedSection.projectBannerUrl || updatedSection.bannerUrl;
        const trailerUrl = updatedSection.projectTrailerUrl || updatedSection.trailerUrl;

        // Log the URLs if they exist
        if (posterUrl) {
          console.log("🎞️ Poster URL:", posterUrl);
        }
        if (bannerUrl) {
          console.log("🖼️ Banner URL:", bannerUrl);
        }
        if (trailerUrl) {
          console.log("🎬 Trailer URL:", trailerUrl);
        }
      }

      return updatedFormData;
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

    // if (!formData.rightsInfo.rights || formData.rightsInfo.rights.length === 0) {
    //   isValid = false;
    //   tempErrors.rightsInfoErrors = 'Please select at least one right.';
    // }


    setErrors(tempErrors);
    return isValid;
  };







  const extractFileNameFromUrl = (url) => {
    if (!url) return '';
    const parts = String(url).split('/');
    return parts[parts.length - 1];
  };


  const transferFileToLocation = async () => {
    const { orgName } = user.user;
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
      const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
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


  // utils/uploadFilesToS3.js

const uploadFilesToS3 = async (
  {
    projectPoster,
    projectBanner,
    projectTrailer,
    dubbedFiles = [],
    srtFiles = []
  },
  projectName,
  orgName,
  userId // ✅ Accept userId here
) => {
  const formData = new FormData();

  // Append main assets
  if (projectPoster) formData.append('projectPoster', projectPoster);
  if (projectBanner) formData.append('projectBanner', projectBanner);
  if (projectTrailer) formData.append('projectTrailer', projectTrailer);

  // Append dubbed files
  dubbedFiles.forEach((entry, index) => {
    const { language, dubbedTrailerFile, dubbedSubtitleFile } = entry;

    if (dubbedTrailerFile) {
      formData.append(`dubbedTrailer_${index}`, dubbedTrailerFile);
      formData.append(`dubbedTrailerLang_${index}`, language);
    }

    if (dubbedSubtitleFile) {
      formData.append(`dubbedSubtitle_${index}`, dubbedSubtitleFile);
      formData.append(`dubbedSubtitleLang_${index}`, language);
    }
  });

  // Append SRT and infoDoc files
  srtFiles.forEach((entry, index) => {
    const { srtFile, infoDocFile } = entry;

    if (srtFile) {
      formData.append(`srtFile_${index}`, srtFile);
    }

    if (infoDocFile) {
      formData.append(`infoDocFile_${index}`, infoDocFile);
    }
  });

  // Meta
  formData.append('projectName', projectName);
  formData.append('orgName', orgName);
  formData.append('userId', userId); // ✅ Append userId

  const response = await fetch('https://www.mediashippers.com/api/files/upload-file', {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return await response.json();
};


const handleSubmit = async (event) => {
  event.preventDefault();
  setIsFormSubmitted(true);
  setIsUploading(true);
  console.log('Form submission started');

  if (!orgName) {
    alert('Organization name is not available.');
    setIsUploading(false);
    return;
  }

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

  const {
    projectPoster,
    projectBanner,
    trailerFile: projectTrailer,
    projectName,
    orgName: organizationName
  } = formData.projectInfo;

  const shouldUploadPoster = formData.projectInfo.posterOption === 'upload' && projectPoster;
  const shouldUploadBanner = formData.projectInfo.bannerOption === 'upload' && projectBanner;
  const shouldUploadTrailer = formData.projectInfo.trailerOption === 'upload' && projectTrailer;

  try {
    let uploadedFiles = {};
    const orgNameToUse = organizationName || orgName;

    // ✅ Normalize dubbed files
    let dubbedFilesArray = [];
    if (Array.isArray(formData.dubbedFiles)) {
      dubbedFilesArray = formData.dubbedFiles;
    } else if (typeof formData.dubbedFiles === 'object') {
      dubbedFilesArray = Object.values(formData.dubbedFiles).filter(
        (item) => typeof item === 'object' && item.language
      );
    }

    // ✅ Normalize SRT files
    let srtFilesArray = [];
    console.log("🐛 Raw srtInfo value in formData:", formData.srtInfo);

    if (Array.isArray(formData.srtInfo)) {
      srtFilesArray = formData.srtInfo
        .map((entry) => ({
          language: entry.language,
          srtFile: entry.srtFile,
          infoDocFile: entry.infoDocFile,
        }))
        .filter(item => item.srtFile || item.infoDocFile);
    } else if (
      formData.srtInfo &&
      (Array.isArray(formData.srtInfo.srtFiles) || Array.isArray(formData.srtInfo.infoDocuments))
    ) {
      const srt = formData.srtInfo;
      srtFilesArray = [];

      if (Array.isArray(srt.srtFiles)) {
        srtFilesArray.push(
          ...srt.srtFiles.map(f => ({
            language: f.language || '',
            srtFile: f,
            infoDocFile: null,
          }))
        );
      }

      if (Array.isArray(srt.infoDocuments)) {
        srt.infoDocuments.forEach((doc, i) => {
          if (srtFilesArray[i]) {
            srtFilesArray[i].infoDocFile = doc;
          } else {
            srtFilesArray.push({ language: '', srtFile: null, infoDocFile: doc });
          }
        });
      }
    }

    // ✅ Upload files
    if (
      shouldUploadPoster ||
      shouldUploadBanner ||
      shouldUploadTrailer ||
      dubbedFilesArray.length > 0 ||
      srtFilesArray.length > 0
    ) {
      uploadedFiles = await uploadFilesToS3(
        {
          projectPoster: shouldUploadPoster ? projectPoster : null,
          projectBanner: shouldUploadBanner ? projectBanner : null,
          projectTrailer: shouldUploadTrailer ? projectTrailer : null,
          dubbedFiles: dubbedFilesArray,
          srtFiles: srtFilesArray
        },
        projectName,
        orgNameToUse,
        userId
      );

      if (uploadedFiles.projectPosterUrl)
        formData.projectInfo.s3SourcePosterUrl = uploadedFiles.projectPosterUrl;

      if (uploadedFiles.projectBannerUrl)
        formData.projectInfo.s3SourceBannerUrl = uploadedFiles.projectBannerUrl;

      if (uploadedFiles.projectTrailerUrl)
        formData.projectInfo.s3SourceTrailerUrl = uploadedFiles.projectTrailerUrl;
    } else {
      const { posterUrl, bannerUrl, trailerUrl } = formData.projectInfo;

      if (posterUrl) formData.projectInfo.s3SourcePosterUrl = posterUrl;
      if (bannerUrl) formData.projectInfo.s3SourceBannerUrl = bannerUrl;
      if (trailerUrl) formData.projectInfo.s3SourceTrailerUrl = trailerUrl;
    }

    // ✅ Clean SRT info for backend
   const cleanSrtInfo = {
  srtFiles: uploadedFiles?.srtFiles || [],
  infoDocuments: uploadedFiles?.infoDocuments || [],
  projectName,
  userId
};


    // ✅ Clean dubbed files
    const cleanedDubbedFiles = dubbedFilesArray.map(file => ({
      language: file.language,
      dubbedTrailerFileName: file.dubbedTrailerFileName,
      dubbedTrailerUrl: file.dubbedTrailerUrl,
      dubbedSubtitleFileName: file.dubbedSubtitleFileName,
      dubbedSubtitleUrl: file.dubbedSubtitleUrl,
    }));

    // ✅ Final payload
    const updatedFormData = {
      projectInfo: {
        ...formData.projectInfo,
        projectName,
        userId,
        posterFileName: extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl),
        projectPosterS3Url: formData.projectInfo.s3SourcePosterUrl,
        bannerFileName: extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl),
        projectBannerS3Url: formData.projectInfo.s3SourceBannerUrl,
        trailerFileName: extractFileNameFromUrl(formData.projectInfo.s3SourceTrailerUrl),
        trailerUrl: formData.projectInfo.s3SourceTrailerUrl,
        movieFileName: formData.projectInfo.movieFileName || ''
      },
      creditsInfo: { ...formData.creditsInfo, projectName, userId },
      specificationsInfo: { ...formData.specificationsInfo, projectName, userId },
      rightsInfo: { ...formData.rightsInfo, projectName, userId },
      srtInfo: { srtInfo: cleanSrtInfo },
      dubbedFiles: cleanedDubbedFiles
    };

    console.log('✅ Submitting full form data:', updatedFormData);

    const response = await fetch('https://www.mediashippers.com/api/projectForm', {
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
    } else {
      alert(`⚠️ File transfer failed: ${transferResult.error}`);
      navigate('/projects-form');
    }

  } catch (error) {
    console.error('❌ Error during submission:', error);
    alert('Error saving project: ' + error.message);
    dispatch(setProjectFolderFailure({
      message: error.message,
      name: error.name,
      stack: error.stack,
    }));
  } finally {
    setIsUploading(false);
  }
};









  return (
    <form className="container-fluid projects-form-container">
      {isUploading && <Loader />}
      <div className='text-white'>
        {/* <h1>{user.userId}</h1>
    
        <h1>{orgName}</h1> */}


        {/* <div className='text-white'>
          <h2>Project Name: {projectName}</h2>
          <h3>Movie Name: {movieName}</h3>
        </div> */}

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
          setFormData={setFormData}
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
          orgName={user?.user?.orgName}
          projectName={formData.projectInfo.projectName || formData.projectInfo.projectTitle}
          projectInfo={formData.projectInfo}
          language={formData.specificationsInfo.language || 'unknown_language'} // add if you track language somewhere
        />


        <DubbedFiles
          onInputChange={(data) => handleInputChange('dubbedFiles', data)}
          formData={formData.dubbedFiles}
          setFormData={setFormData}
          errors={isFormSubmitted ? errors.dubbedFilesErrors : {}}
          setDubbedFilesErrors={(errors) =>
            setErrors((prev) => ({
              ...prev,
              dubbedFilesErrors: errors,
            }))
          }
          orgName={user?.user?.orgName}
          projectName={formData.projectInfo.projectName || formData.projectInfo.projectTitle}
          projectInfo={formData.projectInfo}
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
