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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





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

  const handleRightsChange = (rightsDataArray) => {
    setFormData((prevState) => ({
      ...prevState,
      rightsInfo: {
        rights: rightsDataArray, // wrap in object under `rights`
      },
    }));
  };


  const [shownErrorToasts, setShownErrorToasts] = useState(new Set());
  const validateForm = () => {
    let isValid = true;

    const tempErrors = {
      projectInfoErrors: {},
      submitterInfoErrors: {},
      creditsInfoErrors: {},
      specificationsInfoErrors: {},
      rightsInfoErrors: {},
    };

    // Use a local Set to track which toast errors have been shown during this validation run
    const shownErrorToastsLocal = new Set();

    const showErrorToast = (key, message) => {
      if (!shownErrorToastsLocal.has(key)) {
        toast.error(message);
        shownErrorToastsLocal.add(key);
      }
    };

    // === Validate Project Info ===
    if (!formData.projectInfo.projectTitle) {
      showErrorToast('projectTitle', 'Project title is required');
      tempErrors.projectInfoErrors.projectTitle = 'Project title is required.';
      isValid = false;
    }

    // === Validate Specifications ===
    const spec = formData.specificationsInfo;

    if (!spec.genres || !Array.isArray(spec.genres) || spec.genres.length === 0) {
      showErrorToast('genres', 'Genre is required');
      tempErrors.specificationsInfoErrors.genres = 'Genre is required.';
      isValid = false;
    }

    if (!spec.completionDate) {
      showErrorToast('yearOfRelease', 'Year of Release is required');
      tempErrors.specificationsInfoErrors.completionDate = 'Year of Release is required.';
      isValid = false;
    }

    if (!spec.language) {
      showErrorToast('language', 'Language is required');
      tempErrors.specificationsInfoErrors.language = 'Language is required.';
      isValid = false;
    }

    if (!spec.projectType) {
      showErrorToast('projectType', 'Title Type is required');
      tempErrors.specificationsInfoErrors.projectType = 'Title Type is required.';
      isValid = false;
    }

    // === Validate Rights Info ===
    const rightsBlocks = formData.rightsInfo?.rights;

    if (!rightsBlocks || rightsBlocks.length === 0) {
      showErrorToast('rights', 'At least one Right block must be selected');
      tempErrors.rightsInfoErrors.rights = 'At least one Right block must be selected.';
      isValid = false;
    } else {
      rightsBlocks.forEach((block, index) => {
        if (!block.rights || block.rights.length === 0) {
          showErrorToast(`rights_${index}`, `At least one Right is required in block #${index + 1}`);
          tempErrors.rightsInfoErrors[`rights_${index}`] = `At least one Right is required in block #${index + 1}`;
          isValid = false;
        }
        if (!block.territories || block.territories.length === 0) {
          showErrorToast(`territories_${index}`, `At least one Territory is required in block #${index + 1}`);
          tempErrors.rightsInfoErrors[`territories_${index}`] = `At least one Territory is required in block #${index + 1}`;
          isValid = false;
        }
      });
    }

    // Update error state
    setErrors(tempErrors);

    // Optionally update React state if you want to keep shownErrorToasts for other logic
    setShownErrorToasts(shownErrorToastsLocal);

    return isValid;
  };







  // const extractFileNameFromUrl = (url) => {
  //   if (!url) return '';
  //   const parts = String(url).split('/');
  //   return parts[parts.length - 1];
  // };

  const extractFileNameFromUrl = (url = '') => {
  try {
    return decodeURIComponent(url.split('/').pop().split('?')[0]);
  } catch {
    return '';
  }
};


