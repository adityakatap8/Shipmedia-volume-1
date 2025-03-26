import React, { useState } from 'react';

const CreditsInfo = ({ onInputChange }) => {
    // Separate state for directors, writers, producers, and actors
    const [credits, setCredits] = useState({
        directors: [{ firstName: '', middleName: '', lastName: '', priorCredits: '' }],
        writers: [{ firstName: '', middleName: '', lastName: '', priorCredits: '' }],
        producers: [{ firstName: '', middleName: '', lastName: '', priorCredits: '' }],
        actors: [{ firstName: '', middleName: '', lastName: '', priorCredits: '' }],
    });

    // Add new credit for a specific category (directors, writers, producers, actors)
    const addPerson = (category, e) => {
        e.preventDefault();
        setCredits((prevCredits) => {
            const newCredits = {
                ...prevCredits,
                [category]: [
                    ...prevCredits[category],
                    { firstName: '', middleName: '', lastName: '', priorCredits: '' },
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

    return (
        <div className="section-three text-left pt-16 pb-8">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>4</span> Credits
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
                        <input
                            type="text"
                            placeholder="First Name"
                            value={credit.firstName}
                            onChange={(e) =>
                                handleChange('actors', index, 'firstName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            value={credit.middleName}
                            onChange={(e) =>
                                handleChange('actors', index, 'middleName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={credit.lastName}
                            onChange={(e) =>
                                handleChange('actors', index, 'lastName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Prior Credits (Optional)"
                            value={credit.priorCredits}
                            onChange={(e) =>
                                handleChange('actors', index, 'priorCredits', e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={(e) => addPerson('actors', e)}
                className="add-person-button mb-4"
                type="button"
            >
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
                        <input
                            type="text"
                            placeholder="First Name"
                            value={credit.firstName}
                            onChange={(e) =>
                                handleChange('directors', index, 'firstName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            value={credit.middleName}
                            onChange={(e) =>
                                handleChange('directors', index, 'middleName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={credit.lastName}
                            onChange={(e) =>
                                handleChange('directors', index, 'lastName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Prior Credits (Optional)"
                            value={credit.priorCredits}
                            onChange={(e) =>
                                handleChange('directors', index, 'priorCredits', e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={(e) => addPerson('directors', e)}
                className="add-person-button mb-4"
                type="button"
            >
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
                        <input
                            type="text"
                            placeholder="First Name"
                            value={credit.firstName}
                            onChange={(e) =>
                                handleChange('writers', index, 'firstName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            value={credit.middleName}
                            onChange={(e) =>
                                handleChange('writers', index, 'middleName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={credit.lastName}
                            onChange={(e) =>
                                handleChange('writers', index, 'lastName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Prior Credits (Optional)"
                            value={credit.priorCredits}
                            onChange={(e) =>
                                handleChange('writers', index, 'priorCredits', e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={(e) => addPerson('writers', e)}
                className="add-person-button mb-4"
                type="button"
            >
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
                        <input
                            type="text"
                            placeholder="First Name"
                            value={credit.firstName}
                            onChange={(e) =>
                                handleChange('producers', index, 'firstName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            value={credit.middleName}
                            onChange={(e) =>
                                handleChange('producers', index, 'middleName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={credit.lastName}
                            onChange={(e) =>
                                handleChange('producers', index, 'lastName', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Prior Credits (Optional)"
                            value={credit.priorCredits}
                            onChange={(e) =>
                                handleChange('producers', index, 'priorCredits', e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={(e) => addPerson('producers', e)}
                className="add-person-button"
                type="button"
            >
                + Add Producer
            </button>
        </div>
    );
};

export default CreditsInfo;
