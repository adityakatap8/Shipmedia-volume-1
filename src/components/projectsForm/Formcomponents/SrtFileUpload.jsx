import React, { useState } from 'react';

function SrtFileUpload({ onSrtFileChange, onInfoDocsFileChange }) {
  const [srtFile, setSrtFile] = useState(null);
  const [infoDocs, setInfoDocs] = useState([]);

  // ✅ Handle SRT upload
  const handleSrtFileChange = (event) => {
    const file = event.target.files[0];
    setSrtFile(file);

   

    // Send the file info to parent component
    if (file && onSrtFileChange) {
      const fileInfo = {
        fileName: file.name,
        filePath: URL.createObjectURL(file), // Temporary URL to the file
        fileSize: file.size,
        fileType: file.type,
      };
     
      onSrtFileChange([fileInfo]); // ⬅️ Send file info to parent
    }
  };

  // ✅ Handle InfoDocs upload
  const handleInfoDocsChange = (event) => {
    const files = Array.from(event.target.files);
    setInfoDocs(files);

   

    // Send the file info to parent component
    const uploadedInfos = files.map((file) => ({
      fileName: file.name,
      filePath: URL.createObjectURL(file), // Temporary URL to the file
      fileSize: file.size,
      fileType: file.type,
    }));

    if (uploadedInfos.length > 0 && onInfoDocsFileChange) {
      console.log('📦 Sending Info Docs to parent:', uploadedInfos);
      onInfoDocsFileChange(uploadedInfos); // ⬅️ Send full metadata to parent
    }
  };

  return (
    <div className="pt-10">
      <div className="row submitter-row">
        <div className="submitter-container">
          <h1 className="header-numbered">
            <span>2</span>
            Additional Information
          </h1>
        </div>
      </div>

      {/* SRT File Upload Section */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          <h3>SRT File Upload</h3>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="file"
              accept=".srt"
              onChange={handleSrtFileChange}
              className="file-upload-input"
            />
            {srtFile && (
              <div>
                <h4>Selected SRT File:</h4>
                <p>{srtFile.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr />

      {/* InfoDocs Upload Section */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          <h3>Information Documents Upload</h3>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="input optional form-field-input">
            <input
              type="file"
              accept="*/*"
              onChange={handleInfoDocsChange}
              multiple
              className="file-upload-input"
            />
            {infoDocs.length > 0 && (
              <div>
                <h4>Selected Documents:</h4>
                <ul>
                  {infoDocs.map((file, index) => (
                    <li key={index}>{file.name}</li>
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