const transferFileToLocation = async () => {
  const { orgName } = user.user;
  const projectFolder = formData.projectInfo.projectName;

  const posterFileUrl = formData.projectInfo.s3SourcePosterUrl;
  const bannerFileUrl = formData.projectInfo.s3SourceBannerUrl;
  const trailerFileUrl = formData.projectInfo.s3SourceTrailerUrl;
  const movieFileUrl = formData.projectInfo.s3SourceMovieUrl;

  const infoDocUrlsToTransfer = (formData.projectInfo.s3SourceInfoDocs || []).filter(Boolean);

  const srtFilesToTransfer = (formData.srtFiles || []).filter(entry =>
    entry.srtUrl
  ).map(entry => ({
    language: entry.language,
    srtUrl: entry.srtUrl
  }));

  const dubbedFilesToTransfer = Array.isArray(formData.dubbedFiles)
    ? formData.dubbedFiles.filter(entry =>
        entry.dubbedTrailerUrl || entry.dubbedSubtitleUrl
      ).map(entry => ({
        language: entry.language,
        dubbedTrailerUrl: entry.dubbedTrailerUrl || '',
        dubbedSubtitleUrl: entry.dubbedSubtitleUrl || ''
      }))
    : [];

  try {
    const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        orgName,
        projectFolder,
        posterFileUrl,
        bannerFileUrl,
        trailerFileUrl,
        movieFileUrl,
        dubbedFiles: dubbedFilesToTransfer,
        infoDocs: infoDocUrlsToTransfer,
        srtFiles: srtFilesToTransfer,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ File transfers completed successfully:', result.message);
      return {
        success: true,
        message: result.message,
        dubbedFiles: result.dubbedFiles,
        srtFiles: result.srtFiles,
        infoDocs: result.infoDocs,
      };
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
//   const { orgName } = user.user;
//   const projectFolder = formData.projectInfo.projectName;

//   const posterFileUrl = formData.projectInfo.s3SourcePosterUrl;
//   const bannerFileUrl = formData.projectInfo.s3SourceBannerUrl;
//   const trailerFileUrl = formData.projectInfo.s3SourceTrailerUrl;
//   const movieFileUrl = formData.projectInfo.s3SourceMovieUrl;

//   // 🟦 Info Docs
//   const infoDocUrlsToTransfer = (formData.projectInfo.s3SourceInfoDocs || []).filter(Boolean);

//   // 🟨 Subtitle Tracks (e.g., English, Hindi — not dubbed)
//   const srtFilesToTransfer = (formData.srtFiles || []).filter(entry =>
//     entry.srtUrl
//   ).map(entry => ({
//     language: entry.language,
//     srtUrl: entry.srtUrl
//   }));

//   // 🟥 Dubbed Trailer + Subtitle
//  const dubbedFilesToTransfer = Array.isArray(formData.dubbedFiles)
//   ? formData.dubbedFiles.filter(entry =>
//       entry.dubbedTrailerUrl || entry.dubbedSubtitleUrl
//     ).map(entry => ({
//       language: entry.language,
//       dubbedTrailerUrl: entry.dubbedTrailerUrl || '',
//       dubbedSubtitleUrl: entry.dubbedSubtitleUrl || ''
//     }))
//   : [];


//   if (!accessKeyId || !secretAccessKey) {
//     console.error("Access keys are missing!");
//     return { success: false, error: "Missing access keys" };
//   }

//   try {
//     const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({
//         orgName,
//         projectFolder,
//         posterFileUrl,
//         bannerFileUrl,
//         trailerFileUrl,
//         movieFileUrl,
//         dubbedFiles: dubbedFilesToTransfer,
//         infoDocs: infoDocUrlsToTransfer,
//         srtFiles: srtFilesToTransfer,
//         accessKeyId,
//         secretAccessKey,
//       }),
//     });

//     const result = await response.json();

//     if (response.ok) {
//       console.log('✅ File transfers completed successfully:', result.message);
//       return {
//         success: true,
//         message: result.message,
//         dubbedFiles: result.dubbedFiles,
//         srtFiles: result.srtFiles,
//         infoDocs: result.infoDocs,
//       };
//     } else {
//       console.error('❌ File transfer failed:', result.error);
//       return { success: false, error: result.error || 'Unknown error from server' };
//     }
//   } catch (error) {
//     console.error('❗ Error during file transfer:', error);
//     return { success: false, error: error.message };
//   }
// };




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


  const convertS3UriToHttpUrl = (s3Uri) => {
    if (!s3Uri.startsWith('s3://')) return s3Uri; // not a URI — already an object URL
    const [, bucketAndKey] = s3Uri.split('s3://');
    const [bucket, ...keyParts] = bucketAndKey.split('/');
    const key = keyParts.join('/');
    return `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;
  };

  

  const normalizeS3Url = (url) => {
    if (!url) return '';
    if (url.startsWith('s3://')) {
      const [, rest] = url.split('s3://');
      const [bucket, ...keyParts] = rest.split('/');
      const key = keyParts.join('/');
      return `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;
    }
    return url; // already object URL or external URL
  };

  const convertS3ToHttpsUrl = (s3Url) => {
  if (!s3Url.startsWith('s3://')) return s3Url;

  const withoutPrefix = s3Url.slice(5); // remove "s3://"
  const parts = withoutPrefix.split('/');
  const bucket = parts.shift();
  const key = parts.join('/');

  return `https://${bucket}.s3.amazonaws.com/${key}`;
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
  const isValid = validateForm();
  if (!isValid) {
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

    // Process dubbed files
    let dubbedFilesArray = Array.isArray(formData.dubbedFiles)
      ? formData.dubbedFiles
      : typeof formData.dubbedFiles === 'object'
        ? Object.values(formData.dubbedFiles).filter(item => typeof item === 'object' && item.language)
        : [];

    // Process SRT/infoDocs
    let srtFilesArray = [];
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
    }

    // ====== NEW UNIFIED URL/UPLOAD NORMALIZATION ======

    // For Poster
    if (formData.projectInfo.posterOption === 'upload' && uploadedFiles.projectPosterUrl) {
      formData.projectInfo.s3SourcePosterUrl = normalizeS3Url(uploadedFiles.projectPosterUrl);
      formData.projectInfo.posterFileName = extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl);
    } else if (formData.projectInfo.posterOption === 'url' && formData.projectInfo.projectPosterUrl) {
      formData.projectInfo.s3SourcePosterUrl = normalizeS3Url(formData.projectInfo.projectPosterUrl);
      formData.projectInfo.posterFileName = extractFileNameFromUrl(formData.projectInfo.s3SourcePosterUrl);
    } else {
      formData.projectInfo.s3SourcePosterUrl = '';
      formData.projectInfo.posterFileName = '';
    }

    // For Banner
    if (formData.projectInfo.bannerOption === 'upload' && uploadedFiles.projectBannerUrl) {
      formData.projectInfo.s3SourceBannerUrl = normalizeS3Url(uploadedFiles.projectBannerUrl);
      formData.projectInfo.bannerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl);
    } else if (formData.projectInfo.bannerOption === 'url' && formData.projectInfo.projectBannerUrl) {
      formData.projectInfo.s3SourceBannerUrl = normalizeS3Url(formData.projectInfo.projectBannerUrl);
      formData.projectInfo.bannerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceBannerUrl);
    } else {
      formData.projectInfo.s3SourceBannerUrl = '';
      formData.projectInfo.bannerFileName = '';
    }

    // For Trailer
