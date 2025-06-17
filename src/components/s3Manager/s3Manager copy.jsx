import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { UserContext } from '../../contexts/UserContext';
import './index.css';

// Redux action to clear the auth token
const clearAuthToken = () => ({
  type: 'CLEAR_AUTH_TOKEN',
});

function S3Manager() {
  const [currentFolder, setCurrentFolder] = useState('');
  const [folderName, setFolderName] = useState('');
  const [projectName, setProjectName] = useState('');  // This will store the selected project name
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Track progress
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Get token and projectFolder from Redux store
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const projectFolder = useSelector((state) => state.project.projectFolder);

  // Access the user context to get the orgName
  const { userData } = useContext(UserContext);  // Use UserContext
  const orgName = userData ? userData.orgName : '';  // Extract orgName from userData

  // Axios setup with token handling
  const axiosInstance = axios.create({
    baseURL: `https://mediashippers.com/api`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Add response interceptor for handling token expiration (401 errors)
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        alert('Your session has expired. Please log in again.');
        dispatch(clearAuthToken()); // Clear the token from Redux
        window.location.href = '/login'; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );

  // Ref to track if the folder contents have been fetched
  const hasFetchedFolders = useRef(false);

  // Fetch folder contents based on orgName
  const fetchFolderContents = async () => {
    if (hasFetchedFolders.current) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.get(`/folders/folders-by-org?orgName=${orgName}`);

      // Set folders and files based on the response
      setFolders(response.data.folders || []);
      setFiles(response.data.files || []);

      console.log("Fetched folders for org:", response.data.folders); // Log for debugging
    } catch (error) {
      console.error('Error fetching folder contents:', error);
      alert('Error fetching folder contents.');
    }

    setIsLoading(false);
    hasFetchedFolders.current = true;
  };

  useEffect(() => {
    if (orgName) {
      fetchFolderContents();
    }
  }, [orgName, currentFolder]);

  // Handle file uploads with progress
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setProgress(0);
    setIsLoading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      const folderPath = selectedItem ? selectedItem.fullPath : ''; // Default to empty if no folder is selected

      console.log("Uploading file to folder path:", folderPath);

      const s3Url = `https://s3.eu-north-1.amazonaws.com/testmediashippers /${orgName}/${folderPath}/${file.name}`;
      try {
        const response = await axios.put(s3Url, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        });

        setFiles((prevFiles) => [...prevFiles, { name: file.name, type: 'file' }]);
        alert(`${file.name} uploaded successfully.`);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error uploading ${file.name}. Please try again.`);
      }
    }

    setProgress(0);
    setIsLoading(false);
    setShowCreateFile(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Predefined subfolders for specific projects
  const subFolders = [
    'trailer',
    'film stills',
    'cast and crew details',
    'srt files',
    'info docs',
    'master',
  ];

  // Create a new folder and subfolders automatically
  const createFolder = async () => {
    if (!folderName) {
      alert('Please enter a folder name.');
      return;
    }

    setIsLoading(true);

    const folderPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;

    try {
      await axiosInstance.post('/folders/create-folder', { folderPath });

      setFolders((prevFolders) => [...prevFolders, { name: folderName, type: 'folder' }]);
      setFolderName('');
      setShowCreateFolder(false);

      alert(`Folder "${folderName}" created successfully.`);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder.');
    }

    setIsLoading(false);
  };

  const handleItemClick = (item, type) => {
  if (type === 'folder') {
    const fullPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
    setSelectedItem({ name: item.name, type, fullPath });

    // Set the project name to the clicked folder's name directly
    setSelectedProject(item.name);  // The project name is now set to the folder name
    console.log(`Selected Project: ${item.name}`);
  }
};


  // const handleItemClick = (item, type) => {
  //   if (type === 'file') {
  //     const fullPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
  //     setSelectedItem({ name: item.name, type, fullPath });
  //   } else if (type === 'folder') {
  //     const fullPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
  //     setSelectedItem({ name: item.name, type, fullPath });
  //   }
  // };

  // Fetch subfolder contents for a folder
  const fetchSubfolderContents = async (orgName, selectedProjectName, subfolderName) => {
    setIsLoading(true);
  
    console.log("Selected Organization:", orgName);
    console.log("Selected Project:", selectedProjectName); // Now using selectedProjectName
    console.log("Selected Subfolder:", subfolderName);
  
    try {
      // The project name shouldn't change here. We only need to update subfolders.
      // setProjectName(selectedProjectName); // Remove this line
  
      // Display predefined subfolders
      setFolders(subFolders.map((folder) => ({ name: folder, type: 'folder' })));
      setFiles([]);  // Clear files when displaying subfolders
  
      console.log("Subfolder contents displayed.");
    } catch (error) {
      console.error('Error:', error);
      alert('Error displaying subfolder contents.');
    }
  
    setIsLoading(false);
  };
  
  // Function to fetch contents of the subfolder
const fetchSubfolderContentsAPI = async (orgName, projectFolder, subfolderName) => {
  setIsLoading(true);

  try {
    const response = await axiosInstance.get(`/folders/subfolder-contents/${orgName}/${projectFolder}/${subfolderName}`);

    // Check if the response is successful
    if (response.data.success) {
      console.log(`Successfully fetched contents for organization: ${orgName}, project: ${projectFolder}, and subfolder: ${subfolderName}`);
    }
  } catch (error) {
    console.error('Error fetching subfolder contents:', error);
    alert('Error fetching subfolder contents.');
  }

  setIsLoading(false);
};

// Function to handle folder double-click
const handleFolderDoubleClick = (folderName) => {
  const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
  setCurrentFolder(newPath);

  // Check if the folder is a subfolder like 'film stills', 'trailers', etc.
  if (subFolders.includes(folderName.toLowerCase())) {
    // Fetch contents for the selected subfolder
    fetchSubfolderContentsAPI(orgName, projectFolder, folderName);
  } else {
    // Handle regular folder navigation (e.g., inside project folders)
    fetchSubfolderContents(orgName, projectFolder, folderName); // You can keep your existing method for folder navigation
  }
};


  // Function that gets triggered when a folder is double-clicked
  // const handleFolderDoubleClick = (folderName) => {
  //   const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
  //   setCurrentFolder(newPath);
  
  //   // You already have the project name set when you first enter the project folder
  //   // So no need to set it again here
  //   const selectedSubfolderName = folderName; // This should be the subfolder you're clicking on
  //   fetchSubfolderContents(orgName, projectName, selectedSubfolderName); // Keep the existing projectName, only update subfolder
  // };
  

  const navigateTo = (index) => {
    const pathParts = currentFolder.split('/').slice(0, index + 1); // Get the path up to the clicked breadcrumb
    setCurrentFolder(pathParts.join('/')); // Update the currentFolder to the new path
  };

  const renderFileItem = (file) => (
    <div
      key={file.id}
      className={`file-item ${selectedItem?.name === file.name ? 'selected' : ''}`}
      onClick={() => handleItemClick(file, 'file')}
    >
      <i className="fas fa-file-alt file-icon"></i>
      <span>{file.name}</span>
    </div>
  );

  const renderFolderItem = (folder) => {
    const displayName = folder.name;

    return (
      <div
        key={folder.id}
        className={`folder-item ${selectedItem?.name === folder.name ? 'selected' : ''}`}
        onClick={() => handleItemClick(folder, 'folder')}
        onDoubleClick={() => handleFolderDoubleClick(folder.name)}
      >
        <i className="fas fa-folder folder-icon"></i>
        <span>{displayName}</span>
      </div>
    );
  };

  // Function to render breadcrumbs
  const renderBreadcrumbs = () => {
    const parts = currentFolder.split('/').filter(Boolean); // Split path and remove empty parts

    return (
      <div className="breadcrumbs">
        <span
          className="breadcrumb-item"
          onClick={() => setCurrentFolder('')}
          style={{ cursor: 'pointer' }}
        >
          {orgName || 'Root Folder'}
        </span>
        {parts.map((part, index) => (
          <span key={index} className="breadcrumb-item">
            <span
              onClick={() => navigateTo(index)}
              style={{ cursor: 'pointer' }}
            >
              {part}
            </span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="s3-manager">
      <h1 className="text-left text-2xl pb-4 mt-2 text-white">Project File Upload</h1>
      {renderBreadcrumbs()}

      <div className="options-box">
        <button
          className="action-button"
          onClick={() => setShowCreateFile(true)}
          disabled={isLoading}
        >
          <i className="fas fa-file-upload"></i> Upload File
        </button>
        <button
          className="action-button delete-button"
          disabled={!selectedItem || isLoading}
        >
          <i className="fas fa-trash-alt"></i> Delete
        </button>
        <button
          className="action-button"
          onClick={fetchFolderContents}
          disabled={isLoading}
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {selectedItem && (
        <div className="selected-item-path">
          <p>Selected Item: {selectedItem.fullPath}</p>
        </div>
      )}

      <div className="folder-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {folders.map((folder) => renderFolderItem(folder))}
            {files.map((file) => renderFileItem(file))}
          </>
        )}
      </div>
    </div>
  );
}

export default S3Manager;
