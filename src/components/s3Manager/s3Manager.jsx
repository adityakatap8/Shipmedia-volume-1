import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { UserContext } from '../../contexts/UserContext';
import './index.css';
import Loader from '../loader/Loader';

// Redux action to clear the auth token
const clearAuthToken = () => ({
  type: 'CLEAR_AUTH_TOKEN',
});

// Helper function to encode spaces as "+" signs when needed
const encodeFolderNameForPath = (folderName) => {
  return folderName.replace(/\s+/g, '+'); // Replace spaces with '+'
};

function S3Manager() {
  const [currentFolder, setCurrentFolder] = useState('');
  const [folderName, setFolderName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Track progress
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState([]);

  // Get token and projectFolder from Redux store
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const projectFolder = useSelector((state) => state.project.projectFolder);

  // Access the user context to get the orgName
  const { userData } = useContext(UserContext);  // Use UserContext
  const orgName = userData ? userData.orgName : '';  // Extract orgName from userData



  // Axios setup with token handling
  const axiosInstance = axios.create({
    baseURL: `/api`,
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

  // Fetch folder contents
  // const fetchFolderContents = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axiosInstance.get(`/folders/list-folder?folderPath=${currentFolder}`);
  //     setFolders(response.data.folders || []); // Set folders based on the response
  //     setFiles(response.data.files || []); // Set files based on the response

  //     // Log the folders to the console
  //     console.log("Fetched folders:", response.data.folders);

  //   } catch (error) {
  //     console.error('Error fetching folder contents:', error);
  //     alert('Error fetching folder contents.');
  //   }
  //   setIsLoading(false);
  // };


  // Ref to track if the folder contents have been fetched
  const hasFetchedFolders = useRef(false);
  // Fetch folder contents based on orgName
  const fetchFolderContents = async () => {
    // Check if data has already been fetched using useRef
    if (hasFetchedFolders.current) return;

    setIsLoading(true);

    try {
      // Fetch folders using the orgName in the API call
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

    // Mark the folders as fetched to prevent re-fetching
    hasFetchedFolders.current = true;
  };



  useEffect(() => {
    if (orgName) {
      console.log("orgName =======>", orgName);
      fetchFolderContents();
    }
  }, [orgName, currentFolder]);

  // Handle file uploads


  // Handle file uploads with progress
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setProgress(0);
    setIsLoading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      // Use selectedItem.fullPath for folder path if available
      const folderPath = selectedItem ? selectedItem.fullPath : ''; // Default to empty if no folder is selected

      // Log the folderPath to the console for debugging
      console.log("Uploading file to folder path:", folderPath);

      // S3 Bucket URL (this would be your S3 URL endpoint)
      const s3Url = `https://s3.eu-north-1.amazonaws.com/mediashippers-filestash/${orgName}/${folderPath}/${file.name}`;
      console.log(s3Url)
      try {
        // Send the file directly to S3 using the form data and dynamic S3 URL
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

  // Function to create subfolders automatically after a specific folder is created
  const createSubFolders = async (folderPath) => {
    try {
      const folderPromises = subFolders.map(async (subFolderName) => {
        const subFolderPath = `${folderPath}/${subFolderName}`;
        console.log(`Creating subfolder: ${subFolderPath}`);
        await axiosInstance.post('/folders/create-folder', { folderPath: subFolderPath });
        console.log(`Created subfolder: ${subFolderPath}`);
      });

      // Wait for all subfolders to be created
      await Promise.all(folderPromises);
      console.log('All subfolders created successfully.');
    } catch (error) {
      console.error('Error creating subfolders:', error);
      alert('Error creating subfolders.');
    }
  };

  // Check and create org folder if it doesn't exist
  // const createOrgFolderIfNeeded = async () => {
  //   try {
  //     const response = await axiosInstance.get(`/folders/list-folder?folderPath=${orgName}`);
  //     if (!response.data.exists) {
  //       // If the folder doesn't exist, create it
  //       await axiosInstance.post('/folders/create-folder', { folderPath: orgName });
  //       console.log('Org folder created:', orgName);
  //     }
  //   } catch (error) {
  //     console.error('Error checking or creating org folder:', error);
  //     alert('Error creating org folder.');
  //   }
  // };

  // Create the project folder inside orgName
  // const createProjectFolder = async (folderName) => {
  //   if (!folderName) return;
  //   setIsLoading(true);

  //   // Ensure org folder exists before creating the project folder
  //   await createOrgFolderIfNeeded();

  //   const folderPath = `${orgName}/${folderName}`;


  //   try {
  //     await axiosInstance.post('/folders/create-folder', { folderPath });

  //     // Create subfolders inside the newly created folder after user confirms
  //     await createSubFolders(folderPath);

  //     setFolders((prevFolders) => [...prevFolders, { name: folderName, type: 'folder' }]);

  //     alert(`Project folder "${folderName}" created successfully.`);
  //   } catch (error) {
  //     console.error('Error creating project folder:', error);
  //     alert(`Error creating project folder "${folderName}".`);
  //   }

  //   setIsLoading(false);
  // };

  // Watch for projectFolder from Redux state to trigger folder creation
  // useEffect(() => {
  //   if (projectFolder) {
  //     createProjectFolder(projectFolder);
  //   }
  // }, [projectFolder]);

  // Delete an item (folder/file)
  const deleteItem = async () => {
    if (!selectedItem) return;
    const { fullPath, type } = selectedItem;

    const confirmation = window.confirm(
      `Are you sure you want to delete this ${type === 'folder' ? 'folder' : 'file'}? This will also delete all contents inside the folder if it's a folder.`
    );
    if (!confirmation) return;

    setIsLoading(true);

    try {
      await axiosInstance.post('/delete-item', { itemPath: fullPath, type });
      alert(`${type === 'folder' ? 'Folder' : 'File'} deleted successfully at path: ${fullPath}`);
      fetchFolderContents(); // Refresh folder contents after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error deleting ${type === 'folder' ? 'folder' : 'file'} at path: ${fullPath}`);
    }

    setIsLoading(false);
  };


  const handleItemClick = (item, type) => {
    if (type === 'file') {
      const fullPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
      setSelectedItem({ name: item.name, type, fullPath });
    } else if (type === 'folder') {
      const fullPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
      setSelectedItem({ name: item.name, type, fullPath });
    }
  };

  // Function to fetch subfolders for a specific project folder
  const fetchSubfolders = async (folderName) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(`/folders/subfolders/${orgName}/${folderName}`);
      const subfolders = response.data.subfolders || [];
      setFolders(subfolders);
    } catch (error) {
      console.error('Error fetching subfolders:', error);
      alert('Error loading subfolders.');
    }

    setIsLoading(false);
  };


  // Function that gets triggered when a folder is double-clicked
  const handleFolderDoubleClick = (folderName) => {
    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
    setCurrentFolder(newPath);

    // Fetch subfolders for the selected folder
    fetchSubfolders(folderName);  // This loads the subfolders of the current folder
  };


  const navigateTo = (index) => {
    const pathParts = currentFolder.split('/').slice(0, index + 1); // Get the path up to the clicked breadcrumb
    setCurrentFolder(pathParts.join('/')); // Update the currentFolder to the new path
  };

  const renderFileItem = (file) => {
    const fileUrl = `https://s3.eu-north-1.amazonaws.com/mediashippers-filestash/${orgName}/${file.name}`; // Adjust the URL as necessary
  
    const handleDownload = () => {
      // Trigger file download by creating an anchor element and programmatically clicking it
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.name; // This will set the file's name when downloading
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <div
        key={file.id}
        className={`file-item ${selectedItem?.name === file.name ? 'selected' : ''}`}
        onClick={() => handleItemClick(file, 'file')}
      >
        <i className="fas fa-file-alt file-icon"></i>
        <span>{file.name}</span>
        {/* Add Download Button */}
        <button onClick={handleDownload} className="btn btn-primary btn-sm">
  Download
</button>

      </div>
    );
  };
  

  const filterFoldersByOrgName = (folders, orgName) => {
    return folders.filter(folder =>
      folder.name.toLowerCase().includes(orgName.toLowerCase())
    );
  };


  // Modify the folder list rendering to include filtering
  const renderFolderList = () => {
    // Filter folders based on orgName
    const filteredFolders = filterFoldersByOrgName(folders, orgName);

    // Log the filtered folders to the console (for debugging purposes)
    console.log("Filtered folders (matching orgName):", filteredFolders);

    return (
      <div className="folder-list">
        {isLoading ? (
          <p><Loader /></p>
        ) : (
          <>
            {/* Render only the folders that match orgName */}
            {filteredFolders.length > 0 ? (
              filteredFolders.map((folder) => renderFolderItem(folder))
            ) : (
              <p>No matching folders found for the organization.</p>
            )}
            {/* You can also render files here, if needed */}
            {files.map((file) => renderFileItem(file))}
          </>
        )}
      </div>
    );
  };



  // Modify the renderFolderItem function to include orgName filtering
  const renderFolderItem = (folder) => {
    const displayName = folder.name;

    // Check if the folder is a subfolder or a main project folder
    const isSubfolder = currentFolder.includes(displayName);  // Check if the folder is part of the current project folder

    return (
      <div
        key={folder.id}
        className={`folder-item ${selectedItem?.name === folder.name ? 'selected' : ''}`}
        onClick={() => handleItemClick(folder, 'folder')}
        onDoubleClick={() => handleFolderDoubleClick(folder.name)}
      >
        <i className={`fas ${isSubfolder ? 'fa-cogs' : 'fa-folder'} folder-icon`}></i>
        <span>{displayName}</span>
      </div>
    );
  };

  // Function to render breadcrumbs
  const renderBreadcrumbs = () => {
    const parts = currentFolder.split('/').filter(Boolean); // Split path and remove empty parts

    return (
      <div className="breadcrumbs">
        {/* Root breadcrumb */}
        <span
          className="breadcrumb-item"
          onClick={() => setCurrentFolder('')} // Reset to root when clicked
          style={{ cursor: 'pointer' }}
        >
          {orgName || 'Root Folder'}
        </span>

        {/* Breadcrumbs for subfolders */}
        {parts.map((part, index) => (
          <span key={index} className="breadcrumb-item">
            <span
              onClick={() => navigateTo(index)} // Navigate to the clicked breadcrumb
              style={{ cursor: 'pointer' }}
            >
              {part}
            </span>
          </span>
        ))}
      </div>
    );
  };

  // ------------------------------------------------------------------------
  const [data, setData] = useState({ folders: [], files: [] });
  const [history, setHistory] = useState([]); // Store previous folder paths
  const [currentPath, setCurrentPath] = useState(`mediashippers-filestash/${orgName}`); // Start from a specific folder

  console.log("path.......>>>", currentPath)
  useEffect(() => {
    console.log("fetchData(currentPath); called............")
    fetchData(currentPath);
  }, []);

const fetchData = async (folderPath) => {
  try {
    const response = await fetch(`/api/folders/s3-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token
      },
      body: JSON.stringify({ path: folderPath }), // Send full path
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    setData(result);
    setCurrentPath(folderPath);

    // Check if files exist and log them to the console
    if (result.files && result.files.length > 0) {
      console.log("Files detected in the folder:");
      result.files.forEach((file) => {
        console.log(`File name: ${file}`);
      });
    } else {
      console.log("No files found in this folder.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  const handleFolderClick = (folder) => {
    const newPath = `${currentPath}/${folder}`; // Append folder to current path
    setHistory((prev) => [...prev, currentPath]); // Save current path to history
    fetchData(newPath);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prevPath = history[history.length - 1]; // Get last visited path
      setHistory((prev) => prev.slice(0, -1)); // Remove last entry
      fetchData(prevPath);
    }
  };
  // ------------------------------------------------------------------------


  // file download - sukhada
  
    const [loading, setLoading] = useState(false);
    const fileUrls = [
      "s3://vod-delivery/Thumbnails/SampleVideo_5mb.0000000.jpg",
      "s3://vod-delivery/BangBangBetty2.json",
      "s3://vod-delivery/AfricasWildRoommatesScreenerEN1080final.srt",
      "s3://vod-delivery/MP4/sam.mp4"
    ];

    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzgwZmUxODVhNmY4YmMyOTg1ODFhN2QiLCJpYXQiOjE3NDI5MDQ4ODMsImV4cCI6MTc0MjkwODQ4M30.0fVePsTfVHpBNwhWwQs91F_arN-jzmdSRzBCN8wABgI";
    
    const handleDownloadAll = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/download-files/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // :small_blue_diamond: Send token
          },
          body: JSON.stringify({ files: fileUrls }),
        });
        const result = await response.json();
        if (result.urls) {
          result.urls.forEach(async (url, index) => {
            await downloadFile(url, `file-${index + 1}`); // :small_blue_diamond: Download file
          });
        } else {
          console.error("Failed to get download links:", result);
        }
      } catch (error) {
        console.error("Download failed:", error);
      }
      setLoading(false);
    };
    // Function to download file from a pre-signed URL
    // const downloadFile = async (url) => {
    //   try {
    //     // Extract the correct filename (remove query params)
    //     console.log("url >>>>", url)
    //     const filename = decodeURIComponent(url.split("/").pop().split("?")[0]);
    //     const response = await fetch(url);
    //     if (!response.ok) throw new Error(`Failed to download: ${response.status}`);
    //     const blob = await response.blob();
    //     const blobUrl = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = blobUrl;
    //     link.download = filename; // Correct filename for all file types
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(blobUrl); // Cleanup memory
    //   } catch (error) {
    //     console.error("Download Error:", error);
    //   }
    // };


    const downloadFile = async (url) => {
      try {
        // Extract the correct filename (remove query params)
        console.log("url >>>>", url);
        const filename = decodeURIComponent(url.split("/").pop().split("?")[0]);
    
        // Ensure this is triggered by a user action (e.g., a click)
        const response = await fetch(url);
    
        // Check for a valid response
        if (!response.ok) throw new Error(`Failed to download: ${response.status}`);
    
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
    
        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename; // Correct filename for all file types
    
        // Add the link to the document, trigger the click, and remove the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        // Cleanup memory by revoking the blob URL
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download Error:", error);
      }
    };
    


    const handleFileDownload = async (file) => {
      // Assuming currentPath is something like 's3://mediashippers-filestash/ledzeppelin/LEDZ-00007/trailer'
      console.log("path.......>>>", currentPath);
      
      // Combine the currentPath with the file name to create the full S3 path
      const fullFilePath = `s3://${currentPath}/${file}`;
      setLoading(true);
      
      try {
        const response = await fetch(`/api/folders/download-files/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
          body: JSON.stringify({ files: fullFilePath }), // Send files array
        });
        
        // Ensure the response is okay and that response.json() can be called
        if (!response.ok) {
          throw new Error(`Failed to fetch download links: ${response.status}`);
        }
        
        const result = await response.json();  // Await the JSON response
        console.log("Result url ", result)
        if (result.urls) {
          // Assuming result.urls is an array with pre-signed URLs
          downloadFile(result.urls); // Download the first file URL (if needed, handle multiple URLs)

        } else {
          console.error("Failed to get download links:", result);
        }
      } catch (error) {
        console.error("Download failed:", error);
      }
    
      // Replace 's3://' with the proper URL scheme (https:// or http://) to point to S3
      const fileUrl = fullFilePath;
      console.log("file url", fileUrl);
      console.log("full path", fullFilePath);
    
      // Create an anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.href = fileUrl;
      anchor.download = file; // This sets the file name when downloaded
      anchor.click(); // Simulate a click to download the file
    };
    

  return (
    <div className="s3-manager">
      <h1 className="text-left text-2xl pb-4 mt-2 text-white">Project File Upload</h1>
      {renderBreadcrumbs()}

      <div className="options-box">
        {/* <button
          className="action-button"
          onClick={() => setShowCreateProject(true)}
          disabled={isLoading}
        >
          <i className="fas fa-project-diagram"></i> Create Project
        </button> */}
        {/* <button
          className="action-button"
          onClick={() => setShowCreateFolder(true)}
          disabled={isLoading}
        >
          <i className="fas fa-folder-plus"></i> Create Folder
        </button> */}
        <button
          className="action-button"
          onClick={() => setShowCreateFile(true)}
          disabled={isLoading}
        >
          <i className="fas fa-file-upload"></i> Upload File
        </button>
        <button
          className="action-button delete-button"
          onClick={deleteItem}
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

      {showCreateProject && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
            />
            <div className="modal-buttons">
              <button className="modal-button" onClick={() => createProjectFolder(projectName)}>
                Create Project
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowCreateProject(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateFolder && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Folder</h3>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder Name"
            />
            <div className="modal-buttons">
              <button className="modal-button" onClick={createFolder}>
                Create
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowCreateFolder(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateFile && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload File</h3>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag & drop files here, or click to select files</p>
              {isLoading && (
                <>
                  <div>Uploading... Progress: {progress}%</div>
                  <progress value={progress} max={100}></progress>
                </>
              )}
            </div>
            <div className="modal-buttons">
              <button className="modal-button" onClick={onDrop}>
                Upload
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowCreateFile(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="folder-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {folders.map((folder) => renderFolderItem(folder))}
            {files.map((file) => renderFileItem(file))}
          </>
        )}
      </div> */}

      <div className="container">
        <button className="back-btn" onClick={goBack} disabled={history.length === 0}>
          🔙 Back
        </button>

        <h2 className="folder-title">Folder: {currentPath}</h2>

        <div className="grid-container">
  {data.folders.map((folder) => (
    <div key={folder} className="card folder" onDoubleClick={() => handleFolderClick(folder)}>
      <span title={folder}>📁 {folder}</span>
    </div>
  ))}

  {data.files.map((file) => (
    <div key={file} className="card file">
      <span title={file}>📄 {file}</span>

      {/* Add a download button for each file */}
      <button
        className="download-button"
        onClick={() => handleFileDownload(file)}
      >
        Download
      </button>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default S3Manager;
