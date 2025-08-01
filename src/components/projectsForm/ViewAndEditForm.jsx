import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewAndEditFormCss.css';
import Loader from '../loader/Loader';
import { UserContext } from '../../contexts/UserContext';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { languageList, genresOptions, rightsOptions, territoryGroupedOptions, licenseTermOptions, paymentTermsOptions, usageRightsOptions, projectTypes } from '../../components/projectsForm/ViewAndEditDropdownData.js';
import Multiselect from 'multiselect-react-dropdown';



function ViewAndEditForm() {



  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [savingProject, setSavingProject] = useState(false);



  const { user } = useSelector((state) => state.auth);
  const { orgName } = user.user;



  const userId = user?.userId;

  const token = Cookies.get("token");

  // Initialize with empty objects to avoid reference errors
  const [editableProjectInfo, setEditableProjectInfo] = useState({});
  const [editableCreditsInfo, setEditableCreditsInfo] = useState({});
  const [editableSpecificationsInfo, setEditableSpecificationsInfo] = useState({});
  const [editableRightsInfo, setEditableRightsInfo] = useState({});
  const [editableSrtInfo, setEditableSrtInfo] = useState({});

  const [srtInfo, setSrtInfo] = useState(null);

  const [posterFile, setPosterFile] = useState(null);



  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingCredits, setIsEditingCredits] = useState(false);
  const [isEditingSpecifications, setIsEditingSpecifications] = useState(false);
  const [isEditingRights, setIsEditingRights] = useState(false);

  const [deletingTrailer, setDeletingTrailer] = useState(false);
  const [deletingPoster, setDeletingPoster] = React.useState(false);
  const [deletingBanner, setDeletingBanner] = useState(false);
  const [deletingDubbedTrailerIndex, setDeletingDubbedTrailerIndex] = useState(null);
  const [deletingDubbedSubtitleIndex, setDeletingDubbedSubtitleIndex] = useState(null);


  // Add this state at the top of your component
  const [posterLoadFailed, setPosterLoadFailed] = useState(false);
  const [bannerLoadFailed, setBannerLoadFailed] = useState(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState(false);






  const [bannerFile, setBannerFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);






  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/project-form/data/${projectId}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          console.log("✅ Full Project Data:", response.data);
          setProjectData(response.data);

          // Set editable states for all fetched info
          setEditableProjectInfo(response.data.projectInfo || {});
          setEditableCreditsInfo(response.data.creditsInfo || {});
          setEditableSpecificationsInfo(response.data.specificationsInfo || {});
          setEditableRightsInfo(response.data.rightsInfo || {});

          // Set srtInfo state and editable srtInfo state
          setSrtInfo(response.data.srtInfo || null);
          setEditableSrtInfo(response.data.srtInfo || {});
        } else {
          setError(`Failed to load project data. Status code: ${response.status}`);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError('An error occurred while fetching the project data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, token]);


  useEffect(() => {
    const fetchUserDetails = async () => {
      if (projectData?.projectInfo?.userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/users/${projectData.projectInfo.userId}`, {
            withCredentials: true
          });

          if (response.status === 200) {
            setUserInfo(response.data);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserDetails();
  }, [projectData]);

  const constructS3Url = (subfolder, fileName) => {
    if (!orgName || !projectData?.projectInfo?.projectName || !fileName) return null;

    const encodedOrg = encodeURIComponent(orgName.trim());
    const encodedProject = encodeURIComponent(projectData.projectInfo.projectName.trim());
    const encodedFile = encodeURIComponent(fileName.trim());

    return `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${encodedOrg}/${encodedProject}/${subfolder}/${encodedFile}`;
  };


  console.log("org name:", orgName);
  console.log("project name:", projectData?.projectInfo?.projectName);



  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/project-form/delete/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
            orgName: orgName,  // from logged-in user
            projectName: projectData?.projectInfo?.projectName, // from fetched project
          },
        }
      );

      if (response.status === 200) {
        alert("✅ Project deleted successfully!");
        window.location.href = "/projects";
      } else {
        alert(`❌ Failed to delete project. Status code: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("❌ An error occurred while deleting the project.");
    }
  };


  const handleEditProjectInfo = () => {
    setEditableProjectInfo(projectData.projectInfo || {});
    setIsEditingProject(true);
  };


  const handleEditCredits = () => {
    setEditableCreditsInfo(projectData.creditsInfo || {});
    setIsEditingCredits(true);
  };

  const handleEditSpecifications = () => {
    setEditableSpecificationsInfo(projectData.specificationsInfo || {});
    setIsEditingSpecifications(true);
  };

  const handleEditRights = () => {
    setEditableRightsInfo(projectData.rightsInfo || {});
    setIsEditingRights(true);
  };
  // At the top of your file
  const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;

  const uploadFileToS3 = async (orgName, projectName, files) => {
    const uploadedFiles = [];

    for (const file of files) {
      if (!file || !file.originalname || !file.buffer || !file.mimetype) {
        throw new Error('Invalid file data encountered.');
      }

      let filePath;

      if (file.type === 'projectPoster' || file.type === 'projectBanner') {
        filePath = `${orgName}/${projectName}/film stills/${file.originalname}`;
      } else if (file.type === 'projectTrailer') {
        filePath = `${orgName}/${projectName}/trailer/${file.originalname}`;
      }
      // add other types here as needed...

      const params = {
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const uploadResult = await s3.upload(params).promise();
        uploadedFiles.push(`https://${BUCKET_NAME}.s3.amazonaws.com/${uploadResult.Key}`);
      } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error(`Error uploading file to S3: ${error.message}`);
      }
    }

    return uploadedFiles;
  };

  const [updatedProjectInfo, setUpdatedProjectInfo] = useState({});

  // const handleSaveProjectInfo = async () => {
  //   setSavingProject(true); // ✅ Show loader
  //   try {
  //     const formData = new FormData();

  //     // Step 1: Upload Poster, Banner, Trailer
  //     if (posterFile) formData.append('projectPoster', posterFile);
  //     if (bannerFile) formData.append('projectBanner', bannerFile);
  //     if (trailerFile) formData.append('projectTrailer', trailerFile);

  //     formData.append('projectName', editableProjectInfo.projectName);
  //     formData.append('orgName', orgName);
  //     formData.append('userId', userId);

  //     const uploadResponse = await fetch('http://localhost:3000/api/files/upload-file', {
  //       method: 'POST',
  //       body: formData,
  //       headers: { Authorization: `Bearer ${token}` },
  //       credentials: 'include',
  //     });

  //     if (!uploadResponse.ok) throw new Error('File upload failed');
  //     const uploadedUrls = await uploadResponse.json();

  //     // Step 2: Upload Dubbed + SRT + Info Docs
  //     const dtForm = new FormData();
  //     let hasFiles = false;
  //     const updatedDubbedFiles = [...editableProjectInfo.dubbedFileData];

  //     editableProjectInfo.dubbedFileData.forEach((file, index) => {
  //       const lang = file.language || `lang-${index}`;
  //       if (file.trailerType === 'upload' && file.trailerFile instanceof File) {
  //         dtForm.append(`dubbedTrailer_${index}`, file.trailerFile);
  //         dtForm.append(`dubbedTrailerLang_${index}`, lang);
  //         hasFiles = true;
  //       }

  //       if (file.dubbedSubtitleFileObject instanceof File) {
  //         dtForm.append(`dubbedSubtitle_${index}`, file.dubbedSubtitleFileObject);
  //         dtForm.append(`dubbedSubtitleLang_${index}`, lang);
  //         hasFiles = true;
  //       }
  //     });

  //     editableSrtInfo.srtFiles?.forEach((file, index) => {
  //       if (file.fileObject instanceof File) {
  //         dtForm.append(`srtFile_${index}`, file.fileObject);
  //         hasFiles = true;
  //       }
  //     });

  //     editableSrtInfo.infoDocuments?.forEach((file, index) => {
  //       if (file.fileObject instanceof File) {
  //         dtForm.append(`infoDocFile_${index}`, file.fileObject);
  //         hasFiles = true;
  //       }
  //     });

  //     let srtInfoUpdate = {};
  //     if (hasFiles) {
  //       dtForm.append('projectName', editableProjectInfo.projectName);
  //       dtForm.append('orgName', orgName);
  //       dtForm.append('userId', userId);

  //       const dtResponse = await fetch('http://localhost:3000/api/files/upload-file', {
  //         method: 'POST',
  //         body: dtForm,
  //         headers: { Authorization: `Bearer ${token}` },
  //         credentials: 'include',
  //       });

  //       if (!dtResponse.ok) throw new Error('Dubbed/SRT/InfoDoc upload failed');
  //       const dtData = await dtResponse.json();

  //       dtData.dubbedFiles?.forEach((df) => {
  //         const index = updatedDubbedFiles.findIndex((d) => d.language === df.language);
  //         if (index !== -1) {
  //           if (df.dubbedTrailer) {
  //             updatedDubbedFiles[index].dubbedTrailerUrl = df.dubbedTrailer.fileUrl || '';
  //             updatedDubbedFiles[index].dubbedTrailerFileName = df.dubbedTrailer.fileName || '';
  //           }
  //           if (df.dubbedSubtitle) {
  //             updatedDubbedFiles[index].dubbedSubtitleUrl = df.dubbedSubtitle.fileUrl || '';
  //             updatedDubbedFiles[index].dubbedSubtitleFileName = df.dubbedSubtitle.fileName || '';
  //           }
  //         }
  //       });

  //       if (dtData.srtInfo) {
  //         const srtFiles = dtData.srtInfo.srtFiles || [];
  //         const infoDocuments = dtData.srtInfo.infoDocuments || [];

  //         setEditableSrtInfo({ srtFiles, infoDocuments });

  //         if (srtFiles.length > 0) srtInfoUpdate.srtFiles = srtFiles;
  //         if (infoDocuments.length > 0) srtInfoUpdate.infoDocuments = infoDocuments;
  //       }
  //     }

  //     // Step 3: Prepare updated project data
  //     const updatedProjectData = {
  //       ...(uploadedUrls.projectPosterUrl && {
  //         projectPosterS3Url: uploadedUrls.projectPosterUrl,
  //         posterFileName: posterFile?.name,
  //       }),
  //       ...(uploadedUrls.projectBannerUrl && {
  //         projectBannerS3Url: uploadedUrls.projectBannerUrl,
  //         bannerFileName: bannerFile?.name,
  //       }),
  //       ...(uploadedUrls.projectTrailerUrl && {
  //         projectTrailerS3Url: uploadedUrls.projectTrailerUrl,
  //         trailerFileName: trailerFile?.name,
  //       }),
  //       projectTitle: editableProjectInfo.projectTitle || '',
  //       projectName: editableProjectInfo.projectName || '',
  //       briefSynopsis: editableProjectInfo.briefSynopsis || '',
  //       isPublic: editableProjectInfo.isPublic ?? false,
  //       movieFileName: editableProjectInfo.movieFileName || '',
  //       dubbedFileData: updatedDubbedFiles,
  //     };

  //     // Final patch payload
  //     const patchPayload = {
  //       projectInfo: updatedProjectData,
  //       ...(Object.keys(srtInfoUpdate).length > 0 && { srtInfo: srtInfoUpdate }),
  //       ...(editableCreditsInfo && Object.keys(editableCreditsInfo).length > 0 && {
  //         creditsInfo: editableCreditsInfo,
  //       }),
  //       ...(editableSpecificationsInfo && Object.keys(editableSpecificationsInfo).length > 0 && {
  //         specificationsInfo: editableSpecificationsInfo,
  //       }),
  //       ...(editableRightsInfo && Object.keys(editableRightsInfo).length > 0 && {
  //         rightsInfo: editableRightsInfo,
  //       }),
  //     };

  //     const patchUrl = `http://localhost:3000/api/project-form/update/${projectId}`;
  //     const patchResponse = await fetch(patchUrl, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(patchPayload),
  //     });

  //     if (!patchResponse.ok) throw new Error('Failed to update MongoDB');

  //     // ✅ Update local state
  //     setEditableProjectInfo((prev) => ({ ...prev, ...updatedProjectData }));
  //     setUpdatedProjectInfo((prev) => ({ ...prev, ...updatedProjectData }));

  //     alert('✅ Project info updated successfully!');

  //     // ✅ Refresh page after short delay
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 500);
  //   } catch (err) {
  //     console.error(err);
  //     alert('❌ Error saving project data');
  //   } finally {
  //     setSavingProject(false); // ✅ Hide loader
  //   }
  // };

  const handleSaveProjectInfo = async () => {
    setSavingProject(true); // ✅ Show loader
    try {
      const formData = new FormData();

      // Step 1: Upload Poster, Banner, Trailer
      if (posterFile) formData.append('projectPoster', posterFile);
      if (bannerFile) formData.append('projectBanner', bannerFile);
      if (trailerFile) formData.append('projectTrailer', trailerFile);

      formData.append('projectName', editableProjectInfo.projectName);
      formData.append('orgName', orgName);
      formData.append('userId', userId);

      const uploadResponse = await fetch('http://localhost:3000/api/files/upload-file', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (!uploadResponse.ok) throw new Error('File upload failed');
      const uploadedUrls = await uploadResponse.json();

      // Step 2: Upload Dubbed + SRT + Info Docs
      const dtForm = new FormData();
      let hasFiles = false;
      const updatedDubbedFiles = [...editableProjectInfo.dubbedFileData];

      editableProjectInfo.dubbedFileData.forEach((file, index) => {
        const lang = file.language || `lang-${index}`;
        if (file.trailerType === 'upload' && file.trailerFile instanceof File) {
          dtForm.append(`dubbedTrailer_${index}`, file.trailerFile);
          dtForm.append(`dubbedTrailerLang_${index}`, lang);
          hasFiles = true;
        }

        if (file.dubbedSubtitleFileObject instanceof File) {
          dtForm.append(`dubbedSubtitle_${index}`, file.dubbedSubtitleFileObject);
          dtForm.append(`dubbedSubtitleLang_${index}`, lang);
          hasFiles = true;
        }
      });

      editableSrtInfo.srtFiles?.forEach((file, index) => {
        if (file.fileObject instanceof File) {
          dtForm.append(`srtFile_${index}`, file.fileObject);
          hasFiles = true;
        }
      });

      editableSrtInfo.infoDocuments?.forEach((file, index) => {
        if (file.fileObject instanceof File) {
          dtForm.append(`infoDocFile_${index}`, file.fileObject);
          hasFiles = true;
        }
      });

      let srtInfoUpdate = {};
      if (hasFiles) {
        dtForm.append('projectName', editableProjectInfo.projectName);
        dtForm.append('orgName', orgName);
        dtForm.append('userId', userId);

        const dtResponse = await fetch('http://localhost:3000/api/files/upload-file', {
          method: 'POST',
          body: dtForm,
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (!dtResponse.ok) throw new Error('Dubbed/SRT/InfoDoc upload failed');
        const dtData = await dtResponse.json();

        dtData.dubbedFiles?.forEach((df) => {
          const index = updatedDubbedFiles.findIndex((d) => d.language === df.language);
          if (index !== -1) {
            if (df.dubbedTrailer) {
              updatedDubbedFiles[index].dubbedTrailerUrl = df.dubbedTrailer.fileUrl || '';
              updatedDubbedFiles[index].dubbedTrailerFileName = df.dubbedTrailer.fileName || '';
            }
            if (df.dubbedSubtitle) {
              updatedDubbedFiles[index].dubbedSubtitleUrl = df.dubbedSubtitle.fileUrl || '';
              updatedDubbedFiles[index].dubbedSubtitleFileName = df.dubbedSubtitle.fileName || '';
            }
          }
        });

        if (dtData.srtInfo) {
          const srtFiles = dtData.srtInfo.srtFiles || [];
          const infoDocuments = dtData.srtInfo.infoDocuments || [];

          setEditableSrtInfo({ srtFiles, infoDocuments });

          if (srtFiles.length > 0) srtInfoUpdate.srtFiles = srtFiles;
          if (infoDocuments.length > 0) srtInfoUpdate.infoDocuments = infoDocuments;
        }
      }

      // ✅ Step 3: Construct runtime string and update specifications
      if (editableSpecificationsInfo) {
        const hh = String(editableSpecificationsInfo.runtimeHours || 0).padStart(2, '0');
        const mm = String(editableSpecificationsInfo.runtimeMinutes || 0).padStart(2, '0');
        const ss = String(editableSpecificationsInfo.runtimeSeconds || 0).padStart(2, '0');

        editableSpecificationsInfo.runtime = `${hh}:${mm}:${ss}`;
      }

      // ✅ Step 4: Prepare updated project data
      const updatedProjectData = {
        ...(uploadedUrls.projectPosterUrl && {
          projectPosterS3Url: uploadedUrls.projectPosterUrl,
          posterFileName: posterFile?.name,
        }),
        ...(uploadedUrls.projectBannerUrl && {
          projectBannerS3Url: uploadedUrls.projectBannerUrl,
          bannerFileName: bannerFile?.name,
        }),
        ...(uploadedUrls.projectTrailerUrl && {
          projectTrailerS3Url: uploadedUrls.projectTrailerUrl,
          trailerFileName: trailerFile?.name,
        }),
        projectTitle: editableProjectInfo.projectTitle || '',
        projectName: editableProjectInfo.projectName || '',
        briefSynopsis: editableProjectInfo.briefSynopsis || '',
        isPublic: editableProjectInfo.isPublic ?? false,
        movieFileName: editableProjectInfo.movieFileName || '',
        dubbedFileData: updatedDubbedFiles,
      };

      // ✅ Step 5: Final PATCH payload
      const patchPayload = {
        projectInfo: updatedProjectData,
        ...(Object.keys(srtInfoUpdate).length > 0 && { srtInfo: srtInfoUpdate }),
        ...(editableCreditsInfo && Object.keys(editableCreditsInfo).length > 0 && {
          creditsInfo: editableCreditsInfo,
        }),
        ...(editableSpecificationsInfo && Object.keys(editableSpecificationsInfo).length > 0 && {
          specificationsInfo: editableSpecificationsInfo,
        }),
        ...(editableRightsInfo && Object.keys(editableRightsInfo).length > 0 && {
          rightsInfo: editableRightsInfo,
        }),
      };

      const patchUrl = `http://localhost:3000/api/project-form/update/${projectId}`;
      const patchResponse = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patchPayload),
      });

      if (!patchResponse.ok) throw new Error('Failed to update MongoDB');

      // ✅ Update local state
      setEditableProjectInfo((prev) => ({ ...prev, ...updatedProjectData }));
      setUpdatedProjectInfo((prev) => ({ ...prev, ...updatedProjectData }));

      alert('✅ Project info updated successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      alert('❌ Error saving project data');
    } finally {
      setSavingProject(false); // ✅ Hide loader
    }
  };




  const includedRegionOptions = territoryGroupedOptions.map((group) => ({
    label: group.groupName,
    value: group.groupId,
  }));

  const getCountryOptionsByRegionIds = (selectedRegions = []) => {
    if (!selectedRegions.length) return [];

    const isWorldwide = selectedRegions.some(r => r.id === 'worldwide');

    const filteredGroups = isWorldwide
      ? territoryGroupedOptions
      : territoryGroupedOptions.filter(group =>
        selectedRegions.some(r => r.id === group.groupId)
      );

    return filteredGroups.flatMap(group =>
      group.countries.map(country => ({
        name: country.name,
        id: country.id,
        region: group.groupName,
      }))
    );
  };







  if (loading) return <div className="loading"><Loader /></div>;
  if (error) return <div className="error">{error}</div>;

  const { projectInfo, creditsInfo, specificationsInfo, screeningsInfo, rightsInfo } = projectData;


  function extractFilePathFromUrl(url) {
    const region = import.meta.env.VITE_AWS_REGION;
    const bucket = import.meta.env.VITE_S3_BUCKET_NAME;

    if (!region || !bucket) {
      throw new Error('Missing S3_BUCKET_NAME or AWS_REGION in environment variables');
    }

    // Support both URL styles
    const possiblePrefixes = [
      `https://${bucket}.s3.${region}.amazonaws.com/`,
      `https://${bucket}.s3.amazonaws.com/`,
    ];

    const matchedPrefix = possiblePrefixes.find(prefix => url.startsWith(prefix));

    if (!matchedPrefix) {
      throw new Error('Invalid S3 URL format');
    }

    const rawPath = url.replace(matchedPrefix, '');

    // Proper decode and cleanup of any accidental "+"
    const cleanPath = decodeURIComponent(rawPath).replace(/\+/g, ' ');

    console.log('✅ Extracted file path:', cleanPath);
    return cleanPath;
  }

  // deleteFileFromS3.js

  // utils/deleteFileFromS3.js

  const deleteFileFromS3 = async (
    fileUrlOrPath,
    token,
    projectInfo,       // Can be full object or just _id string
    field,             // e.g. 'projectPosterS3Url', 'infoDocuments', 'srtFiles'
    type,              // e.g. 'poster', 'infoDoc', 'srt', 'dubbed'
    fileId = null,
    arrayIndex = null,
    srtInfoId = null
  ) => {
    console.log('================== 🔥 deleteFileFromS3 CALLED ==================');
    console.log('📦 Type:', type);
    console.log('🧾 Field:', field);
    console.log('🆔 fileId:', fileId);
    console.log('🔢 arrayIndex:', arrayIndex);
    console.log('📘 srtInfoId passed:', srtInfoId);
    console.log('🗂️ ProjectInfo:', projectInfo);

    if (!fileUrlOrPath || !token || !projectInfo) {
      throw new Error('Missing required data for file deletion');
    }

    // ✅ Convert string _id into object if needed
    if (typeof projectInfo === 'string') {
      projectInfo = { _id: projectInfo };
    }

    if (typeof projectInfo !== 'object' || !projectInfo._id) {
      console.error('❌ projectInfo is invalid or missing _id:', projectInfo);
      throw new Error('projectInfo._id is required for deletion');
    }

    // Step 1: Extract file path
    const isFullUrl = fileUrlOrPath.startsWith('https://') || fileUrlOrPath.startsWith('s3://');
    let filePath;
    try {
      filePath = isFullUrl
        ? fileUrlOrPath.split('.com/')[1]
        : decodeURIComponent(fileUrlOrPath);
    } catch (err) {
      console.error('❌ Error extracting file path:', err.message);
      throw new Error('Invalid file path or URL');
    }

    const cleanFilePath = filePath.replace(/\+/g, ' ').trim();
    if (!cleanFilePath) throw new Error('Missing or invalid file path');

    console.log('🧹 Cleaned filePath →', cleanFilePath);

    // Step 2: Delete from S3
    const s3Res = await fetch(
      `http://localhost:3000/api/project-form/delete-file?filePath=${encodeURIComponent(cleanFilePath)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!s3Res.ok) {
      const error = await s3Res.json().catch(() => ({}));
      console.error('❌ Failed to delete from S3:', error?.error);
      throw new Error(error?.error || 'S3 deletion failed');
    }

    // Step 3: Determine MongoDB metadata document ID
    let metadataCollection = 'project';
    let metadataDocId = projectInfo._id;

    if (type === 'srt' || type === 'infoDoc') {
      metadataCollection = 'srt';
      metadataDocId =
        srtInfoId ||
        projectInfo?.srtFilesId ||
        projectInfo?.srtInfoId ||
        projectInfo?.srtInfo?._id;

      console.log('📎 Final srt/infoDoc metadataDocId →', metadataDocId);
    }

    if (!metadataDocId) {
      console.error('❌ Missing metadataDocId — full projectInfo:', projectInfo);
      throw new Error('Metadata document ID is required');
    }

    // Step 4: Construct metadata deletion URL
    const extraField =
      type === 'dubbed' && field.includes('dubbedTrailerUrl')
        ? field.replace('Url', 'FileName')
        : null;

    const metadataUrl =
      `http://localhost:3000/api/project-form/delete-file-metadata/${metadataDocId}` +
      `?field=${field}&collection=${metadataCollection}` +
      (fileId ? `&fileId=${fileId}` : '') +
      (arrayIndex !== null ? `&index=${arrayIndex}` : '') +
      (extraField ? `&extraField=${extraField}` : '');

    console.log('🧪 Metadata delete URL →', metadataUrl);

    // Step 5: Delete metadata from MongoDB
    const dbRes = await fetch(metadataUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!dbRes.ok) {
      const dbError = await dbRes.json().catch(() => ({}));
      console.error('❌ Failed to delete metadata:', dbError?.error);
      throw new Error(dbError?.error || 'Metadata deletion failed');
    }

    console.log('✅ S3 file and metadata deleted successfully');
    return true;
  };

  // Normalize data outside return (in your component function body)
  const normalizedRightsGroups = rightsInfo?.rightsGroups?.length
    ? rightsInfo.rightsGroups
    : [
      {
        rights: rightsInfo?.rights || [],
        territories: {
          includedRegions: rightsInfo?.territories || [],
          excludeCountries: rightsInfo?.excludeCountries || [],
        },
        licenseTerm: rightsInfo?.licenseTerm || [],
        usageRights: rightsInfo?.usageRights || [],
        paymentTerms: rightsInfo?.paymentTerms || [],
        platformType: rightsInfo?.platformType || [],
        listPrice: rightsInfo?.listPrice || '',
      },
    ];


  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(/_| /) // handles both underscores and spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }




  return (
    <>
      <div className="view-and-edit-project projects-form-container text-left">
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handleDeleteProject}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300"
          >
            🗑️ Delete Project
          </button>
        </div>

        {/* 1. Project Information */}
        <section className="section">
          <div className="section-header flex justify-between items-center">
            <h1 className="header-numbered">
              <span>1</span> Project Information
            </h1>
            <button
              onClick={() => {
                if (!isEditingProject) {
                  // Entering edit mode: initialize editableProjectInfo with poster, banner, trailer URLs and input types
                  setEditableProjectInfo({
                    ...projectInfo,
                    posterInputType: projectInfo.projectPosterS3Url ? 'url' : 'upload',
                    projectPosterS3Url: projectInfo.projectPosterS3Url || '',

                    bannerInputType: projectInfo.projectBannerS3Url ? 'url' : 'upload',
                    projectBannerS3Url: projectInfo.projectBannerS3Url || '',

                    trailerInputType: projectInfo.projectTrailerS3Url ? 'url' : 'upload',
                    projectTrailerS3Url: projectInfo.projectTrailerS3Url || '',
                  });
                } else {
                  // Cancel editing: reset editableProjectInfo to projectInfo (optional)
                  setEditableProjectInfo(projectInfo);
                }
                setIsEditingProject(!isEditingProject);
                setPosterFile(null);   // clear any selected poster file
                setBannerFile(null);   // clear any selected banner file (add this state if you have it)
                setTrailerFile(null);  // clear any selected trailer file (add this state if you have it)
              }}
              className={`text-sm ${isEditingProject ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-3 py-1 rounded`}
            >
              {isEditingProject ? '❌ Cancel' : '✏️ Edit'}
            </button>


          </div>

          <div className="info-row">
            <strong>Title:</strong>
            {isEditingProject ? (
              <input className="text-black"
                type="text"
                value={editableProjectInfo.projectTitle || ''}
                onChange={(e) =>
                  setEditableProjectInfo({ ...editableProjectInfo, projectTitle: e.target.value })
                }
              />
            ) : (
              <p>{projectInfo?.projectTitle || 'N/A'}</p>
            )}
          </div>
          <div className="info-row">
            <strong>Name:</strong>
            {isEditingProject ? (
              <input className="text-black"
                type="text"
                value={editableProjectInfo.projectName || ''}
                onChange={(e) =>
                  setEditableProjectInfo({ ...editableProjectInfo, projectName: e.target.value })
                }
              />
            ) : (
              <p>{projectInfo?.projectName || 'N/A'}</p>
            )}
          </div>
          <div className="info-row">
            <strong>Synopsis:</strong>
            {isEditingProject ? (
              <textarea
                value={editableProjectInfo.briefSynopsis || ''}
                onChange={(e) =>
                  setEditableProjectInfo({ ...editableProjectInfo, briefSynopsis: e.target.value })
                }
                rows={3}
                className="w-full text-black"
              />
            ) : (
              <p>{projectInfo?.briefSynopsis || 'N/A'}</p>
            )}
          </div>
          <div className="info-row">
            <strong>Visibility:</strong>
            {isEditingProject ? (
              <select
                className="text-black"
                value={editableProjectInfo.isPublic || "private"}
                onChange={(e) =>
                  setEditableProjectInfo({
                    ...editableProjectInfo,
                    isPublic: e.target.value // store as "public" or "private"
                  })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            ) : (
              <p>
                {projectInfo?.isPublic === "public" ? "Public" : "Private"}
              </p>
            )}
          </div>


          {/* Poster */}
          {/* Poster Section */}
          {/* Poster Section */}
          <div className="info-row">
            <strong>Poster:</strong>

            {isEditingProject ? (
              <div className="form-field text-black">
                <div className="d-flex mb-2">
                  <label className="me-3">
                    <input
                      type="radio"
                      name="posterInputType"
                      value="upload"
                      checked={editableProjectInfo.posterInputType === 'upload'}
                      onChange={() => {
                        setPosterFile(null);
                        setEditableProjectInfo((prev) => ({
                          ...prev,
                          posterInputType: 'upload',
                          projectPosterS3Url: prev.projectPosterS3Url || '',
                        }));
                      }}
                    /> Upload File
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="posterInputType"
                      value="url"
                      checked={editableProjectInfo.posterInputType === 'url'}
                      onChange={() => {
                        setPosterFile(null);
                        setEditableProjectInfo((prev) => ({
                          ...prev,
                          posterInputType: 'url',
                          projectPosterS3Url: prev.projectPosterS3Url || '',
                        }));
                      }}
                    /> S3 URL
                  </label>
                </div>

                {/* Show preview if available */}
                {editableProjectInfo.projectPosterS3Url && (
                  <div className="mb-2">
                    <img
                      src={editableProjectInfo.projectPosterS3Url}
                      alt="Poster Preview"
                      style={{ maxWidth: '150px', maxHeight: '200px' }}
                    />
                  </div>
                )}

                {editableProjectInfo.posterInputType === 'upload' && (
                  <>
                    {!posterFile ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const allowedTypes = ['image/jpeg', 'image/png'];
                          if (!allowedTypes.includes(file.type)) {
                            alert('Only JPEG and PNG files are allowed.');
                            return;
                          }

                          setPosterFile(file);
                          const previewUrl = URL.createObjectURL(file);
                          setEditableProjectInfo((prev) => ({
                            ...prev,
                            projectPosterS3Url: previewUrl,
                          }));
                        }}
                      />
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditableProjectInfo((prev) => ({
                              ...prev,
                              projectPosterS3Url: '',
                            }));
                            setPosterFile(null);
                          }}
                        >
                          Change Poster
                        </button>
                      </div>
                    )}

                    <p className="text-muted small mt-1">
                      This is a preview. Final S3 URL will be available after saving.
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this poster?');
                    if (!confirmDelete) return;

                    setDeletingPoster(true);
                    try {
                      await deleteFileFromS3(
                        editableProjectInfo.projectPosterS3Url,
                        token,
                        editableProjectInfo._id,
                        'projectPosterS3Url'
                      );

                      setPosterFile(null);
                      setEditableProjectInfo(prev => ({
                        ...prev,
                        projectPosterS3Url: '',
                        posterFileName: '',
                      }));

                      alert('Poster deleted successfully.');
                    } catch (err) {
                      console.error('Error:', err);
                      alert('Failed to delete poster.');
                    } finally {
                      setDeletingPoster(false);
                    }
                  }}
                  className="btn btn-sm btn-danger"
                  disabled={deletingPoster}
                >
                  {deletingPoster ? 'Removing...' : 'Remove Poster'}
                </button>


                {editableProjectInfo.posterInputType === 'url' && (
                  <input
                    type="text"
                    value={editableProjectInfo.projectPosterS3Url || ''}
                    onChange={(e) =>
                      setEditableProjectInfo((prev) => ({
                        ...prev,
                        projectPosterS3Url: e.target.value,
                      }))
                    }
                    placeholder="Enter S3 URL"
                  />
                )}
              </div>
            ) : editableProjectInfo?.projectPosterS3Url && !posterLoadFailed ? (
              <>
                <img
                  src={editableProjectInfo.projectPosterS3Url}
                  alt="Poster"
                  style={{ width: '150px' }}
                  onError={() => setPosterLoadFailed(true)}
                />
                {/* <p className="small text-white mt-1">{editableProjectInfo.projectPosterS3Url}</p> */}
              </>
            ) : (
              <p className="text-white fst-italic">No poster available. Click Edit to upload.</p>
            )}
          </div>



          {/* Banner Section */}
          <div className="info-row">
            <strong>Banner:</strong>

            {isEditingProject ? (
              <div className="form-field text-black">
                <div className="d-flex mb-2">
                  <label className="me-3">
                    <input
                      type="radio"
                      name="bannerInputType"
                      value="upload"
                      checked={editableProjectInfo.bannerInputType === 'upload'}
                      onChange={() => {
                        setBannerFile(null);
                        setEditableProjectInfo(prev => ({
                          ...prev,
                          bannerInputType: 'upload',
                          projectBannerS3Url: prev.projectBannerS3Url || '',
                        }));
                      }}
                    /> Upload File
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="bannerInputType"
                      value="url"
                      checked={editableProjectInfo.bannerInputType === 'url'}
                      onChange={() => {
                        setBannerFile(null);
                        setEditableProjectInfo(prev => ({
                          ...prev,
                          bannerInputType: 'url',
                          projectBannerS3Url: prev.projectBannerS3Url || '',
                        }));
                      }}
                    /> S3 URL
                  </label>
                </div>

                {/* Banner Preview */}
                {editableProjectInfo.projectBannerS3Url && !deletingBanner && (
                  <div className="mb-2">
                    <img
                      src={encodeURI(editableProjectInfo.projectBannerS3Url)}
                      alt="Banner Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </div>
                )}

                {/* Remove from S3 */}
                {editableProjectInfo.projectBannerS3Url && (
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmDelete = window.confirm('Are you sure you want to delete this banner?');
                      if (!confirmDelete) return;

                      setDeletingBanner(true);
                      try {
                        const bannerUrl = editableProjectInfo.projectBannerS3Url;
                        const id = editableProjectInfo._id; // ✅ correct ID
                        await deleteFileFromS3(bannerUrl, token, id, 'projectBannerS3Url');

                        setEditableProjectInfo(prev => ({
                          ...prev,
                          projectBannerS3Url: '',
                          bannerFileName: '',
                        }));

                        alert('Banner deleted successfully');
                      } catch (err) {
                        console.error('Error deleting banner:', err);
                        alert(err.message);
                      } finally {
                        setDeletingBanner(false);
                      }
                    }}
                    className="btn btn-sm btn-danger"
                    disabled={deletingBanner}
                  >
                    {deletingBanner ? 'Removing...' : 'Remove Banner'}
                  </button>

                )}

                {/* Upload Option */}
                {editableProjectInfo.bannerInputType === 'upload' && (
                  <>
                    {!bannerFile ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const allowedTypes = ['image/jpeg', 'image/png'];
                          if (!allowedTypes.includes(file.type)) {
                            alert('Only JPEG and PNG are allowed.');
                            return;
                          }

                          const previewUrl = URL.createObjectURL(file);
                          setBannerFile(file);
                          setEditableProjectInfo(prev => ({
                            ...prev,
                            projectBannerS3Url: previewUrl, // preview only
                          }));
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-1"
                        onClick={() => {
                          setBannerFile(null);
                          setEditableProjectInfo(prev => ({
                            ...prev,
                            projectBannerS3Url: '',
                          }));
                        }}
                      >
                        Change Banner
                      </button>
                    )}
                    <p className="text-muted small mt-1">Preview only. Final S3 URL saved after clicking Save.</p>
                  </>
                )}

                {/* S3 URL Option */}
                {editableProjectInfo.bannerInputType === 'url' && (
                  <input
                    type="text"
                    value={editableProjectInfo.projectBannerS3Url || ''}
                    onChange={(e) =>
                      setEditableProjectInfo(prev => ({
                        ...prev,
                        projectBannerS3Url: e.target.value,
                      }))
                    }
                    placeholder="Enter S3 URL"
                  />
                )}
              </div>
            ) : editableProjectInfo?.projectBannerS3Url && !bannerLoadFailed ? (
              <>
                <img
                  src={encodeURI(editableProjectInfo.projectBannerS3Url)}
                  alt="Banner"
                  style={{ width: '100%', maxWidth: '500px' }}
                  onError={() => setBannerLoadFailed(true)}
                />
              </>
            ) : (
              <p className="text-white fst-italic">No banner available. Click Edit to upload.</p>
            )}
          </div>




          {/* Trailer Section */}
          <div className="info-row">
            <strong>Trailer:</strong>

            {isEditingProject ? (
              <div className="form-field text-black">
                {/* Input type toggle */}
                <div className="d-flex mb-2">
                  <label className="me-3">
                    <input
                      type="radio"
                      name="trailerInputType"
                      value="upload"
                      checked={editableProjectInfo.trailerInputType === 'upload'}
                      onChange={() =>
                        setEditableProjectInfo((prev) => ({
                          ...prev,
                          trailerInputType: 'upload',
                          projectTrailerS3Url: prev.projectTrailerS3Url || '',
                        }))
                      }
                    /> Upload File
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="trailerInputType"
                      value="url"
                      checked={editableProjectInfo.trailerInputType === 'url'}
                      onChange={() =>
                        setEditableProjectInfo((prev) => ({
                          ...prev,
                          trailerInputType: 'url',
                          projectTrailerS3Url: prev.projectTrailerS3Url || '',
                        }))
                      }
                    /> S3 URL
                  </label>
                </div>

                {/* Preview */}
                {editableProjectInfo.projectTrailerS3Url && (
                  <div className="mb-2">
                    <video width="480" controls src={editableProjectInfo.projectTrailerS3Url}>
                      Your browser does not support the video tag.
                    </video>
                    {/* <p className="mt-1 small text-white">{editableProjectInfo.projectTrailerS3Url}</p> */}

                    <div className="d-flex gap-2 mt-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setEditableProjectInfo((prev) => ({
                            ...prev,
                            projectTrailerS3Url: '',
                            trailerFileName: '',
                          }));
                          setTrailerFile(null);
                        }}
                      >
                        Change Trailer
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        disabled={deletingTrailer}
                        onClick={async () => {
                          const confirmDelete = window.confirm('Are you sure you want to delete this trailer from S3?');
                          if (!confirmDelete) return;

                          setDeletingTrailer(true);
                          try {
                            const trailerUrl = editableProjectInfo.projectTrailerS3Url;
                            const field = 'projectTrailerS3Url';

                            // ✅ Pass full object and type='trailer'
                            await deleteFileFromS3(trailerUrl, token, editableProjectInfo, field, 'trailer');

                            setEditableProjectInfo((prev) => ({
                              ...prev,
                              projectTrailerS3Url: '',
                              trailerFileName: '',
                            }));

                            setTrailerFile(null);
                            alert('Trailer deleted successfully.');
                          } catch (err) {
                            console.error('Error deleting trailer:', err);
                            alert(err.message || 'Failed to delete trailer from S3 or MongoDB');
                          } finally {
                            setDeletingTrailer(false);
                          }
                        }}
                      >
                        {deletingTrailer ? 'Removing...' : 'Remove Trailer'}
                      </button>


                    </div>
                  </div>
                )}

                {/* Upload Input */}
                {editableProjectInfo.trailerInputType === 'upload' && (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const allowedTypes = ['video/mp4', 'video/mov', 'video/quicktime'];
                      if (!allowedTypes.includes(file.type)) {
                        alert('Only MP4 and MOV are allowed.');
                        return;
                      }

                      setTrailerFile(file);
                      const previewUrl = URL.createObjectURL(file);
                      setEditableProjectInfo((prev) => ({
                        ...prev,
                        projectTrailerS3Url: previewUrl,
                        trailerFileName: file.name,
                      }));
                    }}
                  />
                )}

                {/* S3 URL Input */}
                {editableProjectInfo.trailerInputType === 'url' && (
                  <input
                    type="text"
                    value={editableProjectInfo.projectTrailerS3Url || ''}
                    onChange={(e) =>
                      setEditableProjectInfo((prev) => ({
                        ...prev,
                        projectTrailerS3Url: e.target.value,
                      }))
                    }
                    placeholder="Enter S3 URL"
                  />
                )}
              </div>
            ) : projectInfo?.projectTrailerS3Url && !videoLoadFailed ? (
              <>
                <video
                  width="480"
                  controls
                  src={projectInfo.projectTrailerS3Url}
                  onError={() => setVideoLoadFailed(true)}
                >
                  Your browser does not support the video tag.
                </video>
                {/* <p className="small text-white mt-1">{projectInfo.projectTrailerS3Url}</p> */}
              </>
            ) : (
              <p className="text-white fst-italic">No trailer available. Click Edit to upload.</p>
            )}
          </div>





          {/* Movie + SRT */}
          <div className="info-row">
            <strong>Movie File:</strong>
            {isEditingProject ? (
              <input className="text-black"
                type="text"
                value={editableProjectInfo.movieFileName || ''}
                onChange={(e) =>
                  setEditableProjectInfo({ ...editableProjectInfo, movieFileName: e.target.value })
                }
              />
            ) : (
              <p>{projectInfo?.movieFileName || 'N/A'}</p>
            )}
          </div>

          {/* --- SRT Files Upload & Preview --- */}
          {/* --- SRT Files Upload & Preview --- */}
          <div className="info-row">
            <strong>SRT Files:</strong>

            {isEditingProject ? (
              <div className="flex flex-col gap-2">
                {editableSrtInfo?.srtFiles?.map((file, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {file.fileUrl && (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.fileName || file.fileUrl?.split('/').pop()}
                      </a>
                    )}

                    <input
                      type="file"
                      accept=".srt"
                      onChange={(e) => {
                        const newFile = e.target.files?.[0];
                        if (!newFile) return;
                        const updated = [...editableSrtInfo.srtFiles];
                        updated[index] = {
                          fileName: newFile.name,
                          fileUrl: URL.createObjectURL(newFile),
                          fileObject: newFile,
                        };
                        setEditableSrtInfo({ ...editableSrtInfo, srtFiles: updated });
                      }}
                    />

                    {file.fileUrl?.startsWith('https://') ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          const confirmDelete = window.confirm(`Delete ${file.fileName || file.fileUrl?.split('/').pop()} from S3 and DB?`);
                          if (!confirmDelete) return;

                          try {
                            await deleteFileFromS3(
                              file.fileUrl,
                              token,
                              projectData?.projectInfo,
                              'srtFiles',
                              'srt',
                              file._id,
                              null,
                              projectData?.srtInfo?._id
                            );

                            const updated = [...editableSrtInfo.srtFiles];
                            updated.splice(index, 1);
                            setEditableSrtInfo({ ...editableSrtInfo, srtFiles: updated });

                            alert('✅ SRT file deleted successfully');
                          } catch (err) {
                            console.error(err);
                            alert('❌ Failed to delete SRT file');
                          }
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          const updated = [...editableSrtInfo.srtFiles];
                          updated.splice(index, 1);
                          setEditableSrtInfo({ ...editableSrtInfo, srtFiles: updated });
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    setEditableSrtInfo({
                      ...editableSrtInfo,
                      srtFiles: [
                        ...(editableSrtInfo.srtFiles || []),
                        { fileName: '', fileUrl: '', fileObject: null },
                      ],
                    })
                  }
                >
                  + Add SRT File
                </button>
              </div>
            ) : (
              <ul>
                {srtInfo?.srtFiles?.map((file) => (
                  <li key={file._id || file.fileName}>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {file.fileName || file.fileUrl?.split('/').pop()}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* --- Info Docs Upload & Preview --- */}
          <div className="info-row">
            <strong>Info Docs:</strong>

            {isEditingProject ? (
              <div className="flex flex-col gap-2">
                {editableSrtInfo.infoDocuments?.map((file, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {file.fileUrl && (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.fileName || file.fileUrl?.split('/').pop()}
                      </a>
                    )}

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const newFile = e.target.files?.[0];
                        if (!newFile) return;

                        const updated = [...editableSrtInfo.infoDocuments];
                        updated[index] = {
                          fileName: newFile.name,
                          fileUrl: URL.createObjectURL(newFile),
                          fileObject: newFile,
                        };
                        setEditableSrtInfo({ ...editableSrtInfo, infoDocuments: updated });
                      }}
                    />

                    {file.fileUrl?.startsWith('https://') ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          const confirmDelete = window.confirm(`Delete ${file.fileName || file.fileUrl?.split('/').pop()} from S3 and DB?`);
                          if (!confirmDelete) return;

                          try {
                            await deleteFileFromS3(
                              file.fileUrl,
                              token,
                              projectData?.projectInfo,
                              'infoDocuments',
                              'infoDoc',
                              file._id,
                              null,
                              projectData?.srtInfo?._id
                            );

                            const updated = [...editableSrtInfo.infoDocuments];
                            updated.splice(index, 1);
                            setEditableSrtInfo({ ...editableSrtInfo, infoDocuments: updated });

                            alert('✅ Info Doc deleted successfully');
                          } catch (err) {
                            console.error(err);
                            alert('❌ Failed to delete Info Doc');
                          }
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          const updated = [...editableSrtInfo.infoDocuments];
                          updated.splice(index, 1);
                          setEditableSrtInfo({ ...editableSrtInfo, infoDocuments: updated });
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    setEditableSrtInfo({
                      ...editableSrtInfo,
                      infoDocuments: [
                        ...editableSrtInfo.infoDocuments,
                        { fileName: '', fileUrl: '', fileObject: null },
                      ],
                    })
                  }
                >
                  + Add Info Doc
                </button>
              </div>
            ) : srtInfo?.infoDocuments?.length ? (
              <ul>
                {srtInfo.infoDocuments.map((file) => (
                  <li key={file._id || file.fileName}>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {file.fileName || file.fileUrl?.split('/').pop()}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>N/A</p>
            )}
          </div>






          {/* Dubbed Files */}
          {/* Dubbed Files Section */}
          <section className="section">
            <div className="section-header">
              <h1 className="header-numbered">
                <span>2</span> Dubbed Files
              </h1>
            </div>

            <div>
              {isEditingProject && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary mb-3"
                  onClick={() => {
                    const newEntry = {
                      language: '',
                      trailerType: 'upload',
                      dubbedTrailerUrl: '',
                      trailerFile: null,
                      trailerFileName: '',
                      dubbedSubtitleFileName: '',
                      dubbedSubtitleUrl: '',
                      dubbedSubtitleFileObject: null,
                    };
                    setEditableProjectInfo({
                      ...editableProjectInfo,
                      dubbedFileData: [...(editableProjectInfo.dubbedFileData || []), newEntry],
                    });
                  }}
                >
                  + Add Dubbed File
                </button>
              )}

              {(editableProjectInfo?.dubbedFileData || []).length > 0 ? (
                <div className="dubbed-files-container">
                  {editableProjectInfo.dubbedFileData.map((file, i) => (
                    <div key={i} className="dubbed-file-entry mb-4">
                      {/* Language */}
                      <div className="info-row">
                        <strong>Language:</strong>
                        {isEditingProject ? (
                          <select
                            className="text-black"
                            value={file.language || ''}
                            onChange={(e) => {
                              const updated = [...editableProjectInfo.dubbedFileData];
                              updated[i].language = e.target.value;
                              setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                            }}
                          >
                            <option value="">Select Language</option>
                            {languageList.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p>{file.language || 'N/A'}</p>
                        )}
                      </div>

                      {/* Dubbed Trailer */}
                      <div className="info-row">
                        <strong>Dubbed Trailer:</strong>
                        {isEditingProject ? (
                          <>
                            {/* Upload / URL Switch */}
                            <div className="d-flex mb-2">
                              <label className="me-3">
                                <input
                                  type="radio"
                                  name={`trailerType-${i}`}
                                  value="upload"
                                  checked={file.trailerType === 'upload'}
                                  onChange={() => {
                                    const updated = [...editableProjectInfo.dubbedFileData];
                                    updated[i] = {
                                      ...updated[i],
                                      trailerType: 'upload',
                                      dubbedTrailerUrl: '',
                                      trailerFile: null,
                                      trailerFileName: '',
                                    };
                                    setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                  }}
                                /> Upload File
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name={`trailerType-${i}`}
                                  value="url"
                                  checked={file.trailerType === 'url'}
                                  onChange={() => {
                                    const updated = [...editableProjectInfo.dubbedFileData];
                                    updated[i] = {
                                      ...updated[i],
                                      trailerType: 'url',
                                      trailerFile: null,
                                      trailerFileName: '',
                                    };
                                    setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                  }}
                                /> S3 URL
                              </label>
                            </div>

                            {/* Upload input */}
                            {file.trailerType === 'upload' && (
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  const updated = [...editableProjectInfo.dubbedFileData];
                                  updated[i].trailerFile = f;
                                  updated[i].trailerFileName = f.name;
                                  updated[i].dubbedTrailerUrl = URL.createObjectURL(f);
                                  setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                }}
                              />
                            )}

                            {/* S3 URL input */}
                            {file.trailerType === 'url' && (
                              <input
                                type="text"
                                className="text-black"
                                placeholder="Enter S3 URL"
                                value={file.dubbedTrailerUrl || ''}
                                onChange={(e) => {
                                  const updated = [...editableProjectInfo.dubbedFileData];
                                  updated[i].dubbedTrailerUrl = e.target.value;
                                  updated[i].trailerFile = null;
                                  updated[i].trailerFileName = '';
                                  setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                }}
                              />
                            )}

                            {/* Preview + Buttons */}
                            {file.dubbedTrailerUrl?.trim() && (
                              <div className="mt-2">
                                <video
                                  key={file.dubbedTrailerUrl}
                                  width="360"
                                  controls
                                  src={file.dubbedTrailerUrl}
                                />
                                <div className="d-flex gap-2 mt-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                      const updated = [...editableProjectInfo.dubbedFileData];
                                      updated[i].dubbedTrailerUrl = '';
                                      updated[i].trailerFile = null;
                                      updated[i].trailerFileName = '';
                                      setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                    }}
                                  >
                                    Change Trailer
                                  </button>

                                  {file.dubbedTrailerUrl.startsWith('https://') && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger"
                                      disabled={deletingDubbedTrailerIndex === i}
                                      onClick={async () => {
                                        const confirmDelete = window.confirm('Are you sure you want to delete this dubbed trailer from S3?');
                                        if (!confirmDelete) return;

                                        try {
                                          const field = `dubbedFileData.${i}.dubbedTrailerUrl`;
                                          await deleteFileFromS3(file.dubbedTrailerUrl, token, projectData?.projectInfo, field, 'dubbed');

                                          const updated = [...editableProjectInfo.dubbedFileData];
                                          updated[i].dubbedTrailerUrl = '';
                                          updated[i].trailerFile = null;
                                          updated[i].trailerFileName = '';
                                          updated[i].trailerType = 'upload';
                                          setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });

                                          alert('Dubbed trailer deleted successfully.');
                                        } catch (err) {
                                          console.error(err);
                                          alert(err.message || 'Failed to delete dubbed trailer.');
                                        } finally {
                                          setDeletingDubbedTrailerIndex(null);
                                        }
                                      }}
                                    >
                                      {deletingDubbedTrailerIndex === i ? 'Removing...' : 'Remove Dubbed Trailer'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        ) : file?.dubbedTrailerUrl ? (
                          <video
                            width="360"
                            controls
                            key={file.dubbedTrailerUrl}
                            src={file.dubbedTrailerUrl.replace('s3://', 'https://mediashippers-filestash.s3.amazonaws.com/')}
                          />
                        ) : (
                          <p className="fst-italic">No dubbed trailer available.</p>
                        )}
                      </div>

                      {/* Dubbed SRT */}
                      <div className="info-row">
                        <strong>Dubbed SRT File:</strong>
                        {isEditingProject ? (
                          <div className="flex items-center gap-4 mt-2">
                            {file.dubbedSubtitleUrl?.startsWith('https://') && (
                              <a
                                href={file.dubbedSubtitleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {file.dubbedSubtitleFileName || 'Subtitle File'}
                              </a>
                            )}
                            <input
                              type="file"
                              accept=".srt"
                              onChange={(e) => {
                                const srt = e.target.files?.[0];
                                if (!srt) return;
                                const updated = [...editableProjectInfo.dubbedFileData];
                                updated[i].dubbedSubtitleFileName = srt.name;
                                updated[i].dubbedSubtitleUrl = URL.createObjectURL(srt);
                                updated[i].dubbedSubtitleFileObject = srt;
                                setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                              }}
                            />
                            {file.dubbedSubtitleUrl && (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={async () => {
                                  if (file.dubbedSubtitleUrl.startsWith('https://')) {
                                    const confirmDelete = window.confirm(`Delete subtitle "${file.dubbedSubtitleFileName}" from S3?`);
                                    if (!confirmDelete) return;

                                    try {
                                      const field = `dubbedFileData.${i}.dubbedSubtitleUrl`;
                                      await deleteFileFromS3(file.dubbedSubtitleUrl, token, projectData?.projectInfo, field, 'dubbed');

                                      const updated = [...editableProjectInfo.dubbedFileData];
                                      updated[i].dubbedSubtitleUrl = '';
                                      updated[i].dubbedSubtitleFileName = '';
                                      updated[i].dubbedSubtitleFileObject = null;
                                      setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });

                                      alert('Subtitle deleted successfully.');
                                    } catch (err) {
                                      console.error(err);
                                      alert('Failed to delete subtitle from S3.');
                                    }
                                  } else {
                                    const updated = [...editableProjectInfo.dubbedFileData];
                                    updated[i].dubbedSubtitleUrl = '';
                                    updated[i].dubbedSubtitleFileName = '';
                                    updated[i].dubbedSubtitleFileObject = null;
                                    setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                  }
                                }}
                              >
                                {file.dubbedSubtitleUrl.startsWith('https://') ? 'Delete' : 'Remove'}
                              </button>
                            )}
                          </div>
                        ) : file.dubbedSubtitleUrl ? (
                          <a
                            href={file.dubbedSubtitleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {file.dubbedSubtitleFileName || 'Subtitle File'}
                          </a>
                        ) : (
                          <p className="fst-italic">No subtitle uploaded.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEditingProject ? (
                <p className="fst-italic text-gray-500">No dubbed files yet uploaded.</p>
              ) : (
                <p className="fst-italic text-white">
                  There are no existing dubbed files available. Click <strong>Edit</strong> to add new dubbed files.
                </p>
              )}
            </div>
          </section>






        </section>

        {/* 2. Credits */}
        <section className="section">
          <div className="section-header flex justify-between items-center">
            <h1 className="header-numbered">
              <span>2</span> Credits
            </h1>
            <button
              onClick={() => {
                if (isEditingCredits) {
                  setEditableCreditsInfo(creditsInfo); // Reset to original
                }
                setIsEditingCredits(!isEditingCredits);
              }}
              className={`text-sm ${isEditingCredits ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
            >
              {isEditingCredits ? '❌ Cancel' : '✏️ Edit'}
            </button>

          </div>

          {/* Directors */}
          <div className="info-row">
            <strong>Directors:</strong>
            {isEditingCredits ? (
              <textarea
                value={
                  editableCreditsInfo?.directors
                    ?.map((d) => `${d.firstName} ${d.lastName}`)
                    .join('\n') || ''
                }
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  const newDirectors = lines.map((line) => {
                    const [firstName, ...lastName] = line.split(' ');
                    return { firstName, lastName: lastName.join(' ') };
                  });
                  setEditableCreditsInfo({ ...editableCreditsInfo, directors: newDirectors });
                }}
                rows={3}
                className="w-full text-black"
              />
            ) : (
              <ul>
                {creditsInfo?.directors?.map((d, i) => (
                  <li key={i}>
                    {d.firstName} {d.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Writers */}
          <div className="info-row">
            <strong>Writers:</strong>
            {isEditingCredits ? (
              <textarea
                value={
                  editableCreditsInfo?.writers
                    ?.map((w) => `${w.firstName} ${w.lastName}`)
                    .join('\n') || ''
                }
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  const newWriters = lines.map((line) => {
                    const [firstName, ...lastName] = line.split(' ');
                    return { firstName, lastName: lastName.join(' ') };
                  });
                  setEditableCreditsInfo({ ...editableCreditsInfo, writers: newWriters });
                }}
                rows={3}
                className="w-full text-black"
              />
            ) : (
              <ul>
                {creditsInfo?.writers?.map((w, i) => (
                  <li key={i}>
                    {w.firstName} {w.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Producers */}
          <div className="info-row">
            <strong>Producers:</strong>
            {isEditingCredits ? (
              <textarea
                value={
                  editableCreditsInfo?.producers
                    ?.map((p) => `${p.firstName} ${p.lastName}`)
                    .join('\n') || ''
                }
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  const newProducers = lines.map((line) => {
                    const [firstName, ...lastName] = line.split(' ');
                    return { firstName, lastName: lastName.join(' ') };
                  });
                  setEditableCreditsInfo({ ...editableCreditsInfo, producers: newProducers });
                }}
                rows={3}
                className="w-full text-black"
              />
            ) : (
              <ul>
                {creditsInfo?.producers?.map((p, i) => (
                  <li key={i}>
                    {p.firstName} {p.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actors */}
          <div className="info-row">
            <strong>Actors:</strong>
            {isEditingCredits ? (
              <textarea
                value={
                  editableCreditsInfo?.actors
                    ?.map((a) => `${a.firstName} ${a.lastName}`)
                    .join('\n') || ''
                }
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  const newActors = lines.map((line) => {
                    const [firstName, ...lastName] = line.split(' ');
                    return { firstName, lastName: lastName.join(' ') };
                  });
                  setEditableCreditsInfo({ ...editableCreditsInfo, actors: newActors });
                }}
                rows={3}
                className="w-full text-black"
              />
            ) : (
              <ul>
                {creditsInfo?.actors?.map((a, i) => (
                  <li key={i}>
                    {a.firstName} {a.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>



        {/* 3. Specifications */}
        {/* 3. Specifications */}
        <section className="section">
          <div className="section-header flex justify-between items-center">
            <h1 className="header-numbered">
              <span>3</span> Specifications
            </h1>
            <button
              onClick={() => {
                if (isEditingSpecifications) {
                  setEditableSpecificationsInfo(specificationsInfo); // Cancel edit — revert
                } else {
                  const normalizedGenres = Array.isArray(specificationsInfo?.genres)
                    ? specificationsInfo.genres.map((g) =>
                      typeof g === 'object' && g.name
                        ? g.name
                        : typeof g === 'string'
                          ? capitalizeWords(g)
                          : ''
                    )
                    : typeof specificationsInfo?.genres === 'string'
                      ? [capitalizeWords(specificationsInfo.genres)]
                      : [];

                  const [hh, mm, ss] = (specificationsInfo.runtime || '00:00:00')
                    .split(':')
                    .map((v) => parseInt(v) || 0);

                  setEditableSpecificationsInfo({
                    ...specificationsInfo,
                    // ✅ Use raw projectType value instead of capitalized
                    projectType: specificationsInfo?.projectType || '',
                    genres: normalizedGenres,
                    runtimeHours: hh,
                    runtimeMinutes: mm,
                    runtimeSeconds: ss,
                  });
                }

                setIsEditingSpecifications(!isEditingSpecifications);
              }}


              className={`text-sm ${isEditingSpecifications ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
            >
              {isEditingSpecifications ? '❌ Cancel' : '✏️ Edit'}
            </button>
          </div>

          {/* Project Type */}
          <div className="info-row">
            <strong className="text-white">Project Type:</strong>
            {isEditingSpecifications ? (
              <select
                className="text-black w-full"
                value={editableSpecificationsInfo.projectType || ''}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  const isFilmType = ['Feature Film', 'Short Film', 'Documentary'].includes(selectedType);

                  setEditableSpecificationsInfo((prev) => ({
                    ...prev,
                    projectType: selectedType,
                    seasonNumber: isFilmType ? undefined : prev.seasonNumber ?? 1,
                    numberOfEpisodes: isFilmType ? undefined : prev.numberOfEpisodes ?? 1,
                  }));
                }}
              >
                <option value="">Select Project Type</option>
                {projectTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <p className="text-white">{specificationsInfo?.projectType || 'N/A'}</p>
            )}
          </div>

          {/* Show Season & Episodes fields ONLY for non-film types */}
          {isEditingSpecifications &&
            editableSpecificationsInfo.projectType &&
            !['Feature Film', 'Short Film', 'Documentary'].includes(
              editableSpecificationsInfo.projectType
            ) && (
              <>
                {/* Season Number */}
                <div className="info-row">
                  <strong className="text-white">Season Number:</strong>
                  <input
                    type="number"
                    min={1}
                    className="text-black w-full"
                    value={editableSpecificationsInfo.seasonNumber ?? ''}
                    onChange={(e) =>
                      setEditableSpecificationsInfo({
                        ...editableSpecificationsInfo,
                        seasonNumber: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                {/* Number of Episodes */}
                <div className="info-row">
                  <strong className="text-white">Number of Episodes:</strong>
                  <input
                    type="number"
                    min={1}
                    className="text-black w-full"
                    value={editableSpecificationsInfo.numberOfEpisodes ?? ''}
                    onChange={(e) =>
                      setEditableSpecificationsInfo({
                        ...editableSpecificationsInfo,
                        numberOfEpisodes: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </>
            )}



          {/* Genre(s) */}
          <div className="info-row">
            <strong>Genre:</strong>
            {isEditingSpecifications ? (
              <select
                className="text-black"
                value={
                  Array.isArray(editableSpecificationsInfo.genres)
                    ? editableSpecificationsInfo.genres[0]
                    : editableSpecificationsInfo.genres || ''
                }
                onChange={(e) =>
                  setEditableSpecificationsInfo({
                    ...editableSpecificationsInfo,
                    genres: [e.target.value],
                  })
                }
              >
                <option value="">Select a genre</option>
                {genresOptions.map((genre) => {
                  const genreName = typeof genre === 'string' ? genre : genre.name;
                  return (
                    <option key={genreName} value={genreName}>
                      {genreName}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p>
                {Array.isArray(specificationsInfo?.genres)
                  ? specificationsInfo.genres
                    .map((g) =>
                      typeof g === 'object' && g.name ? g.name : g
                    )
                    .filter(Boolean)
                    .join(', ')
                  : specificationsInfo?.genres || 'N/A'}
              </p>
            )}
          </div>

          {/* Language */}
          <div className="info-row">
            <strong>Language:</strong>
            {isEditingSpecifications ? (
              <select
                className="text-black"
                value={editableSpecificationsInfo.language || ''}
                onChange={(e) =>
                  setEditableSpecificationsInfo({
                    ...editableSpecificationsInfo,
                    language: e.target.value,
                  })
                }
              >
                <option value="">-- Select Language --</option>
                {languageList.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            ) : (
              <p>{specificationsInfo?.language || 'N/A'}</p>
            )}
          </div>

          {/* Rating */}
          <div className="info-row">
            <strong>Rating:</strong>
            {isEditingSpecifications ? (
              <select
                className="text-black"
                value={editableSpecificationsInfo.rating || ''}
                onChange={(e) =>
                  setEditableSpecificationsInfo({
                    ...editableSpecificationsInfo,
                    rating: e.target.value,
                  })
                }
                style={{ width: '340px', padding: '10px', borderRadius: '10px' }}
              >
                <option value="">Select rating</option>
                {/* (Keep all optgroups and options as-is here) */}
                {/* Your long list of rating <optgroup> and <option> tags goes here */}
              </select>
            ) : (
              <p>{specificationsInfo?.rating || 'N/A'}</p>
            )}
          </div>

          {/* Completion Date */}
          <div className="info-row">
            <strong>Completion Date:</strong>
            {isEditingSpecifications ? (
              <input
                className="text-black"
                type="date"
                value={
                  editableSpecificationsInfo.completionDate
                    ? new Date(editableSpecificationsInfo.completionDate)
                      .toISOString()
                      .substring(0, 10)
                    : ''
                }
                onChange={(e) =>
                  setEditableSpecificationsInfo({
                    ...editableSpecificationsInfo,
                    completionDate: e.target.value,
                  })
                }
              />
            ) : (
              <p>
                {specificationsInfo?.completionDate
                  ? new Date(specificationsInfo.completionDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            )}
          </div>

          {/* Runtime */}
          <div className="info-row">
            <strong>Runtime:</strong>
            {isEditingSpecifications ? (
              <div className="flex gap-2 items-center text-black">
                <input
                  type="number"
                  placeholder="HH"
                  min={0}
                  value={editableSpecificationsInfo.runtimeHours ?? ''}
                  onChange={(e) =>
                    setEditableSpecificationsInfo({
                      ...editableSpecificationsInfo,
                      runtimeHours: parseInt(e.target.value) || 0,
                    })
                  }
                  style={{ width: '60px', padding: '5px', borderRadius: '5px' }}
                />
                <span>:</span>
                <input
                  type="number"
                  placeholder="MM"
                  min={0}
                  max={59}
                  value={editableSpecificationsInfo.runtimeMinutes ?? ''}
                  onChange={(e) =>
                    setEditableSpecificationsInfo({
                      ...editableSpecificationsInfo,
                      runtimeMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  style={{ width: '60px', padding: '5px', borderRadius: '5px' }}
                />
                <span>:</span>
                <input
                  type="number"
                  placeholder="SS"
                  min={0}
                  max={59}
                  value={editableSpecificationsInfo.runtimeSeconds ?? ''}
                  onChange={(e) =>
                    setEditableSpecificationsInfo({
                      ...editableSpecificationsInfo,
                      runtimeSeconds: parseInt(e.target.value) || 0,
                    })
                  }
                  style={{ width: '60px', padding: '5px', borderRadius: '5px' }}
                />
              </div>
            ) : (
              <p>
                {specificationsInfo?.runtime
                  ? specificationsInfo.runtime
                  : specificationsInfo?.runtimeHours !== undefined
                    ? `${String(specificationsInfo.runtimeHours || 0).padStart(2, '0')}:${String(
                      specificationsInfo.runtimeMinutes || 0
                    ).padStart(2, '0')}:${String(specificationsInfo.runtimeSeconds || 0).padStart(2, '0')}`
                    : 'N/A'}
              </p>
            )}
          </div>
        </section>


        {/* 5. Rights Info */}
        <section className="section">
          <div className="section-header flex justify-between items-center">
            <h1 className="header-numbered">
              <span>5</span> Rights Info
            </h1>
            <button
              onClick={() => {
                if (isEditingRights) {
                  setEditableRightsInfo(rightsInfo); // Reset edits
                }
                setIsEditingRights(!isEditingRights);
              }}
              className={`text-sm ${isEditingRights ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
            >
              {isEditingRights ? '❌ Cancel' : '✏️ Edit'}
            </button>
          </div>

          {/* Loop through normalized rights groups */}
          {normalizedRightsGroups.map((group, index) => (
            <div key={index} className="border border-gray-700 rounded p-4 mt-4 space-y-4">

              {/* Rights */}
              <div className="info-row">
                <strong>Rights:</strong>
                {isEditingRights ? (
                  <select
                    className="text-white bg-gray-800 px-2 py-1 rounded"
                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                    value={editableRightsInfo.rights?.name || ''}
                    onChange={(e) => {
                      const selected = rightsOptions.find((option) => option.name === e.target.value);
                      setEditableRightsInfo({
                        ...editableRightsInfo,
                        rights: selected ? { name: selected.name } : null,
                      });
                    }}
                  >
                    <option value="">Select Rights</option>
                    {rightsOptions.map((option) => (
                      <option key={option.id || option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                ) : group?.rights?.length ? (
                  <p>{group.rights.map((r) => r.name).join(', ')}</p>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              {/* Territories */}
              <div className="info-row">
                <strong className="text-white">Territories:</strong>
                {isEditingRights ? (
                  <div className="text-white space-y-4 flex flex-wrap gap-4">
                    {/* Included Regions */}
                    <div className="flex-1 min-w-[300px]">
                      <label className="font-semibold text-white">Included Regions:</label>
                      <Multiselect
                        className="text-white bg-gray-800"
                        style={{ color: 'white', backgroundColor: '#1f2937' }}
                        options={[
                          { name: 'Worldwide', id: 'worldwide' },
                          ...territoryGroupedOptions.map((group) => ({
                            name: group.groupName,
                            id: group.groupId,
                          })),
                        ]}
                        selectedValues={editableRightsInfo.territories?.includedRegions || []}
                        onSelect={(selectedList, selectedItem) => {
                          if (selectedItem.id === 'worldwide') {
                            setEditableRightsInfo((prev) => ({
                              ...prev,
                              territories: {
                                includedRegions: [{ name: 'Worldwide', id: 'worldwide' }],
                                excludeCountries: [],
                              },
                            }));
                          } else {
                            const filtered = selectedList.filter((r) => r.id !== 'worldwide');
                            setEditableRightsInfo((prev) => ({
                              ...prev,
                              territories: {
                                includedRegions: filtered,
                                excludeCountries: [],
                              },
                            }));
                          }
                        }}
                        onRemove={(selectedList) => {
                          setEditableRightsInfo((prev) => ({
                            ...prev,
                            territories: {
                              includedRegions: selectedList,
                              excludeCountries: [],
                            },
                          }));
                        }}
                        displayValue="name"
                        showCheckbox
                        closeIcon="cancel"
                      />
                      {editableRightsInfo.territories?.includedRegions?.some((r) => r.id === 'worldwide') && (
                        <p className="text-sm text-gray-400 mt-1">
                          Other regions are hidden when "Worldwide" is selected.
                        </p>
                      )}
                    </div>

                    {/* Excluded Countries */}
                    <div className="flex-1 min-w-[300px]">
                      <label className="font-semibold text-white">Excluded Countries:</label>
                      <Multiselect
                        className="text-white bg-gray-800"
                        style={{ color: 'white', backgroundColor: '#1f2937' }}
                        options={getCountryOptionsByRegionIds(editableRightsInfo.territories?.includedRegions || [])}
                        selectedValues={editableRightsInfo.territories?.excludeCountries || []}
                        onSelect={(selectedList) => {
                          setEditableRightsInfo((prev) => ({
                            ...prev,
                            territories: {
                              ...prev.territories,
                              excludeCountries: selectedList,
                            },
                          }));
                        }}
                        onRemove={(selectedList) => {
                          setEditableRightsInfo((prev) => ({
                            ...prev,
                            territories: {
                              ...prev.territories,
                              excludeCountries: selectedList,
                            },
                          }));
                        }}
                        displayValue="name"
                        showCheckbox
                        closeIcon="cancel"
                        disable={!editableRightsInfo.territories?.includedRegions?.length}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-white">
                    {group?.territories?.includedRegions?.length > 0 && (
                      <p>
                        <strong>Included:</strong>{' '}
                        {group.territories.includedRegions.map((r) => r.name).join(', ')}
                      </p>
                    )}
                    {group?.territories?.excludeCountries?.length > 0 && (
                      <p>
                        <strong>Excluded:</strong>{' '}
                        {group.territories.excludeCountries.map((c) => `${c.name} (${c.region})`).join(', ')}
                      </p>
                    )}
                    {(!group?.territories?.includedRegions?.length &&
                      !group?.territories?.excludeCountries?.length) && <p>N/A</p>}
                  </div>
                )}
              </div>

              {/* License Term */}
              <div className="info-row">
                <strong className="text-white">License Term:</strong>
                {isEditingRights ? (
                  <Multiselect
                    className="text-white bg-gray-800"
                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                    options={licenseTermOptions}
                    selectedValues={editableRightsInfo.licenseTerm || []}
                    onSelect={(selectedList) => {
                      setEditableRightsInfo((prev) => ({
                        ...prev,
                        licenseTerm: selectedList,
                      }));
                    }}
                    onRemove={(selectedList) => {
                      setEditableRightsInfo((prev) => ({
                        ...prev,
                        licenseTerm: selectedList,
                      }));
                    }}
                    displayValue="name"
                    showCheckbox
                    closeIcon="cancel"
                    selectionLimit={1}
                  />
                ) : group?.licenseTerm?.length ? (
                  <p className="text-white">{group.licenseTerm.map((l) => l.name).join(', ')}</p>
                ) : (
                  <p className="text-white">N/A</p>
                )}
              </div>

              {/* Usage Rights */}
              <div className="info-row">
                <strong className="text-white">Usage Rights:</strong>
                {isEditingRights ? (
                  <Multiselect
                    className="text-white bg-gray-800"
                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                    options={usageRightsOptions}
                    selectedValues={editableRightsInfo.usageRights || []}
                    onSelect={(selectedList) => {
                      setEditableRightsInfo((prev) => ({
                        ...prev,
                        usageRights: selectedList,
                      }));
                    }}
                    onRemove={(selectedList) => {
                      setEditableRightsInfo((prev) => ({
                        ...prev,
                        usageRights: selectedList,
                      }));
                    }}
                    displayValue="name"
                    showCheckbox
                    closeIcon="cancel"
                    selectionLimit={1}
                  />
                ) : group?.usageRights?.length ? (
                  <p className="text-white">{group.usageRights.map((u) => u.name).join(', ')}</p>
                ) : (
                  <p className="text-white">N/A</p>
                )}
              </div>

              {/* Payment Terms */}
              <div className="info-row">
                <strong className="text-white">Payment Terms:</strong>
                {isEditingRights ? (
                  <Multiselect
                    className="text-white bg-gray-800"
                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                    options={paymentTermsOptions}
                    selectedValues={editableRightsInfo.paymentTerms || []}
                    onSelect={(selectedList) => {
                      setEditableRightsInfo((prev) => ({
                        ...prev,
                        paymentTerms: selectedList,
                      }));
                    }}
                    onRemove={(selectedList) => {
                      setEditableRightsInfo((prev) => ({
                        ...prev,
                        paymentTerms: selectedList,
                      }));
                    }}
                    displayValue="name"
                    showCheckbox
                    closeIcon="cancel"
                    selectionLimit={1}
                  />
                ) : group?.paymentTerms?.length ? (
                  <p className="text-white">{group.paymentTerms.map((p) => p.name).join(', ')}</p>
                ) : (
                  <p className="text-white">N/A</p>
                )}
              </div>

              {/* List Price */}
              <div className="info-row">
                <strong>List Price:</strong>
                {isEditingRights ? (
                  <input
                    className="text-white bg-gray-800 px-2 py-1 rounded"
                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                    type="number"
                    value={editableRightsInfo.listPrice || ''}
                    onChange={(e) =>
                      setEditableRightsInfo({ ...editableRightsInfo, listPrice: e.target.value })
                    }
                  />
                ) : (
                  <p>{group?.listPrice || 'N/A'}</p>
                )}
              </div>
            </div>
          ))}
        </section>





        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveProjectInfo}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            💾 Save Project
          </button>
        </div>

      </div>
      {
        savingProject && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
            style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw' }}
          >
            <Loader />
          </div>
        )
      }
    </>

  );

}

export default ViewAndEditForm;
