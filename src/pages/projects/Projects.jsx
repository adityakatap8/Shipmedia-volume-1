import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewProject from '../../components/viewProject/ViewProject';
import EditProject from '../../components/editProject/EditProject';
import ProjectFile from '../../components/projectFile/ProjectFile';
import Privacy from '../../components/privacy/Privacy';
import AncillaryFiles from '../../components/ancillaryFiles/AncillaryFiles';

const ProjectTabs = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('view-project');

  // Content for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'view-project':
        return <div><ViewProject /></div>;
      case 'edit-project':
        return <div><EditProject /></div>;
      case 'project-file':
        return <div><ProjectFile /></div>;
      case 'privacy':
        return <div><Privacy /></div>;
      case 'ancillary-files':
        return <div><AncillaryFiles /></div>;
      default:
        return <div><ViewProject /></div>;
    }
  };

  return (
    <div className="container mt-5">
      {/* Tab Navigation */}
      <ul className="nav nav-tabs" id="projectTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'view-project' ? 'active' : ''}`}
            id="view-project-tab"
            onClick={() => setActiveTab('view-project')}
            role="tab"
            aria-controls="view-project"
            aria-selected={activeTab === 'view-project'}
            style={{ cursor: 'pointer' }} // Inline style for pointer cursor
          >
            View Project
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'edit-project' ? 'active' : ''}`}
            id="edit-project-tab"
            onClick={() => setActiveTab('edit-project')}
            role="tab"
            aria-controls="edit-project"
            aria-selected={activeTab === 'edit-project'}
            style={{ cursor: 'pointer' }} // Inline style for pointer cursor
          >
            Edit Project
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'project-file' ? 'active' : ''}`}
            id="project-file-tab"
            onClick={() => setActiveTab('project-file')}
            role="tab"
            aria-controls="project-file"
            aria-selected={activeTab === 'project-file'}
            style={{ cursor: 'pointer' }} // Inline style for pointer cursor
          >
            Project File
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
            id="privacy-tab"
            onClick={() => setActiveTab('privacy')}
            role="tab"
            aria-controls="privacy"
            aria-selected={activeTab === 'privacy'}
            style={{ cursor: 'pointer' }} // Inline style for pointer cursor
          >
            Privacy
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'ancillary-files' ? 'active' : ''}`}
            id="ancillary-files-tab"
            onClick={() => setActiveTab('ancillary-files')}
            role="tab"
            aria-controls="ancillary-files"
            aria-selected={activeTab === 'ancillary-files'}
            style={{ cursor: 'pointer' }} // Inline style for pointer cursor
          >
            Ancillary Files
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-3">
        <div className="tab-pane fade show active" id={activeTab} role="tabpanel">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectTabs;
