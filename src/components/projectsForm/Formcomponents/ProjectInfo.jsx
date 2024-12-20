import React, { useEffect } from 'react';
import './index.css';

const ProjectInfo = ({ onInputChange, projectInfo, errors, setProjectInfoErrors }) => {
  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
    if (!email) {
      return 'Email is required';
    } else if (!emailRegex.test(email)) {
      return 'Invalid email address format.';
    }
    return null;
  };

  // Website URL validation function
  const validateWebsite = (url) => {
    const urlRegex = /^(https?:\/\/)?(www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6})?$/;
    if (!url) {
      return 'Website URL is required';
    } else if (!urlRegex.test(url)) {
      return 'Please enter a valid URL (e.g., www.example.com)';
    }
    return null;
  };

  // Validate project information (called on blur)
  const validateProjectInfo = () => {
    const errors = {};
    if (!projectInfo.projectTitle) {
      errors.projectTitle = 'Project title is required';
    }
    if (!projectInfo.briefSynopsis) {
      errors.briefSynopsis = 'Brief synopsis is required';
    }

    const emailError = validateEmail(projectInfo.email);
    if (emailError) {
      errors.email = emailError;
    }

    const websiteError = validateWebsite(projectInfo.website);
    if (websiteError) {
      errors.website = websiteError;
    }

    setProjectInfoErrors(errors); // Pass validation errors back to parent
  };

  useEffect(() => {
    // Trigger validation whenever the projectInfo state changes
    validateProjectInfo();
  }, [projectInfo]); // Only trigger when projectInfo changes

  return (
    <div className="section-One text-left">
      <h1 className="header-numbered">
        <span>1</span> Project Information
      </h1>

      {/* Project Title */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Project Title <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.projectTitle || ''}
              name="projectTitle"
              onChange={handleChange}
              onBlur={validateProjectInfo}
            />
            {errors?.projectTitle && <span className="error">{errors.projectTitle}</span>}
          </div>
        </div>
      </div>

      {/* Brief Synopsis */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Brief Synopsis <span className="spanClass">(English)</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <textarea
              name="briefSynopsis"
              value={projectInfo.briefSynopsis || ''}
              onChange={handleChange}
              placeholder="Enter Project Synopsis"
              rows="4"
            ></textarea>
            {errors?.briefSynopsis && <span className="error">{errors.briefSynopsis}</span>}
          </div>
        </div>
      </div>

      {/* Website URL Field with Validation */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          Website <span className="required">*</span>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.website || ''}
              name="website"
              onChange={handleChange}
              placeholder="Enter Website URL"
              onBlur={validateWebsite}
            />
            {errors?.website && <span className="error">{errors.website}</span>}
          </div>
        </div>
      </div>

      {/* Social Media Fields */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Twitter</div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.twitter || ''}
              name="twitter"
              onChange={handleChange}
              placeholder="Enter Twitter Handle"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Facebook</div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.facebook || ''}
              name="facebook"
              onChange={handleChange}
              placeholder="Enter Facebook URL"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">Instagram</div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="text"
              value={projectInfo.instagram || ''}
              name="instagram"
              onChange={handleChange}
              placeholder="Enter Instagram Handle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
