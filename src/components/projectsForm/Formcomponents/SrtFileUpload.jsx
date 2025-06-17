import React, { useState } from 'react';

function SrtFileUpload({
  onSrtFileChange,
  onInfoDocsFileChange,
  orgName,
  projectName,
  projectInfo,
  language = 'unknown_language',
}) {
  const [srtOption, setSrtOption] = useState('upload');
  const [infoDocsOption, setInfoDocsOption] = useState('upload');

  const [srtFiles, setSrtFiles] = useState([]);
  const [srtUrls, setSrtUrls] = useState(['']);

  const [infoDocs, setInfoDocs] = useState([]);
  const [infoDocsUrls, setInfoDocsUrls] = useState(['']);

  // === Helpers ===
  const buildSrtS3Url = (fileName) => {
    const projFolder = (projectInfo?.projectName || projectName || 'unknown_project').replace(/\s+/g, '+');
    return `s3://testmediashippers /${orgName}/${projFolder}/srt files/${fileName}`;
  };

  const buildInfoDocS3Url = (fileName) => {
    const projFolder = (projectInfo?.projectName || projectName || 'unknown_project').replace(/\s+/g, '+');
    return `s3://testmediashippers /${orgName}/${projFolder}/srt files/${fileName}`;
  };

  // === SRT File Handlers ===
  const handleSrtFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSrtFiles(files);

    // *** PASS ACTUAL FILES UP ***
    onSrtFileChange?.(files);
  };

  const handleSrtUrlChange = (index, value) => {
    const updated = [...srtUrls];
    updated[index] = value;
    setSrtUrls(updated);

    const fileData = updated.filter(Boolean).map((url) => {
      const fileName = url.split('/').pop();
      return {
        fileName,
        filePath: buildSrtS3Url(fileName),
        fileSize: null,
        fileType: 'url',
        originalUrl: url,
      };
    });

    onSrtFileChange?.(fileData);
  };

  // === Info Docs Handlers ===
  const handleInfoDocsChange = (event) => {
    const files = Array.from(event.target.files);
    setInfoDocs(files);

    // *** PASS ACTUAL FILES UP ***
    onInfoDocsFileChange?.(files);
  };

  const handleInfoDocsUrlsChange = (index, value) => {
    const updated = [...infoDocsUrls];
    updated[index] = value;
    setInfoDocsUrls(updated);

    const fileData = updated.filter(Boolean).map((url) => {
      const fileName = url.split('/').pop();
      return {
        fileName,
        filePath: buildInfoDocS3Url(fileName),
        fileSize: null,
        fileType: 'url',
        originalUrl: url,
      };
    });

    onInfoDocsFileChange?.(fileData);
  };

  const addSrtUrlField = () => setSrtUrls([...srtUrls, '']);
  const addInfoDocUrlField = () => setInfoDocsUrls([...infoDocsUrls, '']);

  return (
    <div className="pt-10">
      <div className="row submitter-row">
        <div className="submitter-container">
          <h1 className="header-numbered">
            <span>2</span> Additional Information
          </h1>
        </div>
      </div>

      {/* === SRT Section === */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          <h3>SRT File</h3>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="upload-or-url-option d-flex" style={{ gap: '20px', marginBottom: '10px' }}>
            <label>
              <input
                type="radio"
                name="srtOption"
                checked={srtOption === 'upload'}
                onChange={() => setSrtOption('upload')}
              />
              Upload Files
            </label>
            <label>
              <input
                type="radio"
                name="srtOption"
                checked={srtOption === 'url'}
                onChange={() => setSrtOption('url')}
              />
              Provide S3 URLs
            </label>
          </div>

          {srtOption === 'upload' && (
            <div className="form-field-input" style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="file" accept=".srt" multiple onChange={handleSrtFileChange} className="file-upload-input" />
              {srtFiles.length > 0 && (
                <ul>
                  {srtFiles.map((file, idx) => (
                    <li key={idx}>
                      {file.name} — <code>{buildSrtS3Url(file.name)}</code>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {srtOption === 'url' && (
            <div className="form-field-input" style={{ display: 'flex', flexDirection: 'column' }}>
              {srtUrls.map((url, idx) => (
                <input
                  key={idx}
                  type="url"
                  value={url}
                  onChange={(e) => handleSrtUrlChange(idx, e.target.value)}
                  placeholder="https://s3.amazonaws.com/your-bucket/file.srt"
                  className="file-upload-input"
                  style={{ marginBottom: '8px' }}
                />
              ))}
              <button type="button" onClick={addSrtUrlField}>
                + Add Another URL
              </button>
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* === Info Docs Section === */}
      <div className="form-section">
        <div className="form-label grid-3 span-12-phone">
          <h3>Information Documents</h3>
          <p className="text-md font-light text-white-500">(Censor Certificate, Rights Ownership Certificate)</p>
        </div>
        <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
          <div className="upload-or-url-option d-flex" style={{ gap: '20px', marginBottom: '10px' }}>
            <label>
              <input
                type="radio"
                name="infoDocsOption"
                checked={infoDocsOption === 'upload'}
                onChange={() => setInfoDocsOption('upload')}
              />
              Upload Files
            </label>
            <label>
              <input
                type="radio"
                name="infoDocsOption"
                checked={infoDocsOption === 'url'}
                onChange={() => setInfoDocsOption('url')}
              />
              Provide S3 URLs
            </label>
          </div>

          {infoDocsOption === 'upload' && (
            <div className="form-field-input" style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="file" multiple onChange={handleInfoDocsChange} className="file-upload-input" />
              {infoDocs.length > 0 && (
                <ul>
                  {infoDocs.map((file, idx) => (
                    <li key={idx}>
                      {file.name} — <code>{buildInfoDocS3Url(file.name)}</code>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {infoDocsOption === 'url' && (
            <div className="form-field-input" style={{ display: 'flex', flexDirection: 'column' }}>
              {infoDocsUrls.map((url, idx) => (
                <input
                  key={idx}
                  type="url"
                  value={url}
                  onChange={(e) => handleInfoDocsUrlsChange(idx, e.target.value)}
                  placeholder="https://s3.amazonaws.com/your-bucket/document.pdf"
                  className="file-upload-input"
                  style={{ marginBottom: '8px' }}
                />
              ))}
              <button type="button" onClick={addInfoDocUrlField}>
                + Add Another URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SrtFileUpload;
