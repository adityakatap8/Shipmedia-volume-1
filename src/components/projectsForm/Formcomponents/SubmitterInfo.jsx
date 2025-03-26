import React, { useState, useEffect } from 'react';
import { countries } from './countries';  // Import the countries
import './index.css';

function SubmitterInfo({
    onSubmitterInfoChange,
    formData,
    formErrors,
    setSubmitterInfoErrors,
}) {
    const [localFormData, setLocalFormData] = useState(formData);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...localFormData, [name]: value };
        setLocalFormData(updatedData);
        onSubmitterInfoChange(updatedData); // Pass updated data to parent
    };

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
        if (!email) {
            setSubmitterInfoErrors((prev) => ({
                ...prev,
                email: 'Email is required.',
            }));
        } else if (!emailRegex.test(email)) {
            setSubmitterInfoErrors((prev) => ({
                ...prev,
                email: 'Invalid email address format. It should contain "@" and end with .com or .in',
            }));
        } else {
            setSubmitterInfoErrors((prev) => ({
                ...prev,
                email: '',
            }));
        }
    };

    // Update form errors when the email is changed
    useEffect(() => {
        if (localFormData.email) {
            validateEmail(localFormData.email);
        }
    }, [localFormData.email]);

    return (
        <div className="section-two text-left pt-16 pb-8">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>3</span>
                        Submitter Information
                    </h1>
                </div>
            </div>

            {/* Submitter Information Section */}
            <div className="submitter-info-section">
                {/* Email Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">
                        Email <span className="required">*</span>
                    </div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone border-gray ">
                        <input
                            type="email"
                            name="email"
                            value={localFormData.email || ''}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                            style={{ border: 'none', outline: 'none' }}
                        />
                        {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                    </div>
                </div>

                {/* Phone Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">Phone</div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Country Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">
                        Country <span className="required">*</span>
                    </div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <select
                            className="custom-input border-gray"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Address Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">Address</div>
                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* City Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">City</div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* State Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">State</div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Postal Code Field */}
                <div className="form-section">
                    <div className="form-label grid-3 span-12-phone">Postal Code</div>
                    <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Gender Field */}
                <div className="form-section gender-custom-form pt-8">
                    <div className="form-label grid-3 span-12-phone custom-form-label">Gender</div>
                    <div className="form-field radio-buttons span-2 span-8-tablet span-12-phone custom-form-field">
                        <select
                            className="custom-input border-gray"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmitterInfo;
