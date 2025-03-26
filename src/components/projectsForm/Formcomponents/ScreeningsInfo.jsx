import React, { useState, useEffect } from 'react';
import "./index.css";

const ScreeningsInfo = ({ onInputChange, errors, setScreeningErrors }) => {
    const [screenings, setScreenings] = useState([{ filmFestival: '' }]);
    const [distributors, setDistributors] = useState([{ distributor: '' }]);

    useEffect(() => {
        // Notify parent whenever screenings or distributors change
        onInputChange({ screenings, distributors });
    }, [screenings, distributors, onInputChange]);

    const handleScreeningInput = (index, value) => {
        // Update the screenings array with the new value and send it to the parent component
        const updatedScreenings = screenings.map((screening, i) =>
            i === index ? { ...screening, filmFestival: value } : screening
        );
        setScreenings(updatedScreenings); // Update the local state
    };

    const handleDistributorInput = (index, value) => {
        const updatedDistributors = distributors.map((distributor, i) =>
            i === index ? { ...distributor, distributor: value } : distributor
        );
        setDistributors(updatedDistributors); // Update the local state
    };

    const removeScreening = (index) => {
        setScreenings(screenings.filter((_, i) => i !== index));
    };

    const removeDistributor = (index) => {
        setDistributors(distributors.filter((_, i) => i !== index));
    };

    const addScreening = () => {
        setScreenings([...screenings, { filmFestival: '' }]);
    };

    const addDistributor = () => {
        setDistributors([...distributors, { distributor: '' }]);
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('draggedIndex', index);
    };

    const handleDrop = (e, index, arrayType) => {
        const draggedIndex = e.dataTransfer.getData('draggedIndex');
        const updatedArray = arrayType === 'screenings' ? [...screenings] : [...distributors];
        const [draggedItem] = updatedArray.splice(draggedIndex, 1);
        updatedArray.splice(index, 0, draggedItem);
        if (arrayType === 'screenings') {
            setScreenings(updatedArray);
        } else {
            setDistributors(updatedArray);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="section-two text-left pt-16 pb-8">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>5</span>
                        Screenings / Distribution
                    </h1>
                </div>
            </div>

            {/* Screenings Section */}
            <div className="form-section section-One text-left">
                <label className="form-label grid-3 span-12-phone custom-form-label">Screenings & Awards</label>
                <div className='form-field radio-buttons span-4 span-8-tablet span-12-phone'>
                    {screenings.map((screening, index) => (
                        <div
                            key={index}
                            className="screening-box"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index, 'screenings')}
                            onDragOver={handleDragOver}
                        >
                            <div className="title-bar">
                                <span>Event</span>
                                <span>Actions</span>
                            </div>
                            <div className='d-flex screening-field'>
                                <div className="input-fields">
                                    <input
                                        type="text"
                                        placeholder="Film Festival"
                                        value={screening.filmFestival}
                                        onChange={(e) => handleScreeningInput(index, e.target.value)}
                                    />
                                </div>
                                <div className="actions">
                                    <div onClick={() => removeScreening(index)} className="action-item">
                                        <i className="fas fa-trash-alt"></i>
                                    </div>

                                    <div className="action-item">
                                        <i className="fas fa-arrows-alt"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div onClick={addScreening} className="add-screening-button mb-4">
                        + Add a Screening
                    </div>
                </div>
            </div>

            {/* Distributors Section */}
            <div className="form-section section-One text-left">
                <label className="form-label grid-3 span-12-phone custom-form-label">Distribution Information</label>
                <div className='form-field radio-buttons span-4 span-8-tablet span-12-phone'>
                    {distributors.map((distributor, index) => (
                        <div
                            key={index}
                            className="screening-box"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index, 'distributors')}
                            onDragOver={handleDragOver}
                        >
                            <div className="title-bar">
                                <span>Distributor / Sales Agent</span>
                                <span>Actions</span>
                            </div>
                            <div className='d-flex screening-field'>
                                <div className="input-fields">
                                    <input
                                        type="text"
                                        placeholder="Distributor / Sales Agent"
                                        value={distributor.distributor}
                                        onChange={(e) => handleDistributorInput(index, e.target.value)}
                                    />
                                </div>
                                <div className="actions">
                                    <div onClick={() => removeDistributor(index)} className="action-item">
                                        <i className="fas fa-trash-alt"></i>
                                    </div>

                                    <div className="action-item">
                                        <i className="fas fa-arrows-alt"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div onClick={addDistributor} className="add-screening-button mb-4">
                        + Add Distributor / Sales Agent
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreeningsInfo;