// For Trailer
if (formData.projectInfo.trailerOption === 'upload' && uploadedFiles.projectTrailerUrl) {
  formData.projectInfo.s3SourceTrailerUrl = convertS3ToHttpsUrl(uploadedFiles.projectTrailerUrl);
  formData.projectInfo.trailerFileName = extractFileNameFromUrl(formData.projectInfo.s3SourceTrailerUrl);
} else if (formData.projectInfo.trailerOption === 'url' && formData.projectInfo.trailerUrl) {
  const httpsUrl = convertS3ToHttpsUrl(formData.projectInfo.trailerUrl);
  formData.projectInfo.projectTrailerS3Url = httpsUrl;
  formData.projectInfo.trailerFileName = extractFileNameFromUrl(httpsUrl);
}



    // =====================================================

    // Clean and normalize SRT info
    const cleanSrtInfo = {
      srtFiles: (uploadedFiles?.srtFiles || []).map(file => ({
        ...file,
        srtFileUrl: normalizeS3Url(file.srtFileUrl)
      })),
      infoDocuments: (uploadedFiles?.infoDocuments || []).map(doc => ({
        ...doc,
        infoDocFileUrl: normalizeS3Url(doc.infoDocFileUrl)
      })),
      projectName,
      userId
    };

    // Normalize dubbed file data whether from upload or S3 input
    const cleanedDubbedFiles = dubbedFilesArray.map(file => ({
      language: file.language,
      dubbedTrailerFileName: extractFileNameFromUrl(file.dubbedTrailerUrl),
      dubbedTrailerUrl: normalizeS3Url(file.dubbedTrailerUrl),
      dubbedSubtitleFileName: extractFileNameFromUrl(file.dubbedSubtitleUrl),
      dubbedSubtitleUrl: normalizeS3Url(file.dubbedSubtitleUrl),
    }));

    // Final payload
    const updatedFormData = {
      projectInfo: {
        ...formData.projectInfo,
        projectName,
        userId,
        posterFileName: formData.projectInfo.posterFileName,
        projectPosterS3Url: normalizeS3Url(formData.projectInfo.s3SourcePosterUrl),
        bannerFileName: formData.projectInfo.bannerFileName,
        projectBannerS3Url: normalizeS3Url(formData.projectInfo.s3SourceBannerUrl),
        trailerFileName: formData.projectInfo.trailerFileName,
       projectTrailerS3Url: formData.projectInfo.projectTrailerS3Url || normalizeS3Url(formData.projectInfo.s3SourceTrailerUrl),

        movieFileName: formData.projectInfo.movieFileName || ''
      },
      creditsInfo: { ...formData.creditsInfo, projectName, userId },
      specificationsInfo: { ...formData.specificationsInfo, projectName, userId },
      rightsInfo: {
        rights: formData.rightsInfo.rights || [],
        projectName,
        userId
      },
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
    if (!transferResult.success || transferResult.error) {
      console.warn('⚠️ Partial or failed transfer:', transferResult);
      alert(`⚠️ File transfer failed: ${transferResult.error || 'Some files may not have been transferred.'}`);
    } else {
      alert('✅ File transfer successful!');
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
    <>
      <div style={{ position: 'absolute' }}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
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

        <button
          type="submit"
          className="save-button"
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? 'Saving...' : 'Save Project'}
        </button>





      </form>
    </>
  );
}

export default ProjectsForm;
