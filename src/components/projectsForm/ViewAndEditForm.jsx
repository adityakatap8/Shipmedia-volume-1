import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewAndEditFormCss.css'; // Ensure you import your CSS for styling

function ViewAndEditForm() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  // Editing states for each section
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingSubmitter, setIsEditingSubmitter] = useState(false);
  const [isEditingCredits, setIsEditingCredits] = useState(false);
  const [isEditingSpecifications, setIsEditingSpecifications] = useState(false);
  const [isEditingScreenings, setIsEditingScreenings] = useState(false);

  const updateSection = async (projectId, section, data) => {
    try {
      const response = await fetch(`/api/projectforms/update/${projectId}/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update section');
      }

      const result = await response.json();
      console.log(`${section} updated successfully`, result);

      // Update projectData state with the updated data (optional)
      setProjectData((prevData) => ({
        ...prevData,
        [`${section}InfoData`]: data,
      }));
    } catch (error) {
      console.error("Error updating section:", error.message);
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/project-form/data/${projectId}`);
        if (response.status === 200) {
          setProjectData(response.data);
        } else {
          setError(`Failed to load project data. Status code: ${response.status}`);
        }
      } catch (err) {
        setError('An error occurred while fetching the project data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjectData();
  }, [projectId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const {
    projectInfoData,
    submitterInfoData,
    creditsInfoData,
    specificationsInfoData,
    screeningsInfoData,
  } = projectData;

  // Handle Edit/Save button toggle
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
    // Implement the save logic for each section, e.g., save changes to the backend
    console.log(`${section} saved`);

    // After saving, set the section back to view mode
    toggleEditSection(section);
  };

  return (
    <div className="view-and-edit-project projects-form-container text-left">
      {/* Project Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>1</span> Project Information
            {/* <p>{projectInfoData?._id || 'No ID found'}</p> */}
          </h1>
          <button
  className="edit-btn"
  onClick={() => (isEditingProject ? handleSave('project') : toggleEditSection('project'))}
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
              onChange={(e) => {
                projectInfoData.projectTitle = e.target.value;
              }}
            />
          ) : (
            <p>{projectInfoData?.projectTitle || 'No Title Found'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Brief Synopsis:</strong>
          {isEditingProject ? (
            <textarea
              value={projectInfoData?.briefSynopsis || ''}
              onChange={(e) => {
                projectInfoData.briefSynopsis = e.target.value;
              }}
            />
          ) : (
            <p>{projectInfoData?.briefSynopsis || 'No synopsis available'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Website:</strong>
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfoData?.website || ''}
              onChange={(e) => {
                projectInfoData.website = e.target.value;
              }}
            />
          ) : (
            <p>
              {projectInfoData?.website ? (
                <a href={projectInfoData.website} target="_blank" rel="noopener noreferrer">
                  {projectInfoData.website}
                </a>
              ) : (
                'No website available'
              )}
            </p>
          )}
        </div>
        <div className="info-row">
          <strong>Twitter:</strong>
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfoData?.twitter || ''}
              onChange={(e) => {
                projectInfoData.twitter = e.target.value;
              }}
            />
          ) : (
            <p>{projectInfoData?.twitter || 'No Twitter handle'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Facebook:</strong>
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfoData?.facebook || ''}
              onChange={(e) => {
                projectInfoData.facebook = e.target.value;
              }}
            />
          ) : (
            <p>{projectInfoData?.facebook || 'No Facebook link'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Instagram:</strong>
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfoData?.instagram || ''}
              onChange={(e) => {
                projectInfoData.instagram = e.target.value;
              }}
            />
          ) : (
            <p>{projectInfoData?.instagram || 'No Instagram link'}</p>
          )}
        </div>
      </section>

      {/* Submitter Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>2</span> Submitter Information 
            {/* <p>{submitterInfoData?._id || 'No ID found'}</p> */}
          </h1>
          <button
  className="edit-btn"
  onClick={() => (isEditingProject ? handleSave('project') : toggleEditSection('project'))}
>
  {isEditingProject ? 'Save' : 'Edit'}
</button>
        </div>
        <div className="info-row">
          <strong>Email:</strong>
          {isEditingSubmitter ? (
            <input
              type="email"
              value={submitterInfoData?.email || ''}
              onChange={(e) => {
                submitterInfoData.email = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.email || 'No email available'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Contact Number:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.contactNumber || ''}
              onChange={(e) => {
                submitterInfoData.contactNumber = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.contactNumber || 'No contact number'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Address:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.address || ''}
              onChange={(e) => {
                submitterInfoData.address = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.address || 'No address'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>City:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.city || ''}
              onChange={(e) => {
                submitterInfoData.city = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.city || 'No city'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>State:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.state || ''}
              onChange={(e) => {
                submitterInfoData.state = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.state || 'No state'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Postal Code:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.postalCode || ''}
              onChange={(e) => {
                submitterInfoData.postalCode = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.postalCode || 'No postal code'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Country:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.country || ''}
              onChange={(e) => {
                submitterInfoData.country = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.country || 'No country'}</p>
          )}
        </div>
        <div className="info-row">
          <strong>Gender:</strong>
          {isEditingSubmitter ? (
            <input
              type="text"
              value={submitterInfoData?.gender || ''}
              onChange={(e) => {
                submitterInfoData.gender = e.target.value;
              }}
            />
          ) : (
            <p>{submitterInfoData?.gender || 'No gender'}</p>
          )}
        </div>
      </section>

      {/* Credits Info */}
      <section className="section">
        <div className="section-header">
          <h1 className="header-numbered">
            <span>3</span> Credits 
            {/* <p>{creditsInfoData?._id || 'No ID found'}</p> */}
          </h1>
          <button
  className="edit-btn"
  onClick={() => (isEditingProject ? handleSave('project') : toggleEditSection('project'))}
>
  {isEditingProject ? 'Save' : 'Edit'}
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
        <div className="info-row">
          <strong>Producers:</strong>
          {isEditingCredits ? (
            <input
              type="text"
              value={creditsInfoData?.producers?.join(', ') || ''}
              onChange={(e) => {
                creditsInfoData.producers = e.target.value.split(',').map((name) => ({ firstName: name.trim() }));
              }}
            />
          ) : (
            <ul>
              {creditsInfoData?.producers?.map((producer, index) => (
                <li key={index}>{producer.firstName} {producer.lastName}</li>
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
            {/* <p>{specificationsInfoData?._id || 'No ID found'}</p> */}
          </h1>
          <button
  className="edit-btn"
  onClick={() => (isEditingProject ? handleSave('project') : toggleEditSection('project'))}
>
  {isEditingProject ? 'Save' : 'Edit'}
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
            {/* <p>{screeningsInfoData?._id || 'No ID found'}</p> */}
          </h1>
          <button
  className="edit-btn"
  onClick={() => (isEditingProject ? handleSave('project') : toggleEditSection('project'))}
>
  {isEditingProject ? 'Save' : 'Edit'}
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
