import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './index.css';

function S3Manager() {
    const [currentFolder, setCurrentFolder] = useState('');
    const [folderName, setFolderName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showCreateFile, setShowCreateFile] = useState(false);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchFolderContents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/folders/list-folder?folderPath=${currentFolder}`
            );
            setFolders(response.data.folders || []);
            setFiles(response.data.files || []);
        } catch (error) {
            console.error('Error fetching folder contents:', error);
            alert('Error fetching folder contents.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchFolderContents();
    }, [currentFolder]);

    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        setProgress(0);
        setIsLoading(true);

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folderPath', currentFolder);

            try {
                await axios.post('http://localhost:3000/api/files/upload-file', formData, {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    },
                });
                setFiles((prevFiles) => [...prevFiles, { name: file.name, type: 'file' }]);
                alert(`${file.name} uploaded successfully.`);
            } catch (error) {
                console.error('Error uploading file:', error);
                alert(`Error uploading ${file.name}.`);
            }
        }

        setProgress(0);
        setIsLoading(false);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const createFolder = async () => {
        if (!folderName) {
            alert('Please enter a folder name.');
            return;
        }

        setIsLoading(true);

        const folderPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;

        try {
            await axios.post('http://localhost:3000/api/folders/create-folder', {
                folderPath,
            });

            setFolders((prevFolders) => [...prevFolders, { name: folderName, type: 'folder' }]);
            setFolderName('');
            setShowCreateFolder(false);
            alert('Folder created successfully.');
        } catch (error) {
            console.error('Error creating folder:', error);
            alert('Error creating folder.');
        }

        setIsLoading(false);
    };

    const createProject = async () => {
        if (!projectName) {
            alert('Please enter a project name.');
            return;
        }

        setIsLoading(true);

        // Define the subfolders for the project
        const subFolders = [
            'film screener',
            'trailer',
            'poster',
            'media coverage',
            'behind the scenes',
            'film stills',
            'cast and crew details',
            'srt files',
            'info docs',
            'master',
        ];

        // Create the project folder path
        const projectFolderPath = currentFolder ? `${currentFolder}/${projectName}` : projectName;

        try {
            // Create the main project folder
            await axios.post('http://localhost:3000/api/folders/create-folder', {
                folderPath: projectFolderPath,
            });

            // Automatically create the predefined subfolders inside the project
            const folderPromises = subFolders.map((folderName) => {
                const folderPath = `${projectFolderPath}/${folderName}`;
                return axios.post('http://localhost:3000/api/folders/create-folder', {
                    folderPath,
                });
            });

            // Wait for all folder creation requests to complete
            await Promise.all(folderPromises);

            setFolders((prevFolders) => [
                ...prevFolders,
                { name: projectName, type: 'folder' },
            ]);
            setProjectName('');
            setShowCreateProject(false);
            alert('Project and folders created successfully.');
        } catch (error) {
            console.error('Error creating project and folders:', error);
            alert('Error creating project.');
        }

        setIsLoading(false);
    };

    const deleteItem = async () => {
        if (!selectedItem) return;
        const { fullPath, type } = selectedItem;

        setIsLoading(true);

        try {
            await axios.post(
                'http://localhost:3000/api/delete-item',
                { itemPath: fullPath, type },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            alert(`${type === 'folder' ? 'Folder' : 'File'} deleted successfully at path: ${fullPath}`);
            fetchFolderContents();  // Refresh folder contents
        } catch (error) {
            console.error('Error deleting item:', error);
            alert(`Error deleting ${type === 'folder' ? 'folder' : 'file'} at path: ${fullPath}`);
        }

        setIsLoading(false);
    };

    const handleItemClick = (item, type) => {
        // Construct the full path including the folder and file name
        const fullPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
        setSelectedItem({ name: item.name, type, fullPath });
    };

    const handleFolderDoubleClick = (folderName) => {
        const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
        setCurrentFolder(newPath);
    };

    const navigateTo = (index) => {
        const pathParts = currentFolder.split('/').slice(0, index + 1);
        setCurrentFolder(pathParts.join('/'));
    };

    const renderBreadcrumbs = () => {
        const parts = currentFolder.split('/').filter(Boolean);

        return (
            <div className="breadcrumbs">
                <span
                    className="breadcrumb-item"
                    onClick={() => setCurrentFolder('')}
                    style={{ cursor: 'pointer' }}
                >
                    Root
                </span>
                {parts.map((part, index) => (
                    <span key={index} className="breadcrumb-item">
                        {' / '}
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
            <h1 className="title">S3 Manager</h1>
            {renderBreadcrumbs()}

            <div className="options-box">
                <button
                    className="action-button"
                    onClick={() => setShowCreateProject(true)}
                    disabled={isLoading}
                >
                    <i className="fas fa-project-diagram"></i> Create Project
                </button>
                <button
                    className="action-button"
                    onClick={() => setShowCreateFolder(true)}
                    disabled={isLoading}
                >
                    <i className="fas fa-folder-plus"></i> Create Folder
                </button>
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

                {/* Refresh Button */}
                <button
                    className="action-button"
                    onClick={fetchFolderContents} // Trigger folder content refresh
                    disabled={isLoading}
                >
                    <i className="fas fa-sync-alt"></i> Refresh
                </button>
            </div>

            {/* Show selected item path for confirmation */}
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
                            <button className="modal-button" onClick={createProject}>
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
                            <p>Drag and drop files here, or click to select files</p>
                        </div>
                        {progress > 0 && (
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${progress}%` }}
                                >
                                    {progress}%
                                </div>
                            </div>
                        )}
                        <div className="modal-buttons">
                            <button
                                className="modal-button cancel"
                                onClick={() => setShowCreateFile(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="file-list">
                <h3>Folders</h3>
                <div className="folder-list">
                    {folders.map((folder, index) => (
                        <div
                            key={index}
                            className={`folder-item ${selectedItem?.name === folder.name ? 'selected' : ''}`}
                            onClick={() => handleItemClick(folder, 'folder')}
                            onDoubleClick={() => handleFolderDoubleClick(folder.name)}
                        >
                            <i className="fas fa-folder folder-icon"></i>
                            <span>{folder.name}</span>
                        </div>
                    ))}
                </div>

                <h3>Files</h3>
                <div className="file-list">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className={`file-item ${selectedItem?.name === file.name ? 'selected' : ''}`}
                            onClick={() => handleItemClick(file, 'file')}
                        >
                            <i className="fas fa-file-alt file-icon"></i>
                            <span>{file.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default S3Manager;
