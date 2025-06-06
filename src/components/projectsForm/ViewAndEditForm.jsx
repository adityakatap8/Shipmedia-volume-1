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
  const [isEditingScreenings, setIsEditingScreenings] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';

    const token = Cookies.get("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (projectData?.projectInfoData?.userId) {
        try {
          const response = await axios.get(`https://media-shippers-backend-n73nu7q44.vercel.app/api/users/${projectData.projectInfoData.userId}`, {
            withCredentials: true
          });

          if (response.status === 200) {
            setUserInfo(response.data);
            console.log("Organization Name:", response.data?.orgName);
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
        const response = await axios.get(`https://media-shippers-backend-n73nu7q44.vercel.app/api/project-form/data/${projectId}`, {
          withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`, // Add token in header
              'Content-Type': 'application/json',
            },
        });
  
        if (response.status === 200) {
          console.log("✅ Full Project Data:", response.data); // <-- Log here
          setProjectData(response.data);
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
    submitterInfoData,
    creditsInfoData,
    specificationsInfoData,
    screeningsInfoData,
  } = projectData;

  const toggleEditSection = async (section) => {
    let updatedData;

    switch (section) {
      case 'project':
        if (isEditingProject) {
          updatedData = projectData.projectInfoData;
          await updateSection(projectId, section, updatedData);
        }
        setIsEditingProject(!isEditingProject);
        break;
  
      case 'submitter':
        if (isEditingSubmitter) {
          updatedData = projectData.submitterInfoData;
          await updateSection(projectId, section, updatedData);
        }
        setIsEditingSubmitter(!isEditingSubmitter);
        break;
  
      case 'credits':
        if (isEditingCredits) {
          updatedData = projectData.creditsInfoData;
          await updateSection(projectId, section, updatedData);
        }
        setIsEditingCredits(!isEditingCredits);
        break;
      case 'specifications':
        if (isEditingSpecifications) {
          updatedData = projectData.specificationsInfoData;
          await updateSection(projectId, section, updatedData);
        }
        setIsEditingSpecifications(!isEditingSpecifications);
        break;
      case 'screenings':
        if (isEditingScreenings) {
          updatedData = projectData.screeningsInfoData;
          await updateSection(projectId, section, updatedData);
        }
        setIsEditingScreenings(!isEditingScreenings);
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
      {/* Project Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>1</span> Project Information
          </h1>
          <button
            className="edit-btn"
            onClick={() =>
              isEditingProject ? handleSave('project') : toggleEditSection('project')
            }
          >
            {isEditingProject ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="info-row">
          <strong>Project Title:</strong>
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfoData?.projectTitle || ''}
              onChange={(e) =>
                setProjectData((prev) => ({
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
          ) : (
            <p>N/A</p>
          )}
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
          ) : (
            <p>N/A</p>
          )}
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
          ) : (
            <p>N/A</p>
          )}
        </div>

        {/* Other static values */}
        <div className="info-row"><strong>Movie File:</strong> <p>{projectInfoData?.movieFileName || 'N/A'}</p></div>
        <div className="info-row"><strong>SRT File:</strong> <p>{projectInfoData?.srtFileName || 'N/A'}</p></div>
      </section>

      {/* Credits Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>3</span> Credits
          </h1>
          <button
            className="edit-btn"
            onClick={() => toggleEditSection('credits')}
          >
            {isEditingCredits ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="info-row">
          <strong>Directors:</strong>
          {isEditingCredits ? (
            <input
              type="text"
              value={creditsInfoData?.directors?.join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.directors = e.target.value.split(',').map((name) => ({ firstName: name.trim() }));
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.directors?.map((director, index) => (
                <li key={index}>{director.firstName} {director.lastName}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="info-row">
          <strong>Writers:</strong>
          {isEditingCredits ? (
            <input
              type="text"
              value={creditsInfoData?.writers?.join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.writers = e.target.value.split(',').map((name) => ({ firstName: name.trim() }));
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.writers?.map((writer, index) => (
                <li key={index}>{writer.firstName} {writer.lastName}</li>
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
              value={creditsInfoData?.actors?.map(actor => `${actor.firstName} ${actor.lastName}`).join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.actors = e.target.value.split(',').map((name) => {
                  const [firstName, lastName] = name.trim().split(' ');
                  return { firstName, lastName: lastName || '' };
                });
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.actors?.map((actor, index) => (
                <li key={index}>{actor.firstName} {actor.lastName}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Specifications Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>4</span> Specifications
          </h1>
          <button
            className="edit-btn"
            onClick={() => toggleEditSection('specifications')}
          >
            {isEditingSpecifications ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="info-row">
          <strong>Project Type:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectType || ''}
              onChange={(e) => {
                specificationsInfoData.projectType = e.target.value;
              }}
            />
          ) : (
            <p>{specificationsInfoData?.projectType || 'No type'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Project Length:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectLength || ''}
              onChange={(e) => {
                specificationsInfoData.projectLength = e.target.value;
              }}
            />
          ) : (
            <p>{specificationsInfoData?.projectLength || 'No length info'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Project Language:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectLanguage || ''}
              onChange={(e) => {
                specificationsInfoData.projectLanguage = e.target.value;
              }}
            />
          ) : (
            <p>{specificationsInfoData?.projectLanguage || 'No language info'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Project Genre:</strong>
          {isEditingSpecifications ? (
            <input
              type="text"
              value={specificationsInfoData?.projectGenre || ''}
              onChange={(e) => {
                specificationsInfoData.projectGenre = e.target.value;
              }}
            />
          ) : (
            <p>{specificationsInfoData?.projectGenre || 'No genre info'}</p>
          )}
        </div>
      </section>

      {/* Screenings Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>5</span> Screenings
          </h1>
          <button
            className="edit-btn"
            onClick={() => toggleEditSection('screenings')}
          >
            {isEditingScreenings ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="info-row">
          <strong>Screening Locations:</strong>
          {isEditingScreenings ? (
            <input
              type="text"
              value={screeningsInfoData?.screeningLocations?.join(', ') || ''}
              onChange={(e) => {
                screeningsInfoData.screeningLocations = e.target.value.split(',').map((location) => location.trim());
              }}
            />
          ) : (
            <ul>
              {screeningsInfoData?.screeningLocations?.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="info-row">
          <strong>Screening Dates:</strong>
          {isEditingScreenings ? (
            <input
              type="text"
              value={screeningsInfoData?.screeningDates?.join(', ') || ''}
              onChange={(e) => {
                screeningsInfoData.screeningDates = e.target.value.split(',').map((date) => date.trim());
              }}
            />
          ) : (
            <ul>
              {screeningsInfoData?.screeningDates?.map((date, index) => (
                <li key={index}>{date}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default ViewAndEditForm;
