import React, { useState } from 'react';

function SrtFileUpload({ onSrtFileUpload, onInfoDocsUpload }) {
    const [srtFile, setSrtFile] = useState(null);
    const [infoDocs, setInfoDocs] = useState(null);

    // Handle SRT file change
    const handleSrtFileChange = (event) => {
        const file = event.target.files[0];
        setSrtFile(file);

        // Trigger the callback function to pass the file name back to the parent
        if (onSrtFileUpload && file) {
            onSrtFileUpload(file.name);  // Pass the file name to the parent component
        }
    };

    // Handle Information Documents upload
    const handleInfoDocsChange = (event) => {
        const files = event.target.files;
        setInfoDocs(files);

        // Trigger the callback function to pass the info docs file names back to the parent
        if (onInfoDocsUpload && files.length > 0) {
            const fileNames = Array.from(files).map(file => file.name);
            onInfoDocsUpload(fileNames);  // Pass the array of file names to the parent component
        }
    };

    return (
        <div className="pt-10">
            <div className="row submitter-row">
                <div className="submitter-container">
                    <h1 className="header-numbered">
                        <span>2</span>
                        File Upload
                    </h1>
                </div>
            </div>

            {/* File Upload Section */}
            <div className="form-section">
                <div className="form-label grid-3 span-12-phone"><h3>SRT File Upload</h3></div>
                <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                    <div className="input optional form-field-input">
                        <input
                            type="file"
                            accept=".srt"  // Accept only SRT files
                            onChange={handleSrtFileChange}
                            className="file-upload-input"
                        />
                        {srtFile && (
                            <div>
                                <h4>Selected SRT File:</h4>
                                <p>{srtFile.name}</p> {/* Display the SRT file name */}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr />

            {/* Information Documents Upload Section */}
            <div className="form-section">
                <div className="form-label grid-3 span-12-phone"><h3>Information Documents Upload</h3></div>
                <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
                    <div className="input optional form-field-input">
                        <input
                            type="file"
                            accept="*/*"  // Accept all file types
                            onChange={handleInfoDocsChange}
                            multiple
                            className="file-upload-input"
                        />
                        {infoDocs && (
                            <div>
                                <h4>Selected Documents:</h4>
                                <ul>
                                    {Array.from(infoDocs).map((file, index) => (
                                        <li key={index}>{file.name}</li> // Display the document file names
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SrtFileUpload;
