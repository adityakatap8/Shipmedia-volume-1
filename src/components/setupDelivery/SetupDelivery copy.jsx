















import React, { useState, useEffect } from "react";
import Modal from "react-modal";

// For the modal to be rendered correctly, attach it to the root of your app
Modal.setAppElement("#root");

const SetupDelivery = ({ goToPreviousTab }) => {
    // new code from setup source

    const [selectedProvider, setSelectedProvider] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
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



    const handleProviderClick = (provider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

    const handleClearCloudSettings = () => {

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
    const handleClearUrl = () => {
        setUrl('');  // Clear the URL input
    }

    const [isSaveDisabled, setIsSaveDisabled] = useState(false);

    useEffect(() => {
        // Initialize isSaveDisabled here if needed
        setIsSaveDisabled(false);
    }, []);

    const disableSave =
    !selectedSource ||  // No source selected
    (selectedSource === 'dragDrop' && files.length === 0) ||  // If 'dragDrop' selected but no file uploaded
    (selectedSource === 'url' && !url) ||  // If 'url' selected but no URL entered
    (selectedSource === 'url' && (!providerSettings.key || !providerSettings.path || !providerSettings.region));  // If URL selected but provider settings are incomplete


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

    const getDragDropClass = selectedSource === 'dragDrop' ? '' : 'bg-gray-200 cursor-not-allowed pointer-events-none h-[250px]';
    const getUrlClass = selectedSource === 'url' ? '' : 'bg-gray-200 cursor-not-allowed pointer-events-none';

    const buttonText = selectedSource === 'dragDrop' ? "Upload and Drop" : "Cloud";

    const buttonIcon = selectedSource === 'dragDrop' ? (
        <i className="bi bi-arrow-left text-white"></i> // Left Arrow
    ) : (
        <i className="bi bi-arrow-right text-white"></i> // Right Arrow
    );



    const [isSaving, setIsSaving] = useState(false);

    // new code from setup source

    const [email, setEmail] = useState(""); // email state to track the user's input
    const [awsS3Key, setAwsS3Key] = useState(""); // AWS S3 key state
    const [awsS3Secret, setAwsS3Secret] = useState(""); // AWS S3 secret state
    const [awsS3Path, setAwsS3Path] = useState(""); // AWS S3 path state
    const [awsS3Region, setAwsS3Region] = useState(""); // AWS S3 region state

    const [isSetupComplete, setIsSetupComplete] = useState(false); // track if the setup is complete
    const [isSaveSuccessful, setIsSaveSuccessful] = useState(false); // track if save was successful






    const getButtonClass = (provider) => {
        return `py-2 px-4 m-5 rounded-full border-2 ${selectedProvider === provider
            ? "bg-customCardBlue text-white"
            : "bg-white text-black border-gray-300"
            } focus:outline-none focus:ring focus:border-blue-300`;
    };


    const [isSectionEnabled, setIsSectionEnabled] = useState(false); // Track the section visibility state

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


            console.log('Sending request body:', JSON.stringify({
                sourceTypeData,  // Include sourceTypeData at the root level

            }, null, 2));

            // Send the data to the API
            const response = await fetch(`/api/destinationtype/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                body: JSON.stringify({
                    sourceTypeData,  // Send `sourceTypeData` as root-level object
                      // Send `metadata` as a separate root-level field
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

    



    return (
        <div>

            {saved ? (
                <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
                    <h3 className="font-semibold">Success!</h3>


                    {/* Display the selected provider if it exists */}
                    {selectedProvider && <p>Provider: {selectedProvider}</p>}

                </div>
            ) : (
                // { left side with drag and drop section  }
                <div className={`flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4`}>
                    <h2 className="text-lg font-semibold mb-4 text-center text-customCardBlue">
                        {/* Choose Desired Destination Source */}
                    </h2>
                    <div className={` flex justify-between items-center w-full mb-4 }`}>
                        <div className={`drag-drop-section ${getDragDropClass} flex-1 pr-4 m-1 w-1/2 `}>
                            <div className="pt-8 item-center">   <input
                                className="border border-gray-300 rounded-lg py-2 px-4 w-full mb-4"
                                placeholder="Add URL Here"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}

                                // disabled={selectedSource !== 'url'} // Disable if dragDrop is selected
                                disabled={selectedSources.includes('dragDrop')}
                            />
                                <h2>Add Email To Receive Download Link</h2></div>

                            <div className="flex justify-between items-center w-full">
                                {/* Clear Button in URL Section */}
                                {selectedSource === 'dragDrop' && (
                                    <button
                                        className="py-2 px-4 bg-red-500 text-white rounded-3xl"
                                        onClick={handleClearUrl}
                                    >
                                        Clear URL
                                    </button>
                                )}
                            </div>


                        </div>
                        {/* end of drag and drop section */}
                        <div className="flex items-center p-2 ml-30">
                            <div className="h-64 border-l-2 border-dotted border-gray-300">

                            </div>

                        </div>

                        {/* right side url and cloud settings */}

                        <div className={`flex flex-col space-y-4 m-1 w-1/2 ${getUrlClass}`}>
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
                                        onClick={handleClearCloudSettings}
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
                            {isOptionOne ? "Email" : "Cloud"}
                        </span>
                    </button>
                    <span>Click Here to Toggle Between Email And Cloud</span>

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

            <div className="d-flex">
                <button
                    onClick={goToPreviousTab}
                    className="py-2 px-5 bg-gray-400 text-white rounded-3xl mr-4"
                >
                    Back
                </button>

                <button className="py-2 px-4 text-customCardBlue bg-white font-bold border-gray-300 rounded-full border-2 ml-5">
                    Save
                </button>
                <button className="py-2 px-4 text-customCardBlue bg-white font-bold border-gray-300 rounded-full border-2 ml-5">
                    Schedule Order
                </button>
                <a
                    href="/listing-table"
                    className="py-2 px-4 text-customOrange bg-white font-bold border-gray-300 rounded-full border-2 ml-5 inline-block text-center"
                >
                    Execute
                </a>
            </div>
        </div>


    )
}


export default SetupDelivery;



