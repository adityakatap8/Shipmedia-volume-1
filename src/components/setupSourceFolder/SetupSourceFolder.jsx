import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";

// For the modal to be rendered correctly, attach it to the root of your app
Modal.setAppElement("#root");

const SetupSourceFolder = ({ goToNextTab }) => {
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [isClearing, setIsClearing] = useState(false);
    const [hasFileSelected, setHasFileSelected] = useState(false);
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedSources, setSelectedSources] = useState([]);

    const [activeSection, setActiveSection] = useState(null);
    const [warningMessage, setWarningMessage] = useState('');
    const [url, setUrl] = useState('');
    const [dragDrop, setDragDrop] = useState('');
    const [saved, setSaved] = useState(false);
    const [savedData, setSavedData] = useState(null);

    const [metadata, setMetadata] = useState(null);

    const [isLoading, setIsLoading] = useState(false);



    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [inputAdded, setInputAdded] = useState(false);  // Track if input is added in either section

    const [providerSettings, setProviderSettings] = useState({
        key: '',
        secret: '',
        path: '',
        region: ''
    });


    const [submittedData, setSubmittedData] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);






    const handleClearForm = () => {
        setIsClearing(true);
        setTimeout(() => {
            setSelectedProvider(null);
            setIsModalOpen(false);
            setIsMetadataModalOpen(false);
            setFiles([]);
            setActiveSection(null);
            setInputAdded(false);
            setWarningMessage('');
            setUrl('');
            setSaved(false);
            setProviderSettings({
                key: '',
                secret: '',
                path: '',
                region: ''
            });
            setIsClearing(false);

        }, 100);
    };



    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (formIsValid(form)) {
            const formData = new FormData(form);
            try {
                // Store the form data in the state
                setSubmittedData(Object.fromEntries(formData));

                // Process the form data here
                await processFormData(formData);

                // Close the modal and show success message
                setIsMetadataModalOpen(false);
                setShowSuccessMessage(true);
            } catch (error) {
                console.error("Failed to submit form:", error);
            }
        } else {
            // Handle invalid form submission
            console.error("Form is invalid");
        }
    };

    // Function to cancel editing
    const handleCancel = () => {
        setIsEditing(false); // Exit editing mode
        setEditingKey(null); // Clear the current editing key
    };

    const [editingKey, setEditingKey] = useState(null); // Track which key is being edited
    const [editedValue, setEditedValue] = useState(''); // Store the current edited value


    // Function to handle the edit button click
    const handleEdit = (key, value) => {
        setEditingKey(key); // Set the key that's being edited
        setEditedValue(Array.isArray(value) ? value.join(', ') : value); // Set the current value in the input
        setIsEditing(true); // Switch to editing mode
    };

    // Function to handle input change (renamed to `updateEditedValue`)
    const updateEditedValue = (e) => {
        setEditedValue(e.target.value); // Update the edited value
    };

    // Function to save the changes
    const handleMetaSave = () => {
        if (editingKey) {
            // Here you can handle the save logic (e.g., update the state, or send to a server)
            // For now, we simply toggle back to non-edit mode
            const newMetadata = { ...metadata, [editingKey]: editedValue.split(', ').map(item => item.trim()) };
            console.log('Updated Metadata:', newMetadata); // Log the updated metadata to console or use as needed
        }
        setIsEditing(false); // Exit editing mode
        setEditingKey(null); // Clear the current editing key
        setFileInputKey(null);
    };

    // Function to handle file input change for uploading files
    const handleFileUploadMeta = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            // Update the metadata or state with the file info
            setEditedValue(file.name); // Display the file name in the input for the user
            // You could also store the file in your state if you want to send it to the server later
        }
    };

    const handleDragDropClick = () => {
        if (activeSection === 'dragDrop') return; // Already selected
        if (files.length > 0) {
            setWarningMessage('You cannot change the source after adding a file.');
            return;
        }
        setActiveSection('dragDrop');
        setWarningMessage(''); // Clear any warning
        setSelectedSource('dragDrop');  // Set the selected source to 'dragDrop'
    };

    const handleUrlClick = () => {
        if (activeSection === 'url') return; // Prevent action if 'url' is active
        setActiveSection('url');  // Enable URL section
        setSelectedSource('url'); // Set the selected source to 'url'
    };

    const handleUrlChange = (e) => {
        const urlInput = e.target.value;
        setUrl(urlInput);
        if (urlInput.length > 0) {
            setInputAdded(true);  // If URL is entered, set inputAdded to true
        }
    };

    const handleFileChange = (event) => {
        const fileList = event.target.files;
        if (fileList) {
            // Convert FileList to an array (if necessary)
            const filesArray = Array.from(fileList);
            setFiles(filesArray); // Update state with the array
        }
    };

    const handleDragDropChange = () => {
        if (files.length > 0) {
            setInputAdded(true); // When files are dragged and dropped, inputAdded becomes true
        }
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };


    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fileName', files[0].name);
        formData.append('fileType', files[0].type);
        formData.append('provider', selectedProvider);
        formData.append('providerConfig', JSON.stringify({
            key: inputKey.value,
            secret: inputSecret.value,
            path: inputPath.value,
            region: inputRegion.value
        }));
        formData.append('metadata', JSON.stringify({
            title: inputTitle.value,
            genre: selectGenre.value,
            category: selectCategory.value,
            language: selectLanguage.value,
            subtitleClosedCaptions: inputSubtitles.checked,
            auxiliaryFiles: inputAuxiliary.files ? Array.from(inputAuxiliary.files).map(file => file.name) : [],
            audio: inputAudio.files ? inputAudio.files[0].name : null
        }));

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error uploading source data:', error);
        }
    };

    // create test plans, add test plans

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles([...files, ...acceptedFiles]);
            console.log(acceptedFiles);
        },
    });

    const handleProviderClick = (provider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };



    function formIsValid(formData) {
        // Check if title is empty
        if (!formData.get('title') || !formData.get('title').value.trim()) {
            return false;
        }

        // Check if genre is selected
        const genre = formData.get('genre');
        if (!genre || !genre.value) {
            return false;
        }

        // Check if category is selected
        const category = formData.get('category');
        if (!category || !category.value) {
            return false;
        }

        // Check if language is selected
        const language = formData.get('language');
        if (!language || !language.value) {
            return false;
        }

        // Check if auxiliary files are uploaded
        const auxiliaryFiles = formData.getAll('auxiliaryFiles');
        if (auxiliaryFiles.length === 0) {
            return false;
        }

        // Check if audio file is uploaded
        const audioFile = formData.get('audioFile');
        if (!audioFile || !audioFile.value) {
            return false;
        }

        // Check if subtitles/closed captions file is uploaded
        const subtitlesCaptionsFile = formData.get('subtitlesCaptionsFile');
        if (!subtitlesCaptionsFile || !subtitlesCaptionsFile.value) {
            return false;
        }

        // If all checks pass, the form is valid
        return true;
    }


    const openMetadataModal = () => setIsMetadataModalOpen(true);


    const handleMetadataSubmit = (event) => {
        event.preventDefault();

        // Create a metadata object from the form inputs
        const formData = new FormData(event.target);
        const newMetadata = {
            title: formData.get('title'),  // Get text input for title
            genre: formData.get('genre'),  // Get selected genre
            category: formData.get('category'),  // Get selected category
            language: formData.get('language'),  // Get selected language
            auxiliaryFiles: Array.from(formData.getAll('auxiliaryFiles')).map(file => file.name),  // Get file names from 'auxiliaryFiles'
            subtitlesCaptionsFile: formData.get('subtitlesCaptionsFile') ? formData.get('subtitlesCaptionsFile').name : null,  // Handle file if present, or set to null if no file
            audioFile: formData.get('audioFile') ? formData.get('audioFile').name : null,  // Handle file if present, or set to null if no file
        };

        console.log('Metadata submitted:', newMetadata);  // Log the metadata to confirm the data

        // Update the state with the new metadata
        setMetadata(newMetadata);

        // Close the modal after saving metadata
        closeMetadataModal();
    };

    // Helper to close the modal
    const closeMetadataModal = () => {
        setIsMetadataModalOpen(false);
    };


    // const closeMetadataModal = (event) => {
    //     if (!(event.target instanceof HTMLFormElement)) {
    //         console.error('Event target is not an HTMLFormElement:', event.target);
    //         return;
    //     }

    //     try {
    //         const formData = new FormData(event.target);

    //         // Convert FormData to object
    //         const metadata = Object.fromEntries(formData);

    //         // Store the metadata in the state
    //         setSubmittedData(metadata);

    //         // Close the modal
    //         setIsMetadataModalOpen(false);
    //         setShowSuccessMessage(true);
    //     } catch (error) {
    //         console.error("Error processing form data:", error);
    //     }
    // };

    const closeMetaModal = () => {
        setIsMetadataModalOpen(false);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProviderSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProviderSettings = () => {
        closeModal();
        setSavedData({
            provider: selectedProvider,
            settings: providerSettings,
            metadata: metadata
        });
    };

    const renderSuccessMessage = () => {
        return (
            <div className="mt-4 text-green-600">
                <h3 className="font-semibold">Success!</h3>
                <p>
                    {activeSection === 'dragDrop'
                        ? `Uploaded File: ${files[0].name}`
                        : `URL: ${url}`}
                </p>
                {selectedProvider && <p>Provider: {selectedProvider}</p>}
            </div>
        );
    };

    const handleClearUrl = () => {
        setUrl('');  // Clear the URL input
        setProviderSettings({
            key: '',
            secret: '',
            path: '',
            region: ''
        });  // Clear provider settings
        setFiles([]);  // Clear any uploaded files
        setSelectedProvider(null);  // Reset provider selection
        setWarningMessage('');  // Clear any warning
    };

    const [isSaveDisabled, setIsSaveDisabled] = useState(false);

    useEffect(() => {
        // Initialize isSaveDisabled here if needed
        setIsSaveDisabled(false);
    }, []);

    const disableSave =
        !selectedSource ||  // If no source is selected
        (selectedSource === 'dragDrop' && files.length === 0) ||  // If dragDrop is selected but no file is uploaded
        (selectedSource === 'url' && !url) ||  // If URL is selected but no URL is provided
        warningMessage ||  // If there's a warning message
        (selectedSource === 'url' && (!providerSettings.key || !providerSettings.path || !providerSettings.region)) ||  // If URL is selected but any provider settings are missing
        (selectedSource === 'dragDrop' && selectedSource === 'url');  // Disable if both are selected


    const handleSourceSelection = (source) => {
        setSelectedSources((prevSources) =>
            prevSources.includes(source)
                ? prevSources.filter((s) => s !== source) // If it's already selected, remove it
                : [...prevSources, source] // Otherwise, add the new source
        );
    };


    const handleToggle = () => {
        if (selectedSource === 'dragDrop') {
            setSelectedSource('url'); // Switch to URL
            setActiveSection('url'); // Activate URL section
        } else {
            setSelectedSource('dragDrop'); // Switch to dragDrop
            setActiveSection('dragDrop'); // Activate dragDrop section
        }
    };



    const isOptionOne = selectedSource === 'dragDrop';

    const getDragDropClass = selectedSource === 'dragDrop' ? '' : 'bg-gray-200 cursor-not-allowed pointer-events-none';
    const getUrlClass = selectedSource === 'url' ? '' : 'bg-gray-200 cursor-not-allowed pointer-events-none';

    const buttonText = selectedSource === 'dragDrop' ? "Upload and Drop" : "Cloud";

    const buttonIcon = selectedSource === 'dragDrop' ? (
        <i className="bi bi-arrow-left text-white"></i> // Left Arrow
    ) : (
        <i className="bi bi-arrow-right text-white"></i> // Right Arrow
    );



    const [isSaving, setIsSaving] = useState(false);





    //   const handleSave = async () => {
    //     try {
    //         setIsSaving(true); // Set loading state to true when the API call starts
    //         setIsSaveDisabled(true); // Disable button while saving

    //         // Ensure we have a URL or file data (drag-and-drop or URL)
    //         if (!url && (!files || files.length === 0)) {
    //             throw new Error('Please provide a valid file or URL.');
    //         }

    //         // Prepare the sourceTypeData payload
    //         const sourceTypeData = {
    //             url: url,  // User-provided URL (if any)
    //             awsS3Config: providerSettings,  // AWS S3 settings
    //             fileUploadConfig: {
    //                 fileName: files[0]?.name || '',  // Ensure a file name exists (either from drag-and-drop or URL)
    //                 allowedExtensions: [".mp4", ".avi"], // Example allowed extensions
    //             },
    //         };

    //         // Prepare metadata if available
    //         const metadataData = {
    //             ...metadata,  // Spread existing metadata object
    //             subtitleClosedCaptions: metadata?.subtitlesCaptionsFile ? [metadata.subtitlesCaptionsFile.name] : [],
    //             auxiliaryFiles: metadata?.auxiliaryFiles ? [metadata.auxiliaryFiles.name] : [],
    //             audio: metadata?.audioFile ? metadata.audioFile.name : '',
    //         };

    //         console.log('Sending request body:', JSON.stringify({
    //             sourceTypeData,  // Include sourceTypeData at the root level
    //             metadata: metadataData,  // Include metadata at the root level (separate from sourceTypeData)
    //         }, null, 2));

    //         // Send the data to the API
    //         const response = await fetch('http://localhost:3000/api/sourcetype/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Access-Control-Allow-Origin': '*',
    //                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //                 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //             },
    //             body: JSON.stringify({
    //                 sourceTypeData,  // Send `sourceTypeData` as root-level object
    //                 metadata: metadataData,  // Send `metadata` as a separate root-level field
    //             }),
    //         });

    //         console.log('API Call Successful');
    //         console.log('Response status:', response.status);

    //         if (!response.ok) {
    //             const errorData = await response.text();  // Read response body to get more details
    //             throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorData}`);
    //         }

    //         const data = await response.json();
    //         console.log('API Response:', data);

    //         if (data && data.id) {
    //             console.log('Source Type saved successfully. ID:', data.id);
    //             setSaved(true); // Set saved to true on success
    //             setSuccessMessage('Source Type saved successfully.'); // Update success message
    //         } else {
    //             console.error('Unexpected response from server');
    //             setErrorMessage('Failed to save the source type.');
    //         }
    //     } catch (error) {
    //         console.error('Fetch error:', error);
    //         if (error instanceof Error) {
    //             setErrorMessage(error.message);
    //         } else {
    //             setErrorMessage('An unknown error occurred. Please try again.');
    //         }
    //     } finally {
    //         setIsSaving(false); // Set loading state to false after the API call is done
    //         setIsSaveDisabled(false); // Enable button again
    //     }
    // };


    const handleSave = async () => {
        try {
            setIsSaving(true); // Set loading state to true when the API call starts
            setIsSaveDisabled(true); // Disable button while saving

            // Ensure we have a URL or file data (drag-and-drop or URL)
            if (!url && (!files || files.length === 0)) {
                throw new Error('Please provide a valid file or URL.');
            }

            // Prepare the sourceTypeData payload
            const sourceTypeData = {
                url: url,  // User-provided URL (if any)
                awsS3Config: providerSettings,  // AWS S3 settings
                fileUploadConfig: {
                    fileName: files[0]?.name || '',  // Ensure a file name exists (either from drag-and-drop or URL)
                    allowedExtensions: [".mp4", ".avi"], // Example allowed extensions
                },
            };

            // Prepare metadata if available
            const metadataData = {
                ...metadata,  // Spread existing metadata object
                subtitleClosedCaptions: metadata?.subtitlesCaptionsFile ? [metadata.subtitlesCaptionsFile.name] : [],
                auxiliaryFiles: metadata?.auxiliaryFiles ? [metadata.auxiliaryFiles.name] : [],
                audio: metadata?.audioFile ? metadata.audioFile.name : '',
            };

            console.log('Sending request body:', JSON.stringify({
                sourceTypeData,  // Include sourceTypeData at the root level
                metadata: metadataData,  // Include metadata at the root level (separate from sourceTypeData)
            }, null, 2));

            // Send the data to the API
            const response = await fetch('http://localhost:3000/api/sourcetype/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                body: JSON.stringify({
                    sourceTypeData,  // Send `sourceTypeData` as root-level object
                    metadata: metadataData,  // Send `metadata` as a separate root-level field
                }),
            });

            console.log('API Call Successful');
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.text();  // Read response body to get more details
                throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorData}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data && data.id) {
                console.log('Source Type saved successfully. ID:', data.id);
                setSaved(true); // Set saved to true on success
                setSuccessMessage('Source Type saved successfully.'); // Update success message
            } else {
                console.error('Unexpected response from server');
                setErrorMessage('Failed to save the source type.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred. Please try again.');
            }
        } finally {
            setIsSaving(false); // Set loading state to false after the API call is done
            setIsSaveDisabled(false); // Enable button again
        }
    };

    // Function to validate and return subtitle file details
    const validateSubtitleFile = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // List of valid subtitle formats
        const validSubtitleFormats = ['srt', 'vtt', 'webvtt', 'dfxp', 'ttml', 'xml', 'ass', 'ssa', 'sub', 'txt'];

        // Check if the file extension is valid
        if (!validSubtitleFormats.includes(fileExtension)) {
            return (
                <p style={{ color: 'red' }}>
                    Invalid file extension. Please upload a subtitle file (e.g., SRT, VTT, WebVTT, DFXP, TTML, XML, ASS, SSA, SUB, TXT).
                </p>
            );
        }

        // If valid, return the file name
        return <p>{file.name}</p>;
    };


    const [audioBase64, setAudioBase64] = useState(null);


    // Function to validate and display the audio file details
    const validateAudioFile = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // List of valid audio formats by extension and MIME type
        const validAudioFormats = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma', 'alac', 'opus'];
        const validAudioMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac', 'audio/mp4', 'audio/alac', 'audio/opus'];

        // Check if the file extension is valid
        if (!validAudioFormats.includes(fileExtension)) {
            return <p style={{ color: 'red' }}>Invalid file extension. Please upload an audio file (e.g., MP3, WAV, AAC, OGG, etc.).</p>;
        }

        // Check if the MIME type matches the file extension
        if (!validAudioMimeTypes.includes(file.type)) {
            return <p style={{ color: 'red' }}>Unsupported MIME type for this audio file.</p>;
        }

        // Read the file as base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setAudioBase64(reader.result.split(',')[1]); // Set the base64 part only
        };
        reader.readAsDataURL(file);

        // Display loading message until base64 is ready
        if (!audioBase64) {
            return <p>Loading audio...</p>;
        }

        // Display the audio file name and player
        return (
            <div>
                <p><strong>Audio File:</strong> {file.name}</p>
                {/* <audio controls>
                    <source src={`data:audio/${fileExtension};base64,${file.base64}`} type={`audio/${fileExtension}`} />
                    Your browser does not support the audio element.
                </audio> */}
            </div>
        );
    };


    return (
        // right side drag and drop
        <div>
            {saved ? (
                <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
                    <h3 className="font-semibold">Success!</h3>

                    {/* Display the file/url based on selectedSource */}
                    <p>
                        {selectedSource === 'dragDrop' ? `Uploaded File: ${files[0].name}` : `URL: ${url}`}
                    </p>

                    {/* Display the selected provider if it exists */}
                    {selectedProvider && <p>Provider: {selectedProvider}</p>}

                    {/* Display Metadata */}
                    {metadata && Object.keys(metadata).length > 0 && (
                        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                            <h3 className="text-lg font-semibold mb-4">Metadata:</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Iterate over the metadata object to show each key and value */}
                                {Object.entries(metadata).map(([key, value], index) => (
                                    <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                                        {/* Display each key and value */}
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-700">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                                            </p>
                                            {/* Display value: either array joined by commas, single value, or N/A */}
                                            <pre className="text-sm text-gray-600">
                                                {Array.isArray(value)
                                                    ? value.length > 0
                                                        ? value.join(', ')  // Join array elements with a comma if it's an array
                                                        : 'No items available'
                                                    : value || 'N/A'}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // { left side with drag and drop section  }
                <div className={`flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4`}>
                    <h2 className="text-lg font-semibold mb-4 text-center text-customCardBlue">
                        To Encode a Video, Tell us where your source video is located
                    </h2>
                    <div className={` flex justify-between items-center w-full mb-4 }`}>
                        <div className={`drag-drop-section ${getDragDropClass} flex-1 pr-4 m-1 w-1/2 `}>
                            <div
                                className={`drag-drop-content flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-full ${selectedSource === 'dragDrop' ? '' : 'cursor-not-allowed'}`}
                                // onClick={() => setSelectedSource('dragDrop')}
                                onClick={() => handleSourceSelection('dragDrop')}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} value={dragDrop} />
                                <p className="mb-2">Drag and Drop your content here</p>
                                <div className="text-6xl">+</div>
                            </div>

                            {/* Displaying the uploaded files */}
                            {files.length > 0 && (
                                <div className="mt-4 text-left w-full">
                                    <h4 className="font-semibold">Uploaded:</h4>
                                    <ul className="list-disc list-inside">
                                        {files && Array.isArray(files) && files.length > 0 ? (
                                            files.map((file, index) => (
                                                <li key={index} className="text-gray-700 flex justify-between">
                                                    {file.name} ({Math.round(file.size / 1024)} KB)
                                                    <button onClick={() => handleRemoveFile(index)} className="ml-4 text-red-500">
                                                        Remove
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No files uploaded.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* end of drag and drop section */}
                        <div className="flex items-center p-2 ml-30">
                            <div className="h-64 border-l-2 border-dotted border-gray-300">

                            </div>

                        </div>

                        {/* right side url and cloud settings */}

                        <div className={`flex flex-col space-y-4 m-1 w-1/2 ${getUrlClass}`}>
                            <input
                                className="border border-gray-300 rounded-lg py-2 px-4 w-full mb-4"
                                placeholder="Add URL Here"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}

                                // disabled={selectedSource !== 'url'} // Disable if dragDrop is selected
                                disabled={selectedSources.includes('dragDrop')}
                            />



                            {/* Display Provider Settings or Buttons to Choose a Provider */}
                            {selectedProvider ? (
                                <div className="text-gray-700">
                                    <h4>{selectedProvider} Settings:</h4>
                                    <p>Key: {providerSettings.key}</p>
                                    <p>Secret: {providerSettings.secret}</p>
                                    <p>Path: {providerSettings.path}</p>
                                    <p>Region: {providerSettings.region}</p>
                                </div>
                            ) : (
                                <>
                                    {/* AWS S3 and GCP Buttons */}
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("AWS S3")}
                                        disabled={selectedSource !== 'url'} // Disable if URL is not selected
                                    >
                                        AWS S3
                                    </button>
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("GCP")}
                                        disabled={selectedSource !== 'url'} // Disable if URL is not selected
                                    >
                                        GCP
                                    </button>
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("GCP")}
                                        disabled={selectedSource !== 'url'} // Disable if URL is not selected
                                    >
                                        Azure
                                    </button>
                                </>
                            )}
                            <div className="flex justify-between items-center w-full">
                                {/* Clear Button in URL Section */}
                                {selectedSource === 'url' && (
                                    <button
                                        className="py-2 px-4 bg-red-500 text-white rounded-3xl"
                                        onClick={handleClearUrl}
                                    >
                                        Clear URL
                                    </button>
                                )}
                            </div>

                            {isModalOpen && (
                                <Modal
                                    isOpen={isModalOpen}
                                    onRequestClose={closeModal}
                                    contentLabel="Provider Input Modal"
                                    className="absolute bg-white rounded-3xl shadow-lg max-w-md p-6"
                                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
                                >
                                    <h2 className="text-lg font-semibold mb-4">
                                        {selectedProvider} Settings
                                    </h2>
                                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                        <input
                                            type="text"
                                            name="key"
                                            placeholder="Key"
                                            className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                                            value={providerSettings.key}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="secret"
                                            placeholder="Secret"
                                            className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                                            value={providerSettings.secret}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="path"
                                            placeholder="Path"
                                            className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                                            value={providerSettings.path}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="region"
                                            placeholder="Region"
                                            className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                                            value={providerSettings.region}
                                            onChange={handleInputChange}
                                        />

                                        <button
                                            type="button"
                                            className="py-2 px-4 bg-customCardBlue text-white rounded-3xl"
                                            onClick={handleSaveProviderSettings}
                                        >
                                            Save
                                        </button>
                                    </form>
                                </Modal>
                            )}

                            <div className="pt-5">
                                <div className="flex-1 flex justify-center mb-4">

                                </div>
                            </div>
                        </div>

                        {/* end of url and cloud settings section */}
                    </div>

                    {warningMessage && (
                        <div className="text-red-500 mt-2">
                            {warningMessage}
                        </div>
                    )}


                    <button
                        className="btn btn-primary d-flex align-items-center justify-content-center px-4 py-2 rounded-3xl"
                        onClick={handleToggle}
                        style={{ display: inputAdded ? 'none' : 'inline-block' }} // Hide button if inputAdded is true
                    >
                        {/* Left arrow for Option 1 */}
                        {isOptionOne ? (
                            <i className="bi bi-arrow-left text-white"></i> // Bootstrap Left Arrow Icon
                        ) : (
                            <i className="bi bi-arrow-right text-white"></i> // Bootstrap Right Arrow Icon
                        )}
                        <span className="ms-2 text-white">
                            {isOptionOne ? "Upload and Drop" : "Cloud"}
                        </span>
                    </button>
                    <span>Click Here to Toggle Between Upload And Cloud</span>








                    <div className="pl-5 pt-20 flex items-center w-full">
                        {/* Centered Button */}
                        <div className="flex-1 flex justify-center">
                            <button
                                className="py-2 px-4 bg-customCardBlue text-white rounded-3xl"
                                onClick={openMetadataModal}
                            >
                                Click to Add Metadata
                            </button>
                        </div>


                    </div>

                    {isMetadataModalOpen && (
                        <Modal
                            isOpen={isMetadataModalOpen}
                            onRequestClose={closeMetadataModal}
                            contentLabel="Metadata Input Modal"
                            className="absolute bg-white rounded-3xl shadow-lg max-w-2xl p-6"
                            overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
                        >
                            <h2 className="text-lg font-semibold mb-4">Add Metadata</h2>
                            <form onSubmit={handleMetadataSubmit} className="grid grid-cols-2 gap-4">
                                {/* First Column */}
                                <div className="space-y-4">
                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter title"
                                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Genre</label>
                                        <select name="genre" className="border border-gray-300 rounded-lg py-2 px-4 w-full">
                                            <option value="">Select Genre</option>
                                            <option value="action">Action</option>
                                            <option value="comedy">Comedy</option>
                                            <option value="drama">Drama</option>
                                            <option value="thriller">Thriller</option>
                                        </select>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Auxillary files</label>
                                        <input
                                            type="file"
                                            name="auxiliaryFiles"
                                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Audio</label>
                                        <input
                                            type="file"
                                            name="audioFile"
                                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                                        />
                                    </div>
                                </div>

                                {/* Second Column */}
                                <div className="space-y-4">
                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Category</label>
                                        <select name="category" className="border border-gray-300 rounded-lg py-2 px-4 w-full">
                                            <option value="">Select Category</option>
                                            <option value="movie">Movie</option>
                                            <option value="series">Series</option>
                                            <option value="documentary">Documentary</option>
                                        </select>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Language</label>
                                        <select name="language" className="border border-gray-300 rounded-lg py-2 px-4 w-full">
                                            <option value="">Select Language</option>
                                            <option value="English">English</option>  {/* This value must match the backend */}
                                            <option value="Hindi">Hindi</option>    {/* This value must match the backend */}
                                            <option value="Spanish">Spanish</option>  {/* This value must match the backend */}
                                            <option value="French">French</option>
                                        </select>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block mb-2 text-gray-700">Subtitles/Closed captions</label>
                                        <input
                                            type="file"
                                            name="subtitlesCaptionsFile"
                                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                                            accept=".srt, .vtt, .ttml, .ass, .ssa, .scc, .mcc"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <button
                                        type="submit"
                                        className="mt-4 py-2 px-4 bg-customCardBlue text-white rounded-3xl"
                                    >
                                        Save Metadata
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeMetadataModal}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold ml-4 py-2 px-4 rounded-3xl"
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </Modal>
                    )}

                    {/* Example display of metadata */}
                    {metadata && Object.keys(metadata).length > 0 && (
                        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                            <h3 className="text-lg font-semibold mb-4">Metadata:</h3>

                            {/* Iterate over the metadata object to show each key and value */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(metadata).map(([key, value], index) => (
                                    <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                                        {/* If the key is being edited, display input; else display the value */}
                                        {editingKey === key ? (
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <label className="font-semibold text-gray-700">
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                                                    </label>

                                                    {/* If it's a file field, show a file input, else show a text input */}
                                                    {key === 'auxiliaryFiles' || key === 'subtitlesCaptionsFile' || key === 'audioFile' ? (
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleFileUploadMeta(e, key)} // Renamed function here
                                                            className="border border-gray-300 rounded-lg p-2 w-64"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={editedValue}
                                                            onChange={updateEditedValue} // Updated function name
                                                            className="border border-gray-300 rounded-lg p-2 w-64"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    {/* Save Button */}
                                                    <button
                                                        onClick={handleMetaSave}
                                                        className="text-green-600 hover:underline text-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    {/* Cancel Button */}
                                                    <button
                                                        onClick={handleCancel}
                                                        className="text-red-600 hover:underline text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-700">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                                </p>
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleEdit(key, value)}
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}

                                        {/* Display value if not in editing mode */}
                                        {editingKey !== key && (
                                            <pre className="text-sm text-gray-600">
                                                {Array.isArray(value)
                                                    ? value.length > 0
                                                        ? value.join(', ') // Join array elements with a comma if it's an array
                                                        : 'No items available'
                                                    : value || 'N/A'}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {submittedData && (
                        <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
                            <h3 className="font-semibold">Success!</h3>
                            <p><strong>Title:</strong> {submittedData.title || 'N/A'}</p>
                            <p><strong>Genre:</strong> {submittedData.genre || 'N/A'}</p>
                            <p><strong>Category:</strong> {submittedData.category || 'N/A'}</p>
                            <p><strong>Language:</strong> {submittedData.language || 'N/A'}</p>
                            <p><strong>Auxiliary Files:</strong></p>
                            <ul>
                                {submittedData.auxiliaryFiles && Array.isArray(submittedData.auxiliaryFiles) && submittedData.auxiliaryFiles.length > 0 ? (
                                    submittedData.auxiliaryFiles.map((file, index) => (
                                        <li key={index}>
                                            <span>{file.name}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No auxiliary files selected</li>
                                )}
                            </ul>
                            {/* Subtitles/Closed Captions - Validation and Display */}
                            <p><strong>Subtitles/Closed Captions:</strong></p>
                            {submittedData.subtitlesCaptionsFile ? validateSubtitleFile(submittedData.subtitlesCaptionsFile) : (
                                <p>No subtitles or closed captions file uploaded.</p>
                            )}

                            {/* Audio File - Validation and Display */}
                            {submittedData.audioFile ? validateAudioFile(submittedData.audioFile) : (
                                <p>No audio file uploaded.</p>
                            )}

                            {/* Display success message */}
                            {showSuccessMessage && (
                                <div className="mt-8 bg-green-100 p-4 rounded-lg">
                                    Metadata submitted successfully!
                                </div>
                            )}




                        </div>
                        // { end of drag and drop section  }
                    )}


                    <div className="flex justify-center mt-20">
                        <button
                            className={`py-2 px-4 rounded-3xl ${isLoading || disableSave ? 'bg-gray-300 cursor-not-allowed' : 'bg-customCardBlue text-white cursor-pointer'
                                }`}
                            onClick={() => {
                                if (!isLoading && !disableSave) {
                                    setSaved(false);  // Reset saved to false before calling save
                                    handleSave();
                                }
                            }}
                            disabled={isLoading || disableSave}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>

                        {saved && (
                            <div className="mt-4">
                                <h3>Successfully Saved:</h3>
                                <pre>{JSON.stringify(saved, null, 2)}</pre>
                                {successMessage && <p className="text-green-600">{successMessage}</p>}
                            </div>
                        )}

                        {errorMessage && (
                            <p className="text-red-600 mt-2">{errorMessage}</p>
                        )}

                        <button
                            className={`py-2 px-4 rounded-3xl ml-2 ${isClearing ? 'bg-gray-400 cursor-not-allowed' : 'bg-customCardBlue text-white border border-customCardBlue'}`}
                            onClick={handleClearForm}
                            disabled={isClearing}
                        >
                            Clear
                        </button>
                    </div>

                    {/* Warning Message */}
                    {warningMessage && (
                        <div className="text-red-500 mt-2">
                            {warningMessage}
                        </div>
                    )}
                </div>
            )}

            {/* Right-Aligned Button */}
            <div className="flex justify-end w-full">
                <button onClick={goToNextTab} className="py-2 px-5 bg-customCardBlue text-white rounded-3xl mr-4">
                    Next
                </button>
            </div>

        </div>
    )
};


export default SetupSourceFolder;