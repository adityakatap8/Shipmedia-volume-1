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
  const [userInfo, setUserInfo] = useState(null);

  const { userData } = useContext(UserContext);
  const orgName = userData ? userData.orgName : '';
  const token = Cookies.get("token");

  // Initialize with empty objects to avoid reference errors
  const [editableProjectInfo, setEditableProjectInfo] = useState({});
  const [editableCreditsInfo, setEditableCreditsInfo] = useState({});
  const [editableSpecificationsInfo, setEditableSpecificationsInfo] = useState({});
  const [editableRightsInfo, setEditableRightsInfo] = useState({});

  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingCredits, setIsEditingCredits] = useState(false);
  const [isEditingSpecifications, setIsEditingSpecifications] = useState(false);
  const [isEditingRights, setIsEditingRights] = useState(false);

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

          // Set editable values
          setEditableProjectInfo(response.data.projectInfo || {});
          setEditableCreditsInfo(response.data.creditsInfo || {});
          setEditableSpecificationsInfo(response.data.specificationsInfo || {});
          setEditableRightsInfo(response.data.rightsInfo || {});
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

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://www.mediashippers.com/api/project-form/delete/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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



  const handleSaveProjectInfo = async () => {
    console.log("📝 Saving Project Info:", {
      projectInfo: editableProjectInfo,
      creditsInfo: editableCreditsInfo,
      specificationsInfo: editableSpecificationsInfo,
      rightsInfo: editableRightsInfo,
    });

    try {
      const response = await axios.put(
        `https://www.mediashippers.com/api/project-form/update/${projectId}`,
        {
          projectInfo: editableProjectInfo,
          creditsInfo: editableCreditsInfo,
          specificationsInfo: editableSpecificationsInfo,
          rightsInfo: editableRightsInfo,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('✅ Project data updated successfully!');
        setIsEditingProject(false);
        setIsEditingCredits(false);
        setIsEditingSpecifications(false);
        setIsEditingRights(false);
      }
    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert("An error occurred while saving project data.");
    }
  };

  if (loading) return <div className="loading"><Loader /></div>;
  if (error) return <div className="error">{error}</div>;

  const { projectInfo, creditsInfo, specificationsInfo, screeningsInfo, rightsInfo } = projectData;

  

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
    if (isEditingProject) {
      setEditableProjectInfo(projectInfo); // Reset to original
    }
    setIsEditingProject(!isEditingProject);
  }}
  className={`text-sm ${isEditingProject ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
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
    <div className="info-row">
      <strong>Poster URL:</strong>
      {isEditingProject ? (
        <input className="text-black"
          type="text"
          value={editableProjectInfo.projectPosterS3Url || ''}
          onChange={(e) =>
            setEditableProjectInfo({ ...editableProjectInfo, projectPosterS3Url: e.target.value })
          }
        />
      ) : projectInfo?.projectPosterS3Url ? (
        <img src={projectInfo.projectPosterS3Url} alt="Poster" style={{ width: '150px' }} />
      ) : (
        <p>N/A</p>
      )}
    </div>

    {/* Banner */}
    <div className="info-row">
      <strong>Banner URL:</strong>
      {isEditingProject ? (
        <input className="text-black"
          type="text"
          value={editableProjectInfo.projectBannerS3Url || ''}
          onChange={(e) =>
            setEditableProjectInfo({ ...editableProjectInfo, projectBannerS3Url: e.target.value })
          }
        />
      ) : projectInfo?.projectBannerS3Url ? (
        <img src={projectInfo.projectBannerS3Url} alt="Banner" style={{ width: '100%', maxWidth: '500px' }} />
      ) : (
        <p>N/A</p>
      )}
    </div>

    {/* Trailer */}
    <div className="info-row">
      <strong>Trailer URL:</strong>
      {isEditingProject ? (
        <input className="text-black"
          type="text"
          value={editableProjectInfo.projectTrailerS3Url || ''}
          onChange={(e) =>
            setEditableProjectInfo({ ...editableProjectInfo, projectTrailerS3Url: e.target.value })
          }
        />
      ) : projectInfo?.projectTrailerS3Url ? (
        <video width="480" controls src={projectInfo.projectTrailerS3Url}>
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>N/A</p>
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
    <div className="info-row">
  <strong>SRT File:</strong>
  {isEditingProject ? (
    <input
      className="text-black"
      type="text"
      value={editableProjectInfo.srtFileName || ''}
      onChange={(e) =>
        setEditableProjectInfo({ ...editableProjectInfo, srtFileName: e.target.value })
      }
    />
  ) : projectInfo?.srtFileName ? (
    <a
      href={constructS3Url('srt', projectInfo.srtFileName)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {projectInfo.srtFileName}
    </a>
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
              <div key={i} className="dubbed-file-entry">
                <div className="info-row">
                  <strong>Language:</strong>
                  {isEditingProject ? (
                    <input className="text-black"
                      type="text"
                      value={editableProjectInfo.dubbedFileData?.[i]?.language || ''}
                      onChange={(e) => {
                        const newDubbed = [...(editableProjectInfo.dubbedFileData || projectInfo.dubbedFileData)];
                        newDubbed[i] = { ...newDubbed[i], language: e.target.value };
                        setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: newDubbed });
                      }}
                    />
                  ) : (
                    <p>{file.language}</p>
                  )}
                </div>

                <div className="info-row">
                  <strong>Dubbed Trailer URL:</strong>
                  {isEditingProject ? (
                    <input className="text-black"
                      type="text"
                      value={editableProjectInfo.dubbedFileData?.[i]?.dubbedTrailerUrl || ''}
                      onChange={(e) => {
                        const newDubbed = [...(editableProjectInfo.dubbedFileData || projectInfo.dubbedFileData)];
                        newDubbed[i] = { ...newDubbed[i], dubbedTrailerUrl: e.target.value };
                        setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: newDubbed });
                      }}
                    />
                  ) : file.dubbedTrailerUrl ? (
                    <video
                      width="360"
                      controls
                      src={file.dubbedTrailerUrl.replace(
                        's3://',
                        'https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/'
                      )}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>

                <div className="info-row">
                  <strong>Subtitle URL:</strong>
                  {isEditingProject ? (
                    <input className="text-black"
                      type="text"
                      value={editableProjectInfo.dubbedFileData?.[i]?.dubbedSubtitleUrl || ''}
                      onChange={(e) => {
                        const newDubbed = [...(editableProjectInfo.dubbedFileData || projectInfo.dubbedFileData)];
                        newDubbed[i] = { ...newDubbed[i], dubbedSubtitleUrl: e.target.value };
                        setEditableProjectInfo({ ...editableProjectInfo, dubbedFileData: newDubbed });
                      }}
                    />
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

    {/* Info Docs */}
    <div className="info-row">
      <strong>Info Docs:</strong>
      {isEditingProject ? (
        <textarea
          value={editableProjectInfo.infoDocFileName?.join('\n') || ''}
          onChange={(e) =>
            setEditableProjectInfo({
              ...editableProjectInfo,
              infoDocFileName: e.target.value.split('\n').filter(Boolean),
            })
          }
          rows={3}
          className="w-full"
        />
      ) : projectInfo?.infoDocFileName?.length ? (
        <ul>
          {projectInfo.infoDocFileName.map((file, i) => (
            <li key={i}>
              <a href={constructS3Url('infoDocs', file)} target="_blank" rel="noopener noreferrer">
                {file}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>N/A</p>
      )}
    </div>
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
      setEditableRightsInfo(rightsInfo); // Reset to original
    }
    setIsEditingRights(!isEditingRights);
  }}
  className={`text-sm ${isEditingRights ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded`}
>
  {isEditingRights ? '❌ Cancel' : '✏️ Edit'}
</button>

    </div>

    <div className="info-row">
      <strong>Rights:</strong>
      {isEditingRights ? (
        <input className="text-black"
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

    <div className="info-row">
      <strong>Territories:</strong>
      {isEditingRights ? (
        <input className="text-black"
          type="text"
          value={
            editableRightsInfo.territories
              ?.map((t) => `${t.name} (${t.country}, ${t.region})`)
              .join(', ') || ''
          }
          onChange={(e) => {
            const entries = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
            const newTerritories = entries.map(entry => {
              // Parsing format: "Name (Country, Region)"
              const match = entry.match(/^(.+?) \((.+?), (.+?)\)$/);
              if (match) {
                return { name: match[1], country: match[2], region: match[3] };
              }
              return { name: entry, country: '', region: '' };
            });
            setEditableRightsInfo({ ...editableRightsInfo, territories: newTerritories });
          }}
        />
      ) : rightsInfo?.territories?.length ? (
        <p>{rightsInfo.territories.map((t) => `${t.name} (${t.country}, ${t.region})`).join(', ')}</p>
      ) : (
        <p>N/A</p>
      )}
    </div>

    <div className="info-row">
      <strong>License Term:</strong>
      {isEditingRights ? (
        <input className="text-black"
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

    <div className="info-row">
      <strong>Usage Rights:</strong>
      {isEditingRights ? (
        <input className="text-black"
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

    <div className="info-row">
      <strong>Payment Terms:</strong>
      {isEditingRights ? (
        <input className="text-black"
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

    <div className="info-row">
      <strong>List Price:</strong>
      {isEditingRights ? (
        <input className="text-black"
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
