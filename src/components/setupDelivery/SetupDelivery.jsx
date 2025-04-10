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
    const [cloud, setCloud] = useState('');
    const [email, setEmail] = useState('');
    const [saved, setSaved] = useState(false);
    const [savedData, setSavedData] = useState(null);
    const [cloudSettingsSaved, setCloudSettingsSaved] = useState(false);



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
            setCloud('');
            setEmail('')
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

    // const handleSaveProviderSettings = async () => {
    //     try {
    //         // Assuming you are saving the provider settings somewhere
    //         const response = await handleSave(providerSettings); // Replace with actual save call

    //         if (response.success) {
    //             // If save is successful, update the state
    //             setIsCloudSettingsSaved(true);
    //             closeModal(); // Close modal after saving
    //         } else {
    //             throw new Error('Failed to save provider settings');
    //         }
    //     } catch (error) {
    //         setErrorMessage(error.message);
    //     }
    // };


    const handleSaveProviderSettings = () => {
        closeModal();
    
        setSavedData({
            provider: selectedProvider,
            settings: providerSettings,
        });
    };
    
    // Log the saved data after it has been updated
    useEffect(() => {
        console.log(savedData); // This will now log the updated state after the render
    }, [savedData]); 

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




    const handleCloudClick = () => {
        if (activeSection === 'cloud') return; // Prevent action if 'cloud' is active
        setActiveSection('cloud');  // Enable cloud section
        setSelectedSource('cloud'); // Set the selected source to 'cloud'
    };

    const handlecloudChange = (e) => {
        const cloudInput = e.target.value;
        setCloud(cloudInput);
        if (cloudInput.length > 0) {
            setInputAdded(true);  // If cloud is entered, set inputAdded to true
        }
    };
    // const handleEmailChange = (e) => {
    //     const emailInput = e.target.value;
    //     setEmail(emailInput);
    //     if (emailInput.length > 0) {
    //         setInputAdded(true);  // If cloud is entered, set inputAdded to true
    //     }
    // };

    const handleCloudSettingsSave = () => {
        setIsCloudSettingsSaved(true);
    };

    // Example function to handle email input
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFileChange = (event) => {
        const fileList = event.target.files;
        if (fileList) {
            // Convert FileList to an array (if necessary)
            const filesArray = Array.from(fileList);
            setFiles(filesArray); // Update state with the array
        }
    };

    const handleemailChange = () => {
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



    const renderSuccessMessage = () => {
        return (
            <div className="mt-4 text-green-600">
                <h3 className="font-semibold">Success!</h3>
                <p>
                    {activeSection === 'email'
                        ? `Email Submitted: ${email}`  // Display the email submitted
                        : `Cloud Service: ${cloud}`}  // Display the cloud service selected
                </p>
                {selectedProvider && <p>Provider: {selectedProvider}</p>}  {/* Display the selected provider if available */}
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


    const [isSaveDisabled, setIsSaveDisabled] = useState(false);

    useEffect(() => {
        // Initialize isSaveDisabled here if needed
        setIsSaveDisabled(false);
    }, []);

    const disableSave =
        !selectedSource ||  // No source selected
        (selectedSource === 'email' && !email) ||  // If 'email' selected but no email entered
        (selectedSource === 'cloud' && !cloud) ||  // If 'cloud' selected but no cloud entered
        (selectedSource === 'cloud' && (!providerSettings.key || !providerSettings.path || !providerSettings.region)) ||  // If cloud selected but provider settings are incomplete
        (selectedSource === 'email' && cloud) ||  // If email is selected but cloud details are filled, disable save
        (selectedSource === 'cloud' && email);  // If cloud is selected but email details are filled

    const handleSourceSelection = (source) => {
        setSelectedSources((prevSources) =>
            prevSources.includes(source)
                ? prevSources.filter((s) => s !== source) // If it's already selected, remove it
                : [...prevSources, source] // Otherwise, add the new source
        );
    };


    const handleToggle = () => {
        if (selectedSource === 'email') {
            setSelectedSource('cloud'); // Switch to cloud
            setActiveSection('cloud'); // Activate cloud section
        } else {
            setSelectedSource('email'); // Switch to email
            setActiveSection('email'); // Activate email section
        }
    };

    const isOptionOne = selectedSource === 'email';

    const getEmailClass = selectedSource === 'email' ? '' : 'bg-gray-200 cursor-not-allowed pointer-events-none h-[250px]';
    const getcloudClass = selectedSource === 'cloud' ? '' : 'bg-gray-200 cursor-not-allowed pointer-events-none';

    const buttonText = selectedSource === 'email' ? "Add Email" : "Cloud";

    const buttonIcon = selectedSource === 'email' ? (
        <i className="bi bi-arrow-left text-white"></i> // Left Arrow
    ) : (
        <i className="bi bi-arrow-right text-white"></i> // Right Arrow
    );



    const [isSaving, setIsSaving] = useState(false);

    // new code from setup source

    // email state to track the user's input
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
    const [isCloudSettingsSaved, setIsCloudSettingsSaved] = useState(false);

    const [selectedCloud, setSelectedCloud] = useState('');



    const [isSubmitting, setIsSubmitting] = useState(false)
const handleExample = async () => {
    console.log("button clicke")
}

    const handleSave = async () => {
        console.log("save settings clicked")
        console.log("Saving data:", savedData);  // Check if this contains the expected provider and settings
      
        // Ensure that the saved data exists and has the required structure
        if (!savedData || !savedData.settings) {
          setErrorMessage('No data to save');
          return;
        }
      
        try {
          setIsSubmitting(true);
      
          // Prepare cloud config objects
          const cloudConfig = {};
      
          // AWS S3 Configuration
          if (savedData.settings.key || savedData.settings.secret || savedData.settings.path || savedData.settings.region) {
            cloudConfig.awsS3Config = {
              key: savedData.settings.key || "", // Send empty string if no data
              secret: savedData.settings.secret || "",
              path: savedData.settings.path || "",
              region: savedData.settings.region || "",
            };
            console.log("AWS S3 Configuration:", cloudConfig.awsS3Config);
          }
      
          // GCP Configuration (Optional)
          if (savedData.settings.gcpKey || savedData.settings.gcpSecret || savedData.settings.gcpPath || savedData.settings.gcpRegion) {
            cloudConfig.gcpConfig = {
              key: savedData.settings.gcpKey || "",
              secret: savedData.settings.gcpSecret || "",
              path: savedData.settings.gcpPath || "",
              region: savedData.settings.gcpRegion || "",
            };
            console.log("GCP Configuration:", cloudConfig.gcpConfig);
          }
      
          // Azure Configuration (Optional)
          if (savedData.settings.azureKey || savedData.settings.azureSecret || savedData.settings.azurePath || savedData.settings.azureRegion) {
            cloudConfig.azureConfig = {
              key: savedData.settings.azureKey || "",
              secret: savedData.settings.azureSecret || "",
              path: savedData.settings.azurePath || "",
              region: savedData.settings.azureRegion || "",
            };
            console.log("Azure Configuration:", cloudConfig.azureConfig);
          }
      
          // Prepare the destination data
          const dataToSend = {
            destinationData: {
              ...cloudConfig,  // This will include awsS3Config, gcpConfig, or azureConfig as needed
              email: savedData.provider || "",  // If no email, send empty string
            },
            metadata: {},  // Optional metadata if required
          };
      
          console.log("Data to send:", JSON.stringify(dataToSend));  // Log the prepared data
      
          // Make the POST request to save the destination
          const response = await fetch('/api/destinationtype', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),  // Send the prepared data
          });
      
          // Check if the response is not OK
          if (!response.ok) {
            const errorData = await response.text();
            console.error('Error from backend:', errorData);
            throw new Error(`Error: ${errorData}`);
          }
      
          // Parse the response data
          const data = await response.json();
          console.log('Data saved successfully:', data);
      
          // Handle success message
          setSuccessMessage(`Destination saved successfully! ID: ${data.id}`);
      
          // Clear the fields after successful save
          setSavedData({ provider: '', settings: {} });
          setErrorMessage('');
      
        } catch (error) {
          // Log any error that occurs
          setErrorMessage(error.message || 'Something went wrong');
          console.error("Error:", error);
        } finally {
          // Reset the submitting state
          setIsSubmitting(false);
        }
      };
      
      
      
    
    
    const [savedEmail, setSavedEmail] = useState("");  // State to store the saved email
    const [emailError, setEmailError] = useState('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const handleSaveEmail = () => {
        if (!email) {
            setEmailError('Please enter an email.');
        } else if (!emailRegex.test(email)) {
            setEmailError('Invalid email address.');
        } else {
            setSavedEmail(email);  // Save the email
            setEmail('');  // Optionally clear the input field after saving
            setEmailError('');  // Clear any previous error
        }
    };

    const handleClearEmail = () => {
        setEmail('');  // Clear the email input field
        setEmailError('');  // Clear the email error message
        setSavedEmail('');  // Clear the saved email
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
                // { left side email section  }
                <div className={`flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4`}>
                    <h2 className="text-lg font-semibold mb-4 text-center text-customCardBlue">
                        {/* Choose Desired Destination Source */}
                    </h2>
                    <div className={` flex justify-between items-center w-full mb-4 }`}>
                        <div className={`drag-drop-section ${getEmailClass} flex-1 pr-4 m-1 w-1/2 `}>
                            <div className="pt-8 item-center">
                                <input
                                    className="border border-gray-300 rounded-lg py-2 px-4 w-full mb-4"
                                    placeholder="Add Email Here"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={selectedSource !== 'email'}  // Disabled if not in email mode
                                />

                                {/* Display error message if email is invalid */}
                                {emailError && (
                                    <div className="text-red-500 text-sm mt-2">
                                        {emailError}
                                    </div>
                                )}

                                <h2>Add Email To Receive Download Link</h2>
                                <div className="flex justify-between items-center w-full">
                                    {/* Save Button under Email Input */}
                                    <button
                                        className="py-2 px-4 bg-customCardBlue text-white rounded-3xl mt-2"
                                        onClick={handleSaveEmail}
                                        disabled={!email || emailError}  // Disable if email is empty or invalid
                                    >
                                        Save Email
                                    </button>
                                </div>

                                {/* Display the saved email */}
                                {savedEmail && (
                                    <div className="mt-4 text-green-600">
                                        <h4>Email Saved:</h4>
                                        <p>{savedEmail}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center w-full">
                                    {/* Clear Email Button */}
                                    {selectedSource === 'email' && (
                                        <button
                                            className="py-2 px-4 bg-red-500 text-white rounded-3xl mt-2"
                                            onClick={handleClearEmail}  // Clear the email and error on click
                                        >
                                            Clear Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* end of drag and drop section */}
                        <div className="flex items-center p-2 ml-30">
                            <div className="h-64 border-l-2 border-dotted border-gray-300">

                            </div>

                        </div>

                        {/* right side cloud and cloud settings */}






                        {/* <div className={`flex flex-col space-y-4 m-1 w-1/2 ${getcloudClass}`}>
                          
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
                                   
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("AWS S3")}
                                        disabled={selectedSource !== 'cloud'} // Disable if cloud is not selected
                                    >
                                        AWS S3
                                    </button>
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("GCP")}
                                        disabled={selectedSource !== 'cloud'} // Disable if cloud is not selected
                                    >
                                        GCP
                                    </button>
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("GCP")}
                                        disabled={selectedSource !== 'cloud'} // Disable if cloud is not selected
                                    >
                                        Azure
                                    </button>
                                </>
                            )}
                            <div className="flex justify-between items-center w-full">
                                
                                {selectedSource === 'cloud' && (
                                    <button
                                        className="py-2 px-4 bg-red-500 text-white rounded-3xl"
                                        onClick={handleClearCloudSettings}
                                    >
                                        Clear Settings
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
                        </div> */}



                        {/* Cloud Section */}
                        <div className={`flex flex-col space-y-4 m-1 w-1/2 ${getcloudClass}`}>
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
                                        disabled={selectedSource !== 'cloud'} // Disable if cloud is not selected
                                    >
                                        AWS S3
                                    </button>
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("GCP")}
                                        disabled={selectedSource !== 'cloud'} // Disable if cloud is not selected
                                    >
                                        GCP
                                    </button>
                                    <button
                                        className='py-2 px-4 bg-customCardBlue text-white rounded-3xl'
                                        onClick={() => handleProviderClick("Azure")}
                                        disabled={selectedSource !== 'cloud'} // Disable if cloud is not selected
                                    >
                                        Azure
                                    </button>
                                </>
                            )}
                            <div className="flex justify-between items-center w-full">
                                {/* Clear Button in cloud Section */}
                                {selectedSource === 'cloud' && (
                                    <button
                                        className="py-2 px-4 bg-red-500 text-white rounded-3xl"
                                        onClick={handleClearCloudSettings}
                                    >
                                        Clear Settings
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
                        </div>


                    </div>
                    {/* end of cloud section */}
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


                        {/* <button
                            className={`py-2 px-4 rounded-3xl ${isLoading || disableSave || !isCloudSettingsSaved ? 'bg-gray-300 cursor-not-allowed' : 'bg-customCardBlue text-white cursor-pointer'}`}
                            onClick={handleSave}
                            disabled={isLoading || disableSave || !isCloudSettingsSaved}  // Disable if loading, saving or cloud settings aren't saved
                        >
                            {isLoading ? 'Saving...' : 'Save Settings'}
                        </button> */}
                        <button
                        type="button"
                            className={`py-2 px-4 rounded-3xl bg-customCardBlue text-white cursor-pointer`}
                            onClick={handleSave}
                              // Disable if neither cloud settings nor email are provided
                        >
                            Save Settings
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
