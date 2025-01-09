import React, { useState } from 'react';
import './index.css';
import ProjectInfo from './Formcomponents/ProjectInfo.jsx';
import SubmitterInfo from './Formcomponents/SubmitterInfo.jsx';
import CreditsInfo from './Formcomponents/CreditsInfo.jsx';
import SpecificationsInfo from './Formcomponents/SpecificationsInfo.jsx';
import ScreeningsInfo from './Formcomponents/ScreeningsInfo.jsx';

function ProjectsForm() {
    const [formData, setFormData] = useState({
        projectInfo: {},
        submitterInfo: {},
        creditsInfo: {},
        specificationsInfo: {},
        screeningsInfo: {
            screenings: [],
            distributors: [],
        },
    });

    const [errors, setErrors] = useState({
        projectInfoErrors: {},
        submitterInfoErrors: {},
        creditsInfoErrors: {},
        specificationsInfoErrors: {},
        screeningsErrors: {},
    });

    // Visibility toggle for Submitter Info
    const [isSubmitterInfoVisible, setIsSubmitterInfoVisible] = useState(false);

    const handleInputChange = (section, data) => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: { ...prevData[section], ...data },
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const tempErrors = {
            projectInfoErrors: {},
            submitterInfoErrors: {},
            creditsInfoErrors: {},
            specificationsInfoErrors: {},
            screeningsErrors: {},
        };

        if (!formData.projectInfo.projectTitle) {
            isValid = false;
            tempErrors.projectInfoErrors.projectTitle = 'Project title is required.';
        }

        if (formData.screeningsInfo.screenings.length === 0) {
            isValid = false;
            tempErrors.screeningsErrors.screenings = 'At least one screening is required.';
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

    return (
        <form className="container-fluid projects-form-container">
            <div>
                <ProjectInfo
                    onInputChange={(data) => handleInputChange('projectInfo', data)}
                    projectInfo={formData.projectInfo}
                    errors={errors.projectInfoErrors}
                    setProjectInfoErrors={(errors) =>
                        setErrors((prev) => ({
                            ...prev,
                            projectInfoErrors: errors,
                        }))
                    }
                />

                <SubmitterInfo
                    onSubmitterInfoChange={(data) => handleInputChange('submitterInfo', data)}
                    formData={formData.submitterInfo}
                    formErrors={errors.submitterInfoErrors}
                    setSubmitterInfoErrors={(errors) =>
                        setErrors((prev) => ({
                            ...prev,
                            submitterInfoErrors: errors,
                        }))
                    }
                    setIsSubmitterInfoVisible={setIsSubmitterInfoVisible}
                    isSubmitterInfoVisible={isSubmitterInfoVisible}
                />

                <CreditsInfo
                    onInputChange={(data) => handleInputChange('creditsInfo', data)}
                    creditsInfo={formData.creditsInfo}
                    errors={errors.creditsInfoErrors}
                    setCreditsInfoErrors={(errors) =>
                        setErrors((prev) => ({
                            ...prev,
                            creditsInfoErrors: errors,
                        }))
                    }
                />

                <SpecificationsInfo
                    onInputChange={(data) => handleInputChange('specificationsInfo', data)}
                    formData={formData.specificationsInfo}
                    errors={errors.specificationsInfoErrors}
                    setSpecsErrors={(errors) =>
                        setErrors((prev) => ({
                            ...prev,
                            specificationsInfoErrors: errors,
                        }))
                    }
                />

                <ScreeningsInfo
                    onInputChange={(data) => handleInputChange('screeningsInfo', data)}
                    screeningsInfo={formData.screeningsInfo}
                    errors={errors.screeningsErrors}
                    setScreeningErrors={(errors) =>
                        setErrors((prev) => ({
                            ...prev,
                            screeningsErrors: errors,
                        }))
                    }
                />
            </div>

            <button type="submit" className="save-button" onClick={handleSubmit}>
                Save Project  
            </button>
        </form>
    );
}

export default ProjectsForm;
