import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewAndEditFormCss.css';
import Loader from '../loader/Loader';
import { UserContext } from '../../contexts/UserContext';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';


function ViewAndEditForm() {


  
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);


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
        const response = await axios.get(`https://www.mediashippers.com/api/project-form/data/${projectId}`, {
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
          const response = await axios.get(`https://www.mediashippers.com/api/users/${projectData.projectInfo.userId}`, {
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
        `https://www.mediashippers.com/api/project-form/delete/${projectId}`,
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

const handleSaveProjectInfo = async () => {
  try {
    const formData = new FormData();
    if (posterFile) formData.append('projectPoster', posterFile);
    if (bannerFile) formData.append('projectBanner', bannerFile);
    if (trailerFile) formData.append('projectTrailer', trailerFile);

    formData.append('projectName', editableProjectInfo.projectName);
    formData.append('orgName', orgName);
    formData.append('userId', userId);

    const uploadResponse = await fetch('https://www.mediashippers.com/api/files/upload-file', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!uploadResponse.ok) throw new Error('File upload failed');
    const uploadedUrls = await uploadResponse.json();

    const updatedData = {
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
    };

    const resp = await fetch(`https://www.mediashippers.com/api/project-form/update/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectInfo: updatedData }),
    });
    if (!resp.ok) throw new Error('Failed to update project info');

    setEditableProjectInfo(prev => ({ ...prev, ...updatedData }));
    setUpdatedProjectInfo(prev => ({ ...prev, ...updatedData }));
    alert('✅ Project updated successfully!');
  } catch (err) {
    console.error(err);
    alert('Error saving project data');
  }
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

    const bucketBase = `https://${bucket}.s3.amazonaws.com/`;

    if (!url.startsWith(bucketBase)) {
      throw new Error('Invalid S3 URL format');
    }

    return decodeURIComponent(url.replace(bucketBase, ''));
  }
  // deleteFileFromS3.js





  const deleteFileFromS3 = async (fileUrl, token) => {
    const region = import.meta.env.VITE_AWS_REGION;
    const bucket = import.meta.env.VITE_S3_BUCKET_NAME;

    const possiblePrefixes = [
      `https://${bucket}.s3.${region}.amazonaws.com/`,
      `https://${bucket}.s3.amazonaws.com/`,
    ];

    const matchedPrefix = possiblePrefixes.find(prefix => fileUrl.startsWith(prefix));

    if (!matchedPrefix) {
      throw new Error('Invalid S3 file URL');
    }

    const filePath = decodeURIComponent(fileUrl.replace(matchedPrefix, ''));

    const response = await fetch(
      `https://www.mediashippers.com/api/project-form/delete-file?fileUrl=${encodeURIComponent(fileUrl)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error || 'Failed to delete file from S3');
    }
  };








  return (
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
              value={editableProjectInfo.isPublic || false}
              onChange={(e) =>
                setEditableProjectInfo({ ...editableProjectInfo, isPublic: e.target.value === 'true' })
              }
            >
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
          ) : (
            <p>{projectInfo?.isPublic ? 'Public' : 'Private' || 'N/A'}</p>
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
          const confirmDelete = window.confirm('Are you sure you want to delete this poster from S3?');
          if (!confirmDelete) return;

          setDeletingPoster(true);
          try {
            const key = editableProjectInfo.projectPosterS3Url.replace(
              'https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/',
              ''
            );
            await deleteFileFromS3(key, token);

            setPosterFile(null);
            setEditableProjectInfo((prev) => ({
              ...prev,
              projectPosterS3Url: '',
            }));

            alert('Poster deleted from S3 successfully.');
          } catch (err) {
            console.error('Error deleting poster:', err);
            alert('Failed to delete poster from S3.');
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
              setEditableProjectInfo((prev) => ({
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
              setEditableProjectInfo((prev) => ({
                ...prev,
                bannerInputType: 'url',
                projectBannerS3Url: prev.projectBannerS3Url || '',
              }));
            }}
          /> S3 URL
        </label>
      </div>

      {/* ✅ Show preview if URL exists */}
      {editableProjectInfo.projectBannerS3Url && !deletingBanner && (
        <div className="mb-2">
          <img
            src={encodeURI(editableProjectInfo.projectBannerS3Url)}
            alt="Banner Preview"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
          {/* <p className="small text-white mt-1">{editableProjectInfo.projectBannerS3Url}</p> */}
        </div>
      )}

      {/* ✅ Remove from S3 */}
      <button
        type="button"
        onClick={async () => {
          const confirmDelete = window.confirm('Are you sure you want to delete this banner from S3?');
          if (!confirmDelete) return;

          setDeletingBanner(true);
          try {
            const key = editableProjectInfo.projectBannerS3Url.replace(
              'https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/',
              ''
            );
            await deleteFileFromS3(key, token);

            setBannerFile(null);
            setEditableProjectInfo((prev) => ({
              ...prev,
              projectBannerS3Url: '',
            }));

            alert('Banner deleted from S3 successfully.');
          } catch (err) {
            console.error('Error deleting banner:', err);
            alert('Failed to delete banner from S3.');
          } finally {
            setDeletingBanner(false);
          }
        }}
        className="btn btn-sm btn-danger mt-1"
        disabled={deletingBanner}
      >
        {deletingBanner ? 'Removing...' : 'Remove Banner'}
      </button>

      {/* ✅ Upload File */}
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
                setEditableProjectInfo((prev) => ({
                  ...prev,
                  projectBannerS3Url: previewUrl, // show preview before saving
                }));
              }}
            />
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setBannerFile(null);
                  setEditableProjectInfo((prev) => ({
                    ...prev,
                    projectBannerS3Url: '',
                  }));
                }}
              >
                Change Banner
              </button>
            </div>
          )}
          <p className="text-muted small mt-1">Preview only. Final S3 URL saved after clicking Save.</p>
        </>
      )}

      {/* ✅ S3 URL Entry */}
      {editableProjectInfo.bannerInputType === 'url' && (
        <input
          type="text"
          value={editableProjectInfo.projectBannerS3Url || ''}
          onChange={(e) =>
            setEditableProjectInfo((prev) => ({
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
      {/* <p className="small text-white mt-1">{editableProjectInfo.projectBannerS3Url}</p> */}
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
                  const key = editableProjectInfo.projectTrailerS3Url.replace(
                    'https://mediashippers-filestash.s3.amazonaws.com/',
                    ''
                  );
                  await deleteFileFromS3(key, token);

                  setEditableProjectInfo((prev) => ({
                    ...prev,
                    projectTrailerS3Url: '',
                    trailerFileName: '',
                  }));
                  setTrailerFile(null);
                  alert('Trailer deleted from S3 successfully.');
                } catch (err) {
                  console.error('Error deleting trailer:', err);
                  alert('Failed to delete trailer from S3.');
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

        {/* SRT Files */}
        <div className="info-row">
          <strong>SRT Files:</strong>
          {isEditingProject ? (
            <textarea
              rows={3}
              className="w-full text-black"
              value={editableSrtInfo.srtFiles?.map(f => f.fileName).join('\n') || ''}
              onChange={(e) => {
                const fileNames = e.target.value.split('\n').filter(Boolean);
                // Keep existing URLs if possible, else empty string
                const updatedSrtFiles = fileNames.map((name, i) => ({
                  fileName: name,
                  fileUrl: editableSrtInfo.srtFiles?.[i]?.fileUrl || '',
                }));
                setEditableSrtInfo({ ...editableSrtInfo, srtFiles: updatedSrtFiles });
              }}
            />
          ) : srtInfo?.srtFiles?.length ? (
            <ul>
              {srtInfo.srtFiles.map((file) => (
                <li key={file._id || file.fileName}>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>N/A</p>
          )}
        </div>

        {/* Info Docs */}
        <div className="info-row">
          <strong>Info Docs:</strong>
          {isEditingProject ? (
            <textarea
              rows={3}
              className="w-full text-black"
              value={editableSrtInfo.infoDocuments?.map(f => f.fileName).join('\n') || ''}
              onChange={(e) => {
                const fileNames = e.target.value.split('\n').filter(Boolean);
                const updatedInfoDocs = fileNames.map((name, i) => ({
                  fileName: name,
                  fileUrl: editableSrtInfo.infoDocuments?.[i]?.fileUrl || '',
                }));
                setEditableSrtInfo({ ...editableSrtInfo, infoDocuments: updatedInfoDocs });
              }}
            />
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
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>N/A</p>
          )}
        </div>



        {/* Dubbed Files */}
        <section className="section">
          <div className="section-header">
            <h1 className="header-numbered">
              <span>2</span> Dubbed Files
            </h1>
          </div>

          <div>
            {projectInfo?.dubbedFileData?.length ? (
              <div className="dubbed-files-container">
                {projectInfo.dubbedFileData.map((file, i) => (
                  <div key={i} className="dubbed-file-entry mb-4">
                    {/* Language */}
                    <div className="info-row">
                      <strong>Language:</strong>
                      {isEditingProject ? (
                        <input
                          className="text-black"
                          type="text"
                          value={editableProjectInfo.dubbedFileData?.[i]?.language || ''}
                          onChange={(e) => {
                            const newDubbed = [...(editableProjectInfo.dubbedFileData || [])];
                            newDubbed[i] = { ...newDubbed[i], language: e.target.value };
                            setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: newDubbed });
                          }}
                        />
                      ) : (
                        <p>{file.language}</p>
                      )}
                    </div>

                    {/* Dubbed Trailer */}
                    {/* Dubbed Trailer */}
                    <div className="info-row">
                      <strong>Dubbed Trailer:</strong>

                      {isEditingProject ? (
                        <>
                          {/* Upload / URL Switch */}
                          <div>
                            <label>
                              <input
                                type="radio"
                                name={`trailerType-${i}`}
                                value="upload"
                                checked={file.trailerType === 'upload'}
                                onChange={() => {
                                  const updated = [...editableProjectInfo.dubbedFileData];
                                  updated[i] = { ...updated[i], trailerType: 'upload', dubbedTrailerUrl: '' };
                                  setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                }}
                              /> Upload
                            </label>

                            <label className="ms-3">
                              <input
                                type="radio"
                                name={`trailerType-${i}`}
                                value="url"
                                checked={file.trailerType === 'url'}
                                onChange={() => {
                                  const updated = [...editableProjectInfo.dubbedFileData];
                                  updated[i] = { ...updated[i], trailerType: 'url', dubbedTrailerUrl: '' };
                                  setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                                }}
                              /> S3 URL
                            </label>
                          </div>

                          {/* Upload */}
                          {file.trailerType === 'upload' && (
                            <input
                              type="file"
                              accept="video/*"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const uploaded = await uploadDubbedTrailerFile(f); // Upload logic
                                const updated = [...editableProjectInfo.dubbedFileData];
                                updated[i].dubbedTrailerUrl = uploaded.fileUrl;
                                setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                              }}
                            />
                          )}

                          {/* S3 URL */}
                          {file.trailerType === 'url' && (
                            <input
                              className="text-black"
                              type="text"
                              placeholder="Enter S3 URL"
                              value={file.dubbedTrailerUrl || ''}
                              onChange={(e) => {
                                const updated = [...editableProjectInfo.dubbedFileData];
                                updated[i].dubbedTrailerUrl = e.target.value;
                                setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });
                              }}
                            />
                          )}

                          {/* Preview + Remove */}
                          {file.dubbedTrailerUrl?.trim() !== '' && (
                            <div className="mt-2">
                              <video
                                key={file.dubbedTrailerUrl} // force re-render when URL changes
                                width="360"
                                controls
                                src={`${file.dubbedTrailerUrl}?t=${Date.now()}`} // cache buster
                              />
                              <p className="small text-white mt-1">{file.dubbedTrailerUrl}</p>

                              <button
                                className="btn btn-sm btn-danger mt-1"
                                disabled={deletingDubbedTrailerIndex === i}
                                onClick={async () => {
                                  const confirmDelete = window.confirm('Are you sure you want to delete this dubbed trailer from S3?');
                                  if (!confirmDelete) return;

                                  setDeletingDubbedTrailerIndex(i);
                                  try {
                                    const key = file.dubbedTrailerUrl.replace(
                                      'https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/',
                                      ''
                                    );

                                    await deleteFileFromS3(key, token);

                                    const updated = [...editableProjectInfo.dubbedFileData];
                                    updated[i].dubbedTrailerUrl = '';
                                    updated[i].trailerType = 'upload'; // reset
                                    setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: updated });

                                    alert('Dubbed trailer deleted successfully.');
                                  } catch (err) {
                                    console.error(err);
                                    alert('Failed to delete trailer from S3.');
                                  } finally {
                                    setDeletingDubbedTrailerIndex(null);
                                  }
                                }}
                              >
                                {deletingDubbedTrailerIndex === i ? 'Removing...' : 'Remove Trailer'}
                              </button>
                            </div>
                          )}
                        </>
                      ) : file.dubbedTrailerUrl ? (
                        <video
                          width="360"
                          controls
                          key={file.dubbedTrailerUrl}
                          src={`${file.dubbedTrailerUrl.replace('s3://', 'https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/')}`}
                        />
                      ) : (
                        <p className="fst-italic">No dubbed trailer available.</p>
                      )}
                    </div>



                    {/* Subtitle */}
                    <div className="info-row">
                      <strong>Subtitle URL:</strong>
                      {isEditingProject ? (
                        <>


                          {editableProjectInfo.dubbedFileData?.[i]?.dubbedSubtitleUrl && (
                            <div className="mt-2">
                              <a
                                href={editableProjectInfo.dubbedFileData[i].dubbedSubtitleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {editableProjectInfo.dubbedFileData[i].dubbedSubtitleFileName || 'View Subtitle'}
                              </a>
                              <p></p>

                              <button
                                className="btn btn-sm btn-danger ms-2"
                                disabled={deletingDubbedSubtitleIndex === i}
                                onClick={async () => {
                                  const confirmed = window.confirm('Delete this subtitle file from S3?');
                                  if (!confirmed) return;

                                  setDeletingDubbedSubtitleIndex(i);
                                  try {
                                    await deleteFileFromS3(editableProjectInfo.dubbedFileData[i].dubbedSubtitleUrl, token);
                                    const newDubbed = [...editableProjectInfo.dubbedFileData];
                                    newDubbed[i].dubbedSubtitleUrl = '';
                                    newDubbed[i].dubbedSubtitleFileName = '';
                                    setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: newDubbed });
                                    alert('Subtitle file deleted.');
                                  } catch (err) {
                                    console.error(err);
                                    alert('Failed to delete subtitle.');
                                  } finally {
                                    setDeletingDubbedSubtitleIndex(null);
                                  }
                                }}
                              >
                                {deletingDubbedSubtitleIndex === i ? 'Removing...' : 'Remove Subtitle'}
                              </button>
                            </div>
                          )}
                        </>
                      ) : file.dubbedSubtitleUrl ? (
                        <a
                          href={file.dubbedSubtitleUrl.replace(
                            's3://',
                            'https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.dubbedSubtitleFileName}
                        </a>
                      ) : (
                        <p>N/A</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>N/A</p>
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
      <section className="section">
        <div className="section-header flex justify-between items-center">
          <h1 className="header-numbered">
            <span>3</span> Specifications
          </h1>
          <button
            onClick={() => {
              if (isEditingSpecifications) {
                setEditableSpecificationsInfo(specificationsInfo);
              }
              setIsEditingSpecifications(!isEditingSpecifications);
            }}
            className={`text-sm ${isEditingSpecifications ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
          >
            {isEditingSpecifications ? '❌ Cancel' : '✏️ Edit'}
          </button>

        </div>

        <div className="info-row">
          <strong>Project Type:</strong>
          {isEditingSpecifications ? (
            <input className="text-black"
              type="text"
              value={editableSpecificationsInfo.projectType || ''}
              onChange={(e) =>
                setEditableSpecificationsInfo({ ...editableSpecificationsInfo, projectType: e.target.value })
              }
            />
          ) : (
            <p>{specificationsInfo?.projectType || 'N/A'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Genre(s):</strong>
          {isEditingSpecifications ? (
            <input className="text-black"
              type="text"
              value={editableSpecificationsInfo.genres || ''}
              onChange={(e) =>
                setEditableSpecificationsInfo({ ...editableSpecificationsInfo, genres: e.target.value })
              }
            />
          ) : (
            <p>{specificationsInfo?.genres || 'N/A'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Language:</strong>
          {isEditingSpecifications ? (
            <input className="text-black"
              type="text"
              value={editableSpecificationsInfo.language || ''}
              onChange={(e) =>
                setEditableSpecificationsInfo({ ...editableSpecificationsInfo, language: e.target.value })
              }
            />
          ) : (
            <p>{specificationsInfo?.language || 'N/A'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Rating:</strong>
          {isEditingSpecifications ? (
            <input className="text-black"
              type="text"
              value={editableSpecificationsInfo.rating || ''}
              onChange={(e) =>
                setEditableSpecificationsInfo({ ...editableSpecificationsInfo, rating: e.target.value })
              }
            />
          ) : (
            <p>{specificationsInfo?.rating || 'N/A'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Completion Date:</strong>
          {isEditingSpecifications ? (
            <input className="text-black"
              type="date"
              value={
                editableSpecificationsInfo.completionDate
                  ? new Date(editableSpecificationsInfo.completionDate).toISOString().substring(0, 10)
                  : ''
              }
              onChange={(e) =>
                setEditableSpecificationsInfo({ ...editableSpecificationsInfo, completionDate: e.target.value })
              }
            />
          ) : (
            <p>{specificationsInfo?.completionDate ? new Date(specificationsInfo.completionDate).toLocaleDateString() : 'N/A'}</p>
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

  {/* Rights */}
  <div className="info-row">
    <strong>Rights:</strong>
    {isEditingRights ? (
      <input
        className="text-black"
        type="text"
        value={editableRightsInfo.rights?.map(r => r.name).join(', ') || ''}
        onChange={(e) =>
          setEditableRightsInfo({
            ...editableRightsInfo,
            rights: e.target.value.split(',').map(name => ({ name: name.trim() })).filter(r => r.name),
          })
        }
      />
    ) : rightsInfo?.rights?.length ? (
      <p>{rightsInfo.rights.map((r) => r.name).join(', ')}</p>
    ) : (
      <p>N/A</p>
    )}
  </div>

  {/* Territories */}
  <div className="info-row">
    <strong>Territories:</strong>
    {isEditingRights ? (
      <div className="text-black space-y-2">
        <div>
          <label className="font-semibold">Included Regions:</label>
          <input
            type="text"
            className="w-full mt-1"
            value={editableRightsInfo.territories?.includedRegions?.map(r => r.name).join(', ') || ''}
            onChange={(e) =>
              setEditableRightsInfo((prev) => ({
                ...prev,
                territories: {
                  ...prev.territories,
                  includedRegions: e.target.value
                    .split(',')
                    .map(name => ({ name: name.trim(), id: name.toLowerCase().replace(/\s+/g, '-') }))
                    .filter(r => r.name),
                },
              }))
            }
          />
        </div>

        <div>
          <label className="font-semibold">Excluded Countries:</label>
          <input
            type="text"
            className="w-full mt-1"
            value={editableRightsInfo.territories?.excludeCountries?.map(c => c.name).join(', ') || ''}
            onChange={(e) =>
              setEditableRightsInfo((prev) => ({
                ...prev,
                territories: {
                  ...prev.territories,
                  excludeCountries: e.target.value
                    .split(',')
                    .map(name => ({ name: name.trim(), region: '', selected: false }))
                    .filter(c => c.name),
                },
              }))
            }
          />
        </div>
      </div>
    ) : (
      <div>
        {rightsInfo?.territories?.includedRegions?.length > 0 && (
          <p>
            <strong>Included:</strong>{' '}
            {rightsInfo.territories.includedRegions.map(r => r.name).join(', ')}
          </p>
        )}
        {rightsInfo?.territories?.excludeCountries?.length > 0 && (
          <p>
            <strong>Excluded:</strong>{' '}
            {rightsInfo.territories.excludeCountries.map(c => `${c.name} (${c.region})`).join(', ')}
          </p>
        )}
        {(!rightsInfo?.territories?.includedRegions?.length &&
          !rightsInfo?.territories?.excludeCountries?.length) && <p>N/A</p>}
      </div>
    )}
  </div>

  {/* License Term */}
  <div className="info-row">
    <strong>License Term:</strong>
    {isEditingRights ? (
      <input
        className="text-black"
        type="text"
        value={editableRightsInfo.licenseTerm?.map(l => l.name).join(', ') || ''}
        onChange={(e) =>
          setEditableRightsInfo({
            ...editableRightsInfo,
            licenseTerm: e.target.value.split(',').map(name => ({ name: name.trim() })).filter(l => l.name),
          })
        }
      />
    ) : rightsInfo?.licenseTerm?.length ? (
      <p>{rightsInfo.licenseTerm.map((l) => l.name).join(', ')}</p>
    ) : (
      <p>N/A</p>
    )}
  </div>

  {/* Usage Rights */}
  <div className="info-row">
    <strong>Usage Rights:</strong>
    {isEditingRights ? (
      <input
        className="text-black"
        type="text"
        value={editableRightsInfo.usageRights?.map(u => u.name).join(', ') || ''}
        onChange={(e) =>
          setEditableRightsInfo({
            ...editableRightsInfo,
            usageRights: e.target.value.split(',').map(name => ({ name: name.trim() })).filter(u => u.name),
          })
        }
      />
    ) : rightsInfo?.usageRights?.length ? (
      <p>{rightsInfo.usageRights.map((u) => u.name).join(', ')}</p>
    ) : (
      <p>N/A</p>
    )}
  </div>

  {/* Payment Terms */}
  <div className="info-row">
    <strong>Payment Terms:</strong>
    {isEditingRights ? (
      <input
        className="text-black"
        type="text"
        value={editableRightsInfo.paymentTerms?.map(p => p.name).join(', ') || ''}
        onChange={(e) =>
          setEditableRightsInfo({
            ...editableRightsInfo,
            paymentTerms: e.target.value.split(',').map(name => ({ name: name.trim() })).filter(p => p.name),
          })
        }
      />
    ) : rightsInfo?.paymentTerms?.length ? (
      <p>{rightsInfo.paymentTerms.map((p) => p.name).join(', ')}</p>
    ) : (
      <p>N/A</p>
    )}
  </div>

  {/* List Price */}
  <div className="info-row">
    <strong>List Price:</strong>
    {isEditingRights ? (
      <input
        className="text-black"
        type="number"
        value={editableRightsInfo.listPrice || ''}
        onChange={(e) =>
          setEditableRightsInfo({ ...editableRightsInfo, listPrice: e.target.value })
        }
      />
    ) : (
      <p>{rightsInfo?.listPrice || 'N/A'}</p>
    )}
  </div>
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

  );
}

export default ViewAndEditForm;
