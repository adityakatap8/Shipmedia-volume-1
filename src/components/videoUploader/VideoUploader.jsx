import React, { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap'; // Ensure correct imports
import ProjectTabs from '../projectTabs/projectTabs'
import './index.css'

// VideoUploader Component
const VideoUploader = () => {
    // State to manage selected file and URL input
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [password, setPassword] = useState('');

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle URL input
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    // Handle password input (optional)
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (file) {
            // Handle file upload (you can integrate API for actual uploading)
            alert(`File uploaded: ${file.name}`);
        } else if (url) {
            // Handle URL submission
            alert(`URL submitted: ${url} with password: ${password}`);
        } else {
            alert('Please provide either a file or a URL.');
        }
    };

    // ProjectTabs Component (Nested within VideoUploader)
    const ProjectTabs = () => {
        const [key, setKey] = useState('overview');

        return (
            <div className="container mt-5">
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
                            <h3>Overview Content</h3>
                            <p>Details about the overview go here.</p>
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
    };

    return (
        <div className="container mt-5">
            {/* Title */}
            <div className='title text-left'>
                <h2 className='text-xxl'>Add an Online Screener</h2>
                <p>Link or upload your video. Only festivals you submit to can view your video.</p>
            </div>

            {/* Flexbox container for the upload and URL sections */}
            <div className="d-flex justify-content-between">
                {/* File Upload Section (Left) */}
                <div className="flex-item upload" style={{ width: '48%' }}>
                    <h4>Upload Video File</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="file" className="form-label mb-5">
                                Upload a high-quality video file, up to 10 GB.
                            </label>
                            <input
                                type="file"
                                className="choose-file"
                                id="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                required
                            />
                            <label htmlFor="file" className="file-upload-label">Choose File</label>
                            {file && <p>Selected file: {file.name}</p>}
                        </div>
                    </form>
                    {/* Submit Button Below the Upload Box */}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="submit">
                            Submit File
                        </button>
                    </div>
                </div>

                {/* URL Input Section (Right) */}
                <div className="flex-item url-section" style={{ width: '48%' }}>
                    <form onSubmit={handleSubmit}>
                        <h4>Link</h4>
                        <div className="mb-3 url-input">
                            <label htmlFor="url" className="form-label">
                                If your video is on Vimeo or YouTube, simply paste the URL and password below.
                            </label>
                            <label htmlFor="url" className="form-label">
                                URL
                            </label>
                            <input
                                type="url"
                                className="url"
                                id="url"
                                value={url}
                                onChange={handleUrlChange}
                                placeholder="Example: vimeo.com/48425421"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password (optional)
                            </label>
                            <input
                                type="password"
                                className="url"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter password (if applicable)"
                            />
                        </div>
                        <button type="submit" className="submit">
                            Submit URL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VideoUploader;
