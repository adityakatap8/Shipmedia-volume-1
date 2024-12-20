import React, { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap'; // Ensure correct imports
import './index.css';
import Overview from './projectTabComponents/Overview';

function ProjectTabs() {
  // State to manage active tab
  const [key, setKey] = useState('overview');

  return (
    <div className="container mt-5">
      <div className='project-title'>
        <h1>My Project Name</h1>
      </div>
     
      <Tab.Container id="tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="pills" className="nav-pills">
          <Nav.Item>
            <Nav.Link
              eventKey="overview"
              className={`custom-tab-link ${key === 'overview' ? 'active' : ''}`}
            >
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="credits"
              className={`custom-tab-link ${key === 'credits' ? 'active' : ''}`}
            >
              Credits
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="specifications"
              className={`custom-tab-link ${key === 'specifications' ? 'active' : ''}`}
            >
              Specifications
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="screenings"
              className={`custom-tab-link ${key === 'screenings' ? 'active' : ''}`}
            >
              Screenings / Awards
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="distribution"
              className={`custom-tab-link ${key === 'distribution' ? 'active' : ''}`}
            >
              Distribution Information
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="overview">
            <Overview />
          </Tab.Pane>
          <Tab.Pane eventKey="credits">
            <h3>Credits Content</h3>
            <p>Details about the credits go here.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="specifications">
            <h3>Specifications Content</h3>
            <p>Details about the specifications go here.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="screenings">
            <h3>Screenings / Awards Content</h3>
            <p>Details about the screenings or awards go here.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="distribution">
            <h3>Distribution Information Content</h3>
            <p>Details about the distribution information go here.</p>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default ProjectTabs;
