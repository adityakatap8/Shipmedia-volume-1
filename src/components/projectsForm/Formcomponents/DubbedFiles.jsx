import React, { useState } from 'react';

const languageList = [
        "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian",
        "Bengali", "Bosnian", "Bulgarian", "Burmese", "Catalan", "Cebuano", "Chinese", "Corsican",
        "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish",
        "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole",
        "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian",
        "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda",
        "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish",
        "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
        "Nepali", "Norwegian", "Nyanja", "Odia", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi",
        "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi",
        "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish",
        "Tagalog", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian",
        "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
    ];

    
const DubbedFiles = ({
  onInputChange,
  formData,
  setFormData,
  errors,
  setDubbedFilesErrors,
}) => {
  const [dubbedEntries, setDubbedEntries] = useState(formData?.dubbedFiles || [{}]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...dubbedEntries];
    updatedEntries[index] = { ...updatedEntries[index], [name]: value };
    setDubbedEntries(updatedEntries);
    updateParent(updatedEntries);
  };

  const handleFileChange = (index, e, fieldName) => {
    const file = e.target.files[0];
    const updatedEntries = [...dubbedEntries];
    updatedEntries[index] = { ...updatedEntries[index], [fieldName]: file };

    // For video preview
    if (fieldName === 'dubbedTrailerFile') {
      updatedEntries[index].localVideoUrl = URL.createObjectURL(file);
    }

    setDubbedEntries(updatedEntries);
    updateParent(updatedEntries);
  };

  const resetFileField = (index, fieldName) => {
    const updatedEntries = [...dubbedEntries];

    // Cleanup object URL if needed
    if (fieldName === 'dubbedTrailerFile' && updatedEntries[index].localVideoUrl) {
      URL.revokeObjectURL(updatedEntries[index].localVideoUrl);
      updatedEntries[index].localVideoUrl = '';
    }

    updatedEntries[index][fieldName] = null;
    setDubbedEntries(updatedEntries);
    updateParent(updatedEntries);
  };

  const updateParent = (entries) => {
    setFormData((prev) => ({
      ...prev,
      dubbedFiles: entries,
    }));
    onInputChange({ dubbedFiles: entries });
  };

  const addNewEntry = () => {
    const updatedEntries = [...dubbedEntries, {}];
    setDubbedEntries(updatedEntries);
  };

  return (
    <div className="pt-10">
      <div className="row submitter-row">
        <div className="submitter-container">
          <h1 className="header-numbered">
            <span>3</span> Dubbed Files
          </h1>
        </div>
      </div>

      {dubbedEntries.map((entry, index) => (
        <div key={index} className="mb-6 p-4 rounded">
          {/* Language Selection */}
          <div className="form-section">
            <div className="form-label grid-3 span-12-phone">
              <h3>Select Language</h3>
            </div>
            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
              <div className="input optional form-field-input" style={{ textAlign: 'left' }}>
                <select
                  name="language"
                  value={entry.language || ''}
                  onChange={(e) => handleChange(index, e)}
                  className="file-upload-input"
                  style={{
                    width: '100%',
                    color: '#000',
                    textAlign: 'left',
                    padding: '10px',
                  }}
                >
                  <option value="">Select Language</option>
                  {languageList.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors?.language && <div className="error">{errors.language}</div>}
              </div>
            </div>
          </div>

          {/* Trailer File Upload or S3 URL */}
          <div className="form-section">
            <div className="form-label grid-3 span-12-phone">
              <h3>Upload Trailer or Provide S3 URL</h3>
            </div>
            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
              <div className="input optional form-field-input">
                <div className="upload-or-url-option d-flex text-white" style={{ gap: '20px' }}>
                  <div>
                    <input
                      type="radio"
                      id={`uploadTrailer-${index}`}
                      name={`trailerOption-${index}`}
                      value="upload"
                      checked={entry.trailerOption === 'upload'}
                      onChange={() =>
                        handleChange(index, {
                          target: { name: 'trailerOption', value: 'upload' },
                        })
                      }
                    />
                    <label htmlFor={`uploadTrailer-${index}`}>Upload Trailer</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id={`urlTrailer-${index}`}
                      name={`trailerOption-${index}`}
                      value="url"
                      checked={entry.trailerOption === 'url'}
                      onChange={() =>
                        handleChange(index, {
                          target: { name: 'trailerOption', value: 'url' },
                        })
                      }
                    />
                    <label htmlFor={`urlTrailer-${index}`}>Provide S3 URL</label>
                  </div>
                </div>

                {/* File Upload */}
                {entry.trailerOption === 'upload' && (
                  <div className="input optional form-field-input">
                    {!entry.dubbedTrailerFile ? (
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(index, e, 'dubbedTrailerFile')}
                        className="file-upload-input"
                      />
                    ) : (
                      <>
                        <p>{entry.dubbedTrailerFile.name}</p>
                        <video
                          width="100%"
                          height="auto"
                          controls
                          src={entry.localVideoUrl}
                          style={{ marginTop: '10px', borderRadius: '6px' }}
                        />
                        <button
                          type="button"
                          onClick={() => resetFileField(index, 'dubbedTrailerFile')}
                          className="btn btn-secondary"
                          style={{ marginTop: '10px' }}
                        >
                          Change File
                        </button>
                      </>
                    )}
                    {errors?.trailerFile && <div className="error">{errors.trailerFile}</div>}
                  </div>
                )}

                {/* S3 URL */}
                {entry.trailerOption === 'url' && (
                  <div className="input optional form-field-input">
                    <input
                      type="url"
                      name="dubbedTrailerUrl"
                      value={entry.dubbedTrailerUrl || ''}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="https://s3.amazonaws.com/your-bucket/trailer.mp4"
                      className="file-upload-input"
                    />
                    {entry.dubbedTrailerUrl && (
                      <video
                        width="100%"
                        height="auto"
                        controls
                        src={entry.dubbedTrailerUrl}
                        style={{ marginTop: '10px', borderRadius: '6px' }}
                      />
                    )}
                    {errors?.trailerUrl && <div className="error">{errors.trailerUrl}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SRT Upload */}
          <div className="form-section">
            <div className="form-label grid-3 span-12-phone">
              <h3>Upload Subtitle (SRT)</h3>
            </div>
            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
              <div className="input optional form-field-input">
                <input
                  type="file"
                  accept=".srt"
                  onChange={(e) => handleFileChange(index, e, 'dubbedSubtitleFile')}
                  className="file-upload-input"
                />
                {entry.dubbedSubtitleFile && <p>{entry.dubbedSubtitleFile.name}</p>}
                {errors?.srtFile && <div className="error">{errors.srtFile}</div>}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <div className="form-section" style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          onClick={addNewEntry}
          style={{
            backgroundColor: '#1d4ed8',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            marginTop: '10px',
            padding: '10px 15px',
          }}
        >
          + Add More Dubbed Files
        </button>
      </div>
    </div>
  );
};

export default DubbedFiles;