import React, { useState, useEffect } from 'react';

const CreditsInfo = ({ onInputChange, creditsInfo, errors, setCreditsInfoErrors }) => {
    const [credits, setCredits] = useState(Array.isArray(creditsInfo) ? creditsInfo : [{ firstName: '', middleName: '', lastName: '', priorCredits: '' }]);

    useEffect(() => {
        // Update the credits state whenever creditsInfo prop changes in the parent
        if (Array.isArray(creditsInfo)) {
            setCredits(creditsInfo);
        }
    }, [creditsInfo]);

    // Function to add a new person (credit)
    const addPerson = (e) => {
        e.preventDefault();
        const newCredits = [...credits, { firstName: '', middleName: '', lastName: '', priorCredits: '' }];
        setCredits(newCredits);
        onInputChange(newCredits); // Pass the updated credits to the parent
    };

    // Function to remove a person (credit)
    const removePerson = (index) => {
        const newCredits = credits.filter((_, i) => i !== index);
        setCredits(newCredits);
        onInputChange(newCredits); // Pass the updated credits to the parent
    };

    // Handle input changes
    const handleInputChange = (index, field, value) => {
        const updatedCredits = credits.map((credit, i) =>
            i === index ? { ...credit, [field]: value } : credit
        );
        setCredits(updatedCredits);
        onInputChange(updatedCredits); // Pass the updated credits to the parent
    };

    return (
        <div className="section-three text-left pt-16 pb-8">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>3</span> Credits
                    </h1>
                </div>
            </div>
            {/* Render Credits */}
            {credits.map((credit, index) => (
                <div key={index} className="credit-box">
                    <div className="title-bar">
                        <span>Director</span>
                        <button onClick={() => removePerson(index)}>&times;</button>
                    </div>
                    <div className="input-fields">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={credit.firstName}
                            onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            value={credit.middleName}
                            onChange={(e) => handleInputChange(index, 'middleName', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={credit.lastName}
                            onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Prior Credits (Optional)"
                            value={credit.priorCredits}
                            onChange={(e) => handleInputChange(index, 'priorCredits', e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <button onClick={addPerson} className="add-person-button mb-4">
                + Add Person
            </button>
        </div>
    );
};

export default CreditsInfo;
