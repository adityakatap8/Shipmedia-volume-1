import React, { useState } from 'react';
import './index.css';
import ProjectInfo from './Formcomponents/ProjectInfo.jsx';
import SubmitterInfo from './Formcomponents/SubmitterInfo.jsx';
import CreditsInfo from './Formcomponents/CreditsInfo.jsx';  // Import CreditsInfo
import SpecificationsInfo from './Formcomponents/SpecificationsInfo.jsx';
import ScreeningsInfo from './Formcomponents/ScreeningsInfo.jsx';

function ProjectsForm() {
    // State to manage the visibility of the Submitter Info section
    const [isSubmitterInfoVisible, setIsSubmitterInfoVisible] = useState(false);

    // State to hold form data
    const [formData, setFormData] = useState({
        projectInfo: {},
        submitterInfo: {},
        creditsInfo: {},
        specificationsInfo: {},
        screeningsInfo: {}
    });

    // State to manage errors
    const [errors, setErrors] = useState({
        projectInfoErrors: {},
        submitterInfoErrors: {},
        creditsInfoErrors: {},
        specificationsInfoErrors: {},
        screeningsInfoErrors: {}
    });

    // Handle changes to the form data
    const handleInputChange = (section, data) => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: { ...prevData[section], ...data }
        }));
    };

    // Function to validate the form
    const validateForm = () => {
        let isValid = true;
        let tempErrors = {
            projectInfoErrors: {},
            submitterInfoErrors: {},
            creditsInfoErrors: {},
            specificationsInfoErrors: {},
            screeningsInfoErrors: {}
        };

        // Validate projectTitle, no projectType validation anymore
        if (!formData.projectInfo.projectTitle) {
            isValid = false;
            tempErrors.projectInfoErrors.projectTitle = 'Project title is required.';
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            alert('Please fix the errors before submitting.');
            return;
        }

        console.log('Form data being sent to the server:', formData);

        try {
            const response = await fetch('http://localhost:3000/api/projectForm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Project saved successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                alert('Failed to save project.');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project: ' + error.message);
        }
    };

    const handleFormDataUpdate = (updatedData) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            specificationsInfo: {
                ...prevFormData.specificationsInfo,
                projectType: updatedData.projectType,
                runtime: updatedData.runtime,
                completionDate: updatedData.completionDate,
                countryOfOrigin: updatedData.countryOfOrigin,
                countryOfFilming: updatedData.countryOfFilming,
                language: updatedData.language,
                shootingFormat: updatedData.shootingFormat,
                aspectRatio: updatedData.aspectRatio,
                filmColor: updatedData.filmColor,
                studentProject: updatedData.studentProject,
                isFirstTimeFilmmaker: updatedData.isFirstTimeFilmmaker
            }
        }));
    };

  

    // Handle setting errors for a section (ProjectInfo or ScreeningsInfo)
    const setScreeningErrors = (errors) => {
        setErrors((prev) => ({
            ...prev,
            screeningsInfoErrors: errors
        }));
    };



    return (
        <form className="container-fluid projects-form-container">
            <div>
                {/* Project Information Section */}
                <ProjectInfo
                    onInputChange={(data) => handleInputChange('projectInfo', data)}
                    projectInfo={formData.projectInfo}
                    errors={errors.projectInfoErrors}
                    setProjectInfoErrors={(errors) => setErrors((prev) => ({
                        ...prev,
                        projectInfoErrors: errors
                    }))}
                />

                {/* Submitter Information Section */}
                <SubmitterInfo
                    onSubmitterInfoChange={(data) => handleInputChange('submitterInfo', data)} // Pass the handler
                    formData={formData.submitterInfo} // Pass the form data
                    formErrors={errors.submitterInfoErrors} // Pass the errors
                    setSubmitterInfoErrors={(errors) => setErrors((prev) => ({
                        ...prev,
                        submitterInfoErrors: errors
                    }))} // Pass the error setter
                    setIsSubmitterInfoVisible={setIsSubmitterInfoVisible}
                    isSubmitterInfoVisible={isSubmitterInfoVisible}
                />

                {/* Credits Information Section */}
                <CreditsInfo
                    onInputChange={(data) => handleInputChange('creditsInfo', data)} // Pass the handler
                    creditsInfo={formData.creditsInfo} // Pass the form data as an array
                    errors={errors.creditsInfoErrors} // Pass the errors
                    setCreditsInfoErrors={(errors) => setErrors((prev) => ({
                        ...prev,
                        creditsInfoErrors: errors
                    }))} // Pass the error setter
                />

                {/* Specifications Information Section */}
                <SpecificationsInfo
                    onInputChange={handleFormDataUpdate}
                    formData={formData.specificationsInfo}
                    projectInfo={formData.projectInfo}
                    errors={errors.specificationsInfoErrors}
                    setSpecsErrors={(errors) => setErrors((prev) => ({
                        ...prev,
                        specificationsInfoErrors: errors
                    }))}
                />

                {/* Screenings and Distribution Section */}
                <ScreeningsInfo
                    onInputChange={(data) => handleInputChange('screenings', data)}  // Handle screenings data
                    screenings={formData.screenings}
                    errors={errors.screeningsInfoErrors} // Errors for screenings
                    setScreeningErrors={setScreeningErrors} // Set errors for screenings
                />
            </div>

            {/* Save Project Button */}
            <button type="submit" className="save-button" onClick={handleSubmit}>
                Save Project
            </button>

            <button onclick="window.location.href='http://localhost:8334';">Open File Manager</button>
            <a href="http://localhost:8334" target="_blank">Open Filestash</a>

        </form>
    );
}

export default ProjectsForm;
