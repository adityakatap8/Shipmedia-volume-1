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

  const accessKeyId = import.meta.env.VITE_ACCESS_KEY_ID || '';
  const secretAccessKey = import.meta.env.VITE_SECRET_ACCESS_KEY || '';



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
      const updatedSection = { ...prevData[section], ...data };
      const updatedFormData = {
        ...prevData,
        [section]: updatedSection,
      };

      if (section === "projectInfo") {
        const posterUrl = updatedSection.projectPosterUrl || updatedSection.posterUrl;
        const bannerUrl = updatedSection.projectBannerUrl || updatedSection.bannerUrl;
        const trailerUrl = updatedSection.projectTrailerUrl || updatedSection.trailerUrl;

        if (posterUrl) {
          console.log("🎞️ Poster URL:", posterUrl);
        }
        if (bannerUrl) {
          console.log("🖼️ Banner URL:", bannerUrl);
        }
        if (trailerUrl) {
          console.log("🎬 Trailer URL:", trailerUrl);
        }

        // ✅ Poster Source and Destination
        if (updatedSection.s3SourcePosterUrl) {
          console.log("🎞️ Poster Source:", updatedSection.s3SourcePosterUrl);
        }
        if (updatedSection.projectPosterS3Url) {
          console.log("📦 Poster Destination:", updatedSection.projectPosterS3Url);
        }

        // ✅ Banner Source and Destination
        if (updatedSection.s3SourceBannerUrl) {
          console.log("🖼️ Banner Source:", updatedSection.s3SourceBannerUrl);
        }
        if (updatedSection.projectBannerS3Url) {
          console.log("📦 Banner Destination:", updatedSection.projectBannerS3Url);
        }

        // ✅ Trailer Source and Destination
        if (updatedSection.s3SourceTrailerUrl) {
          console.log("🎬 Trailer Source:", updatedSection.s3SourceTrailerUrl);
        }
        if (updatedSection.projectTrailerS3Url) {
          console.log("📦 Trailer Destination:", updatedSection.projectTrailerS3Url);
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











  const extractFileNameFromUrl = (url) => {
    if (!url) return '';
    const parts = String(url).split('/');
    return parts[parts.length - 1];
  };

  const convertS3UriToHttps = (s3Uri) => {
    if (!s3Uri || !s3Uri.startsWith('s3://')) return s3Uri;

    const [, bucketAndPath] = s3Uri.split('s3://');
    const [bucket, ...keyParts] = bucketAndPath.split('/');

    // Encode each path segment individually, not the slashes
    const encodedKey = keyParts.map(encodeURIComponent).join('/');

    return `https://${bucket}.s3.amazonaws.com/${encodedKey}`;
  };

  // Define normalizeUrl once
  const normalizeUrl = (sourceUrl) => {
    console.log('🌐 Original URL:', sourceUrl);

    if (!sourceUrl) return '';

    let normalizedSourceUrl = sourceUrl;

    if (sourceUrl.startsWith('s3://')) {
      // Convert raw S3 URI to HTTPS
      const [, path] = sourceUrl.split('s3://');
      const [bucket, ...keyParts] = path.split('/');
      const encodedPath = keyParts.map(encodeURIComponent).join('/');
      normalizedSourceUrl = `https://${bucket}.s3.amazonaws.com/${encodedPath}`;
    } else if (sourceUrl.startsWith('https://')) {
      try {
        const url = new URL(sourceUrl);

        // ✅ Check if path is already encoded
        const decodedPath = decodeURIComponent(url.pathname);
        const isAlreadyEncoded = url.pathname !== decodedPath;

        if (isAlreadyEncoded) {
          console.log('⚠️ Skipping normalization — already encoded:', sourceUrl);
          return sourceUrl;
        }

        const pathParts = url.pathname.split('/').map(encodeURIComponent);
        normalizedSourceUrl = `${url.origin}/${pathParts.join('/')}`;
      } catch (e) {
        console.error('❌ Failed to parse URL:', sourceUrl);
        return sourceUrl;
      }
    }

    console.log('✅ Normalized HTTPS URL:', normalizedSourceUrl);
    return normalizedSourceUrl;
  };


  // Use normalizeUrl inside transferFileToLocation
  // const transferFileToLocation = async () => {
  //   const { orgName } = user.user;
  //   const projectFolder = formData.projectInfo.projectName;

  //   // SOURCE URLs (from formData)
  //   const posterSourceUrl = formData.projectInfo.s3SourcePosterUrl; // source s3://
  //   const bannerSourceUrl = formData.projectInfo.s3SourceBannerUrl;
  //   const trailerSourceUrl = formData.projectInfo.s3SourceTrailerUrl;
  //   const movieSourceUrl = formData.projectInfo.s3SourceMovieUrl;

  //   // DESTINATION URLs (you build these based on orgName/projectFolder)
  //   const posterDestUrl = formData.projectInfo.projectPosterS3Url; // destination s3://
  //   const bannerDestUrl = formData.projectInfo.projectBannerS3Url;
  //   const trailerDestUrl = formData.projectInfo.projectTrailerS3Url;
  //   const movieDestUrl = formData.projectInfo.projectMovieS3Url;

  //   try {
  //     const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         files: [
  //           { sourceUrl: posterSourceUrl, destinationUrl: posterDestUrl, fileType: 'film stills' },
  //           { sourceUrl: bannerSourceUrl, destinationUrl: bannerDestUrl, fileType: 'film stills' },
  //           { sourceUrl: trailerSourceUrl, destinationUrl: trailerDestUrl, fileType: 'trailer' },
  //           { sourceUrl: movieSourceUrl, destinationUrl: movieDestUrl, fileType: 'movie' },
  //         ].filter(file => file.sourceUrl && file.destinationUrl), // filter out empty
  //         orgName,
  //         projectFolder,
  //       }),
  //     });

  //     const result = await response.json();

  //     if (!response.ok || result.success === false || (result.errors && result.errors.length > 0)) {
  //       const errorMessages = (result.errors || []).map(err => `${err.fileType}: ${err.error}`).join('\n') || result.error || 'File transfer failed.';
  //       alert(`❌ Some files failed to transfer:\n${errorMessages}`);
  //       return { success: false, fullResult: result };
  //     }

  //     alert('✅ All files transferred successfully.');
  //     return { success: true, fullResult: result };

  //   } catch (error) {
  //     console.error('❌ Transfer failed:', error);
  //     alert(`❌ Fatal error: ${error.message}`);
  //     return { success: false, error: error.message };
  //   }
  // };

  const transferFileToLocation = async () => {
    const { orgName } = user.user;
    const projectFolder = formData.projectInfo.projectName;

    const filesToTransfer = [
      { sourceUrl: formData.projectInfo.s3SourcePosterUrl, destinationUrl: formData.projectInfo.projectPosterS3Url, fileType: 'film stills' },
      { sourceUrl: formData.projectInfo.s3SourceBannerUrl, destinationUrl: formData.projectInfo.projectBannerS3Url, fileType: 'film stills' },
      { sourceUrl: formData.projectInfo.s3SourceTrailerUrl, destinationUrl: formData.projectInfo.projectTrailerS3Url, fileType: 'trailer' },
      { sourceUrl: formData.projectInfo.s3SourceMovieUrl, destinationUrl: formData.projectInfo.projectMovieS3Url, fileType: 'movie' },
    ].filter(file => file.sourceUrl && file.destinationUrl);

    try {
      const response = await fetch(`https://www.mediashippers.com/api/folders/transfer-file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ files: filesToTransfer, orgName, projectFolder }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        return { success: false, fullResult: result };
      }

      return { success: true, fullResult: result };
    } catch (error) {
      console.error('Transfer failed:', error);
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
    userId
  ) => {
    console.log('Uploading to S3 with the following parameters:');
    console.log('Project Poster:', projectPoster);
    console.log('Project Banner:', projectBanner);
    console.log('Project Trailer:', projectTrailer);
    console.log('Dubbed Files:', dubbedFiles);
    console.log('SRT Files:', srtFiles);
    console.log('Project Name:', projectName);
    console.log('Organization Name:', orgName);
    console.log('User ID:', userId);

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
    formData.append('userId', userId);

    try {
      const response = await fetch('https://www.mediashippers.com/api/files/upload-file', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('S3 Upload Response:', response);

      if (!response.ok) {
        const err = await response.text();
        console.error('Error from S3 upload:', err);
        throw new Error(err);
      }

      const result = await response.json();
      console.log('S3 Upload Result:', result);
      return result;
    } catch (error) {
      console.error('Error during S3 upload:', error);
      throw error;
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setIsFormSubmitted(true);
  //   setIsUploading(true);
  //   console.log('Form submission started');

  //   if (!orgName) {
  //     alert('Organization name is not available.');
  //     setIsUploading(false);
  //     return;
  //   }

  //   const userId = user?.userId || '';
  //   const isValid = validateForm();

  //   if (!isValid) {
  //     console.error('Form validation failed:', errors);
  //     setIsUploading(false);
  //     return;
  //   }

  //   const {
  //     projectPoster,
  //     projectBanner,
  //     trailerFile: projectTrailer,
  //     projectName,
  //     orgName: organizationName,
  //   } = formData.projectInfo;

  //   const shouldUploadPoster = formData.projectInfo.posterOption === 'upload' && projectPoster;
  //   const shouldUploadBanner = formData.projectInfo.bannerOption === 'upload' && projectBanner;
  //   const shouldUploadTrailer = formData.projectInfo.trailerOption === 'upload' && projectTrailer;

  //   try {
  //     let uploadedFiles = {};
  //     const orgNameToUse = organizationName || orgName;

  //     let dubbedFilesArray = Array.isArray(formData.dubbedFiles)
  //       ? formData.dubbedFiles
  //       : Object.values(formData.dubbedFiles || {}).filter(
  //         (item) => typeof item === 'object' && item.language
  //       );

  //     let srtFilesArray = [];
  //     const srt = formData.srtInfo;

  //     if (Array.isArray(srt)) {
  //       srtFilesArray = srt.map((entry) => ({
  //         language: entry.language,
  //         srtFile: entry.srtFile,
  //         infoDocFile: entry.infoDocFile,
  //       })).filter((item) => item.srtFile || item.infoDocFile);
  //     } else if (srt) {
  //       if (Array.isArray(srt.srtFiles)) {
  //         srtFilesArray.push(...srt.srtFiles.map((f) => ({
  //           language: f.language || '',
  //           srtFile: f,
  //           infoDocFile: null,
  //         })));
  //       }
  //       if (Array.isArray(srt.infoDocuments)) {
  //         srt.infoDocuments.forEach((doc, i) => {
  //           if (srtFilesArray[i]) {
  //             srtFilesArray[i].infoDocFile = doc;
  //           } else {
  //             srtFilesArray.push({ language: '', srtFile: null, infoDocFile: doc });
  //           }
  //         });
  //       }
  //     }

  //     // 🔄 Upload files if selected
  //     if (
  //       shouldUploadPoster ||
  //       shouldUploadBanner ||
  //       shouldUploadTrailer ||
  //       dubbedFilesArray.length > 0 ||
  //       srtFilesArray.length > 0
  //     ) {
  //       uploadedFiles = await uploadFilesToS3(
  //         {
  //           projectPoster: shouldUploadPoster ? projectPoster : null,
  //           projectBanner: shouldUploadBanner ? projectBanner : null,
  //           projectTrailer: shouldUploadTrailer ? projectTrailer : null,
  //           dubbedFiles: dubbedFilesArray,
  //           srtFiles: srtFilesArray,
  //         },
  //         projectName,
  //         orgNameToUse,
  //         userId
  //       );

  //       // 🧷 Set uploaded source URLs
  //       if (uploadedFiles.projectPosterUrl)
  //         formData.projectInfo.s3SourcePosterUrl = uploadedFiles.projectPosterUrl;

  //       if (uploadedFiles.projectBannerUrl)
  //         formData.projectInfo.s3SourceBannerUrl = uploadedFiles.projectBannerUrl;

  //       if (uploadedFiles.projectTrailerUrl)
  //         formData.projectInfo.s3SourceTrailerUrl = uploadedFiles.projectTrailerUrl;
  //     }

  //     // 🧼 Do NOT convert s3:// to https:// — preserve raw S3 paths
  //     if (formData.projectInfo.posterOption === 'url') {
  //       formData.projectInfo.s3SourcePosterUrl = formData.projectInfo.projectPosterUrl;
  //     }
  //     if (formData.projectInfo.bannerOption === 'url') {
  //       formData.projectInfo.s3SourceBannerUrl = formData.projectInfo.projectBannerUrl;
  //     }
  //     if (formData.projectInfo.trailerOption === 'url') {
  //       formData.projectInfo.s3SourceTrailerUrl = formData.projectInfo.trailerUrl;
  //     }
  //     if (formData.projectInfo.movieOption === 'url') {
  //       formData.projectInfo.s3SourceMovieUrl = formData.projectInfo.movieUrl;
  //     }

  //     // 🧾 Build final payload
  //     const cleanSrtInfo = {
  //       srtFiles: uploadedFiles?.srtFiles || [],
  //       infoDocuments: uploadedFiles?.infoDocuments || [],
  //       projectName,
  //       userId,
  //     };

  //     const cleanedDubbedFiles = dubbedFilesArray.map((file) => ({
  //       language: file.language,
  //       dubbedTrailerFileName: file.dubbedTrailerFileName,
  //       dubbedTrailerUrl: file.dubbedTrailerUrl,
  //       dubbedSubtitleFileName: file.dubbedSubtitleFileName,
  //       dubbedSubtitleUrl: file.dubbedSubtitleUrl,
  //     }));

  //     const updatedFormData = {
  //       projectInfo: {
  //         ...formData.projectInfo,
  //         projectName,
  //         userId,
  //         posterFileName: extractFileNameFromUrl(formData.projectInfo.projectPosterS3Url),
  //         projectPosterS3Url: formData.projectInfo.projectPosterS3Url,
  //         bannerFileName: extractFileNameFromUrl(formData.projectInfo.projectBannerS3Url),
  //         projectBannerS3Url: formData.projectInfo.projectBannerS3Url,
  //         trailerFileName: extractFileNameFromUrl(formData.projectInfo.projectTrailerS3Url),
  //         projectTrailerS3Url: formData.projectInfo.projectTrailerS3Url,
  //         movieFileName: formData.projectInfo.movieFileName || '',
  //       }
  //       ,
  //       creditsInfo: { ...formData.creditsInfo, projectName, userId },
  //       specificationsInfo: { ...formData.specificationsInfo, projectName, userId },
  //       rightsInfo: {
  //         rights: formData.rightsInfo.rights || [],
  //         projectName,
  //         userId,
  //       },
  //       srtInfo: { srtInfo: cleanSrtInfo },
  //       dubbedFiles: cleanedDubbedFiles,
  //     };

  //     // 📨 Submit main project form
  //     const response = await fetch('https://www.mediashippers.com/api/projectForm', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify(updatedFormData),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.message);

  //     dispatch(setProjectFolderSuccess(projectName));
  //     alert('✅ Project saved successfully!');

  //     // 🔄 Log and call transfer API
  //     console.log('➡️ Preparing file transfers:');
  //     console.log('Poster from:', formData.projectInfo.s3SourcePosterUrl, '=>', formData.projectInfo.projectPosterS3Url);
  //     console.log('Banner from:', formData.projectInfo.s3SourceBannerUrl, '=>', formData.projectInfo.projectBannerS3Url);
  //     console.log('Trailer from:', formData.projectInfo.s3SourceTrailerUrl, '=>', formData.projectInfo.projectTrailerS3Url);

  //     const transferResult = await transferFileToLocation();

  //     if (transferResult.success) {
  //       alert('✅ File transfer successful!');
  //     } else {
  //       console.error('⚠️ File transfer failed:', transferResult);

  //       if (transferResult.fullResult?.errors?.length > 0) {
  //         console.group('❌ Detailed Transfer Errors');
  //         transferResult.fullResult.errors.forEach((err, index) => {
  //           console.error(`${index + 1}. FileType: ${err.fileType}`);
  //           console.error(`   Error: ${err.error}`);
  //         });
  //         console.groupEnd();
  //       }

  //       if (Array.isArray(transferResult.failedFiles) && transferResult.failedFiles.length > 0) {
  //         const failedList = transferResult.failedFiles
  //           .map(file => `• ${file.type}: ${file.reason || 'Unknown error'}`)
  //           .join('\n');
  //         alert(`⚠️ Some files failed to transfer:\n${failedList}`);
  //       } else {
  //         alert(`⚠️ File transfer failed: ${transferResult.error}`);
  //       }
  //     }

  //   } catch (error) {
  //     console.error('❌ Error during submission:', error);
  //     alert('Error saving project: ' + error.message);
  //     dispatch(setProjectFolderFailure({
  //       message: error.message,
  //       name: error.name,
  //       stack: error.stack,
  //     }));
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };


  // Converts s3://bucket-name/path/to/file.ext to https://bucket-name.s3.amazonaws.com/path/to/file.ext
  const convertS3ToHttps = (s3Url) => {
    if (!s3Url || typeof s3Url !== 'string') return '';

    // Check if it's already an HTTPS URL
    if (s3Url.startsWith('https://')) return s3Url;

    try {
      const s3Pattern = /^s3:\/\/([^/]+)\/(.+)$/;
      const match = s3Url.match(s3Pattern);

      if (!match) return s3Url;

      const bucket = match[1];
      const key = match[2].replace(/\s/g, '+'); // Replace spaces with + for S3
      return `https://${bucket}.s3.amazonaws.com/${key}`;
    } catch (err) {
      console.warn('convertS3ToHttps failed:', err);
      return s3Url;
    }
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
      console.error('Form validation failed:', errors);
      setIsUploading(false);
      return;
    }

    const {
      projectPoster,
      projectBanner,
      trailerFile: projectTrailer,
      projectName,
      orgName: organizationName,
    } = formData.projectInfo;

    const shouldUploadPoster = formData.projectInfo.posterOption === 'upload' && projectPoster;
    const shouldUploadBanner = formData.projectInfo.bannerOption === 'upload' && projectBanner;
    const shouldUploadTrailer = formData.projectInfo.trailerOption === 'upload' && projectTrailer;

    try {
      let uploadedFiles = {};
      const orgNameToUse = organizationName || orgName;

      let dubbedFilesArray = Array.isArray(formData.dubbedFiles)
        ? formData.dubbedFiles
        : Object.values(formData.dubbedFiles || {}).filter(
          (item) => typeof item === 'object' && item.language
        );

      let srtFilesArray = [];
      const srt = formData.srtInfo;

      if (Array.isArray(srt)) {
        srtFilesArray = srt
          .map((entry) => ({
            language: entry.language,
            srtFile: entry.srtFile,
            infoDocFile: entry.infoDocFile,
          }))
          .filter((item) => item.srtFile || item.infoDocFile);
      } else if (srt) {
        if (Array.isArray(srt.srtFiles)) {
          srtFilesArray.push(
            ...srt.srtFiles.map((f) => ({
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
            srtFiles: srtFilesArray,
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
      }

      if (formData.projectInfo.posterOption === 'url') {
        formData.projectInfo.s3SourcePosterUrl = formData.projectInfo.projectPosterUrl;
      }
      if (formData.projectInfo.bannerOption === 'url') {
        formData.projectInfo.s3SourceBannerUrl = formData.projectInfo.projectBannerUrl;
      }
      if (formData.projectInfo.trailerOption === 'url') {
        formData.projectInfo.s3SourceTrailerUrl = formData.projectInfo.trailerUrl;
      }
      if (formData.projectInfo.movieOption === 'url') {
        formData.projectInfo.s3SourceMovieUrl = formData.projectInfo.movieUrl;
      }

      // ✅ Convert all s3:// links to https://
      formData.projectInfo.projectPosterS3Url = convertS3ToHttps(formData.projectInfo.projectPosterS3Url);
      formData.projectInfo.projectBannerS3Url = convertS3ToHttps(formData.projectInfo.projectBannerS3Url);
      formData.projectInfo.projectTrailerS3Url = convertS3ToHttps(formData.projectInfo.projectTrailerS3Url);
      formData.projectInfo.projectMovieS3Url = convertS3ToHttps(formData.projectInfo.projectMovieS3Url);
      formData.projectInfo.s3SourcePosterUrl = convertS3ToHttps(formData.projectInfo.s3SourcePosterUrl);
      formData.projectInfo.s3SourceBannerUrl = convertS3ToHttps(formData.projectInfo.s3SourceBannerUrl);
      formData.projectInfo.s3SourceTrailerUrl = convertS3ToHttps(formData.projectInfo.s3SourceTrailerUrl);
      formData.projectInfo.s3SourceMovieUrl = convertS3ToHttps(formData.projectInfo.s3SourceMovieUrl);

      const cleanedDubbedFiles = dubbedFilesArray.map((file) => ({
        language: file.language,
        dubbedTrailerFileName: file.dubbedTrailerFileName,
        dubbedTrailerUrl: convertS3ToHttps(file.dubbedTrailerUrl),
        dubbedSubtitleFileName: file.dubbedSubtitleFileName,
        dubbedSubtitleUrl: convertS3ToHttps(file.dubbedSubtitleUrl),
      }));

      const cleanSrtInfo = {
        srtFiles:
          (uploadedFiles.srtFiles || []).map((file) => ({
            ...file,
            srtFileUrl: convertS3ToHttps(file.srtFileUrl),
          })) || [],
        infoDocuments:
          (uploadedFiles.infoDocuments || []).map((doc) => ({
            ...doc,
            infoDocUrl: convertS3ToHttps(doc.infoDocUrl),
          })) || [],
        projectName,
        userId,
      };

      const updatedFormData = {
        projectInfo: {
          ...formData.projectInfo,
          projectName,
          userId,
          posterFileName: extractFileNameFromUrl(formData.projectInfo.projectPosterS3Url),
          bannerFileName: extractFileNameFromUrl(formData.projectInfo.projectBannerS3Url),
          trailerFileName: extractFileNameFromUrl(formData.projectInfo.projectTrailerS3Url),
          movieFileName: formData.projectInfo.movieFileName || '',
          projectPosterS3Url: formData.projectInfo.projectPosterS3Url,
          projectBannerS3Url: formData.projectInfo.projectBannerS3Url,
          projectTrailerS3Url: formData.projectInfo.projectTrailerS3Url,
          projectMovieS3Url: formData.projectInfo.projectMovieS3Url,
        }
        ,
        creditsInfo: { ...formData.creditsInfo, projectName, userId },
        specificationsInfo: { ...formData.specificationsInfo, projectName, userId },
        rightsInfo: {
          rights: formData.rightsInfo.rights || [],
          projectName,
          userId,
        },
        srtInfo: { srtInfo: cleanSrtInfo },
        dubbedFiles: cleanedDubbedFiles,
      };

      // 🧾 Log the full payload for DB
      console.log('📦 Data to submit to DB:', updatedFormData);

      const response = await fetch('https://www.mediashippers.com/api/projectForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      dispatch(setProjectFolderSuccess(projectName));
      alert('✅ Project saved successfully!');

      console.log('➡️ Preparing file transfers:');
      console.log('Poster from:', formData.projectInfo.s3SourcePosterUrl, '=>', formData.projectInfo.projectPosterS3Url);
      console.log('Banner from:', formData.projectInfo.s3SourceBannerUrl, '=>', formData.projectInfo.projectBannerS3Url);
      console.log('Trailer from:', formData.projectInfo.s3SourceTrailerUrl, '=>', formData.projectInfo.projectTrailerS3Url);

      const transferResult = await transferFileToLocation();

      if (transferResult.success) {
        alert('✅ File transfer successful!');
      } else {
        console.error('⚠️ File transfer failed:', transferResult);

        if (transferResult.fullResult?.errors?.length > 0) {
          console.group('❌ Detailed Transfer Errors');
          transferResult.fullResult.errors.forEach((err, index) => {
            console.error(`${index + 1}. FileType: ${err.fileType}`);
            console.error(`   Error: ${err.error}`);
          });
          console.groupEnd();
        }

        if (Array.isArray(transferResult.failedFiles) && transferResult.failedFiles.length > 0) {
          const failedList = transferResult.failedFiles
            .map(file => `• ${file.type}: ${file.reason || 'Unknown error'}`)
            .join('\n');
          alert(`⚠️ Some files failed to transfer:\n${failedList}`);
        } else {
          alert(`⚠️ File transfer failed: ${transferResult.error}`);
        }
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
