import React, { useState } from 'react';

const CreditsInfo = ({ onInputChange }) => {
    const [credits, setCredits] = useState({
        directors: [{ firstName: '', middleName: '', lastName: '', priorCredits: '', image: null }],
        writers: [{ firstName: '', middleName: '', lastName: '', priorCredits: '', image: null }],
        producers: [{ firstName: '', middleName: '', lastName: '', priorCredits: '', image: null }],
        actors: [{ firstName: '', middleName: '', lastName: '', priorCredits: '', image: null }],
    });

    // Add new credit for a specific category (directors, writers, producers, actors)
    const addPerson = (category, e) => {
        e.preventDefault();
        setCredits((prevCredits) => {
            const newCredits = {
                ...prevCredits,
                [category]: [
                    ...prevCredits[category],
                    { firstName: '', middleName: '', lastName: '', priorCredits: '', image: null },
                ],
            };
            onInputChange(newCredits); // Share updated credits with parent
            return newCredits;
        });
    };

    // Remove credit for a specific category
    const removePerson = (category, index) => {
        setCredits((prevCredits) => {
            const newCredits = {
                ...prevCredits,
                [category]: prevCredits[category].filter((_, i) => i !== index),
            };
            onInputChange(newCredits); // Share updated credits with parent
            return newCredits;
        });
    };

    // Handle input changes for a specific category and index
    const handleChange = (category, index, field, value) => {
        setCredits((prevCredits) => {
            const newCredits = {
                ...prevCredits,
                [category]: prevCredits[category].map((credit, i) =>
                    i === index ? { ...credit, [field]: value } : credit
                ),
            };
            onInputChange(newCredits); // Share updated credits with parent
            return newCredits;
        });
    };

    // Handle image upload for a specific category and index
    const handleImageChange = (category, index, file) => {
        setCredits((prevCredits) => {
            const newCredits = {
                ...prevCredits,
                [category]: prevCredits[category].map((credit, i) =>
                    i === index ? { ...credit, image: file } : credit
                ),
            };
            onInputChange(newCredits); // Share updated credits with parent
            return newCredits;
        });
    };

    // Remove image for a specific category and index
    const handleImageRemove = (category, index) => {
        setCredits((prevCredits) => {
            const newCredits = {
                ...prevCredits,
                [category]: prevCredits[category].map((credit, i) =>
                    i === index ? { ...credit, image: null } : credit
                ),
            };
            onInputChange(newCredits); // Share updated credits with parent
            return newCredits;
        });
    };

    // Generate input fields for each category (actors, directors, writers, producers)
    const generateCreditFields = (category, index) => {
        return (
            <>
                <input
                    type="text"
                    placeholder="First Name"
                    value={credits[category][index].firstName}
                    onChange={(e) => handleChange(category, index, 'firstName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Middle Name"
                    value={credits[category][index].middleName}
                    onChange={(e) => handleChange(category, index, 'middleName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={credits[category][index].lastName}
                    onChange={(e) => handleChange(category, index, 'lastName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Prior Credits (Optional)"
                    value={credits[category][index].priorCredits}
                    onChange={(e) => handleChange(category, index, 'priorCredits', e.target.value)}
                />

                {/* Conditionally render the file input and remove button */}
                {!credits[category][index].image ? (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(category, index, e.target.files[0])}
                        />
                    </div>
                ) : (
                    <div>
                        <p>Image Uploaded:</p>
                        <img
                            src={URL.createObjectURL(credits[category][index].image)}
                            alt={`${category} Uploaded`}
                            className="uploaded-image-preview"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                        <button
                            onClick={() => handleImageRemove(category, index)}
                            style={{
                                display: 'block',
                                marginTop: '10px',
                                background: 'red',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '4px',
                            }}
                        >
                            Remove Image
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="section-three text-left pt-16 pb-8">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>5</span> Credits
                    </h1>
                </div>
            </div>

            {/* Actor Section */}
            {credits.actors.map((credit, index) => (
                <div key={`actor-${index}`} className="credit-box">
                    <div className="title-bar">
                        <span>Actor</span>
                        <button onClick={() => removePerson('actors', index)}>&times;</button>
                    </div>
                    <div className="input-fields">
                        {generateCreditFields('actors', index)}
                    </div>
                </div>
            ))}
            <button onClick={(e) => addPerson('actors', e)} className="add-person-button mb-4" type="button">
                + Add Actor
            </button>

            {/* Director Section */}
            {credits.directors.map((credit, index) => (
                <div key={`director-${index}`} className="credit-box">
                    <div className="title-bar">
                        <span>Director</span>
                        <button onClick={() => removePerson('directors', index)}>&times;</button>
                    </div>
                    <div className="input-fields">
                        {generateCreditFields('directors', index)}
                    </div>
                </div>
            ))}
            <button onClick={(e) => addPerson('directors', e)} className="add-person-button mb-4" type="button">
                + Add Director
            </button>

            {/* Writer Section */}
            {credits.writers.map((credit, index) => (
                <div key={`writer-${index}`} className="credit-box">
                    <div className="title-bar">
                        <span>Writer</span>
                        <button onClick={() => removePerson('writers', index)}>&times;</button>
                    </div>
                    <div className="input-fields">
                        {generateCreditFields('writers', index)}
                    </div>
                </div>
            ))}
            <button onClick={(e) => addPerson('writers', e)} className="add-person-button mb-4" type="button">
                + Add Writer
            </button>

            {/* Producer Section */}
            {credits.producers.map((credit, index) => (
                <div key={`producer-${index}`} className="credit-box">
                    <div className="title-bar">
                        <span>Producer</span>
                        <button onClick={() => removePerson('producers', index)}>&times;</button>
                    </div>
                    <div className="input-fields">
                        {generateCreditFields('producers', index)}
                    </div>
                </div>
            ))}
            <button onClick={(e) => addPerson('producers', e)} className="add-person-button" type="button">
                + Add Producer
            </button>
        </div>
    );
};

export default CreditsInfo;
