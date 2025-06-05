import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewAndEditFormCss.css';
import Loader from '../loader/Loader';
import { UserContext } from '../../contexts/UserContext';
import Cookies from 'js-cookie';

function ViewAndEditForm() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingCredits, setIsEditingCredits] = useState(false);
  const [isEditingSpecifications, setIsEditingSpecifications] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (projectData?.projectInfoData?.userId) {
        try {
          const response = await axios.get(`https://www.mediashippers.com/api/users/${projectData.projectInfoData.userId}`, {
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
          const data = response.data;

          setProjectData({
            projectInfoData: {
              _id: data._id,
              projectTitle: data.projectTitle,
              projectName: data.projectName,
              posterFileName: data.posterFileName,
              bannerFileName: data.bannerFileName,
              trailerFileName: data.trailerFileName,
              movieFileName: data.movieFileName,
              s3SourceTrailerUrl: data.s3SourceTrailerUrl,
              infoDocFileName: data.infoDocFileName,
              dubbedFileData: data.dubbedFileData,
              srtFilesId: data.srtFilesId,
              userId: data.userId,
              isPublic: data.isPublic
            },
            creditsInfoData: data.creditsInfo || {},
            specificationsInfoData: data.specificationsInfo || {},
          });
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
  }, [projectId]);

  if (loading) return <div className="loading"><Loader /></div>;
  if (error) return <div className="error">{error}</div>;

  const {
    projectInfoData,
    creditsInfoData,
    specificationsInfoData,
  } = projectData;

  const toggleEditSection = async (section) => {
    let updatedData;

    switch (section) {
      case 'project':
        if (isEditingProject) {
          updatedData = projectData.projectInfoData;
          // You can implement updateSection if needed
        }
        setIsEditingProject(!isEditingProject);
        break;
      case 'credits':
        if (isEditingCredits) {
          updatedData = projectData.creditsInfoData;
        }
        setIsEditingCredits(!isEditingCredits);
        break;
      case 'specifications':
        if (isEditingSpecifications) {
          updatedData = projectData.specificationsInfoData;
        }
        setIsEditingSpecifications(!isEditingSpecifications);
        break;
      default:
        break;
    }
  };

  const handleSave = (section) => {
    toggleEditSection(section);
  };

  const constructS3Url = (subfolder, fileName) => {
    if (!orgName || !projectInfoData?.projectName || !fileName) return null;
    const encodedOrg = encodeURIComponent(orgName.trim());
    const encodedProject = encodeURIComponent(projectInfoData.projectName.trim());
    const encodedFile = encodeURIComponent(fileName.trim());
    return `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${encodedOrg}/${encodedProject}/${subfolder}/${encodedFile}`;
  };

  return (
    <div className="view-and-edit-project projects-form-container text-left">

      {/* === Project Info Section === */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered"><span>1</span> Project Information</h1>
          <button className="edit-btn" onClick={() => isEditingProject ? handleSave('project') : toggleEditSection('project')}>
            {isEditingProject ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Title */}
        <div className="info-row">
          <strong>Project Title:</strong>
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfoData?.projectTitle || ''}
              onChange={(e) =>
                setProjectData(prev => ({
                  ...prev,
                  projectInfoData: {
                    ...prev.projectInfoData,
                    projectTitle: e.target.value,
                  },
                }))
              }
            />
          ) : (
            <p>{projectInfoData?.projectTitle || 'No Title Found'}</p>
          )}
        </div>

        {/* Poster */}
        <div className="info-row">
          <strong>Poster:</strong>
          {projectInfoData?.posterFileName ? (
            <img
              src={constructS3Url('film stills', projectInfoData.posterFileName)}
              alt="Poster"
              style={{ width: '150px', height: 'auto' }}
            />
          ) : <p>N/A</p>}
        </div>

        {/* Banner */}
        <div className="info-row">
          <strong>Banner:</strong>
          {projectInfoData?.bannerFileName ? (
            <img
              src={constructS3Url('film stills', projectInfoData.bannerFileName)}
              alt="Banner"
              style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
            />
          ) : <p>N/A</p>}
        </div>

        {/* Trailer */}
        <div className="info-row">
          <strong>Trailer:</strong>
          {projectInfoData?.trailerFileName ? (
            <a
              href={constructS3Url('trailer', projectInfoData.trailerFileName)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Trailer
            </a>
          ) : <p>N/A</p>}
        </div>

        {/* Movie File */}
        <div className="info-row"><strong>Movie File:</strong> <p>{projectInfoData?.movieFileName || 'N/A'}</p></div>

        {/* SRT File */}
        <div className="info-row">
          <strong>SRT File ID:</strong>
          <p>{projectInfoData?.srtFilesId || 'N/A'}</p>
        </div>

        {/* Dubbed Files */}
        <div className="info-row">
          <strong>Dubbed Files:</strong>
          {Array.isArray(projectInfoData?.dubbedFileData) && projectInfoData.dubbedFileData.length > 0 ? (
            <ul>
              {projectInfoData.dubbedFileData.map((file, idx) => (
                <li key={idx}>{file?.fileName || `Dubbed File ${idx + 1}`}</li>
              ))}
            </ul>
          ) : <p>No dubbed files</p>}
        </div>
      </section>

      {/* === Credits Section === */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered"><span>3</span> Credits</h1>
          <button className="edit-btn" onClick={() => toggleEditSection('credits')}>
            {isEditingCredits ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Directors */}
        <div className="info-row">
          <strong>Directors:</strong>
          {isEditingCredits ? (
            <input
              type="text"
              value={creditsInfoData?.directors?.map(d => d.firstName).join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.directors = e.target.value.split(',').map(name => ({ firstName: name.trim() }));
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.directors?.map((d, idx) => (
                <li key={idx}>{d.firstName} {d.lastName}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Writers */}
        <div className="info-row">
          <strong>Writers:</strong>
          {isEditingCredits ? (
            <input
              type="text"
              value={creditsInfoData?.writers?.map(w => w.firstName).join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.writers = e.target.value.split(',').map(name => ({ firstName: name.trim() }));
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.writers?.map((w, idx) => (
                <li key={idx}>{w.firstName} {w.lastName}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Actors */}
        <div className="info-row">
          <strong>Actors:</strong>
          {isEditingCredits ? (
            <input
              type="text"
              value={creditsInfoData?.actors?.map(a => `${a.firstName} ${a.lastName}`).join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.actors = e.target.value.split(',').map((name) => {
                  const [firstName, lastName] = name.trim().split(' ');
                  return { firstName, lastName: lastName || '' };
                });
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.actors?.map((a, idx) => (
                <li key={idx}>{a.firstName} {a.lastName}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* === Specifications Section === */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered"><span>4</span> Specifications</h1>
          <button className="edit-btn" onClick={() => toggleEditSection('specifications')}>
            {isEditingSpecifications ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="info-row">
          <strong>Project Type:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectType || ''}
              onChange={(e) => specificationsInfoData.projectType = e.target.value}
            />
          ) : <p>{specificationsInfoData?.projectType || 'No type'}</p>}
        </div>

        <div className="info-row">
          <strong>Project Length:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectLength || ''}
              onChange={(e) => specificationsInfoData.projectLength = e.target.value}
            />
          ) : <p>{specificationsInfoData?.projectLength || 'No length info'}</p>}
        </div>

        <div className="info-row">
          <strong>Project Language:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectLanguage || ''}
              onChange={(e) => specificationsInfoData.projectLanguage = e.target.value}
            />
          ) : <p>{specificationsInfoData?.projectLanguage || 'No language info'}</p>}
        </div>

        <div className="info-row">
          <strong>Project Genre:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectGenre || ''}
              onChange={(e) => specificationsInfoData.projectGenre = e.target.value}
            />
          ) : <p>{specificationsInfoData?.projectGenre || 'No genre info'}</p>}
        </div>
      </section>
    </div>
  );
}

export default ViewAndEditForm;
