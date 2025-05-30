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
  projectInfo,
  orgName,
  projectName,
}) => {
  const [dubbedEntries, setDubbedEntries] = useState(formData?.dubbedFiles || [{}]);

  const updateParent = (entries) => {
    setFormData((prev) => ({
      ...prev,
      dubbedFiles: entries,
    }));
    onInputChange({ dubbedFiles: entries });
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...dubbedEntries];
    updatedEntries[index] = { ...updatedEntries[index], [name]: value };

    if (name === 'dubbedTrailerUrl' && value) {
      const fileName = value.split('/').pop();
      const projectFolder = (projectInfo?.projectName || projectName || 'unknown_project').replace(/\s+/g, '+');
      const language = updatedEntries[index].language || 'unknown_language';

      const constructedS3Url = `s3://mediashippers-filestash/${orgName}/${projectFolder}/trailers/${language}/${fileName}`;

      updatedEntries[index].dubbedTrailerFileName = fileName;
      updatedEntries[index].dubbedTrailerUrl = constructedS3Url;
    }

    setDubbedEntries(updatedEntries);
    updateParent(updatedEntries);
  };

  const handleFileChange = (index, e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedEntries = [...dubbedEntries];
    updatedEntries[index] = { ...updatedEntries[index], [fieldName]: file };

    const language = updatedEntries[index].language || 'unknown_language';
    const projectFolder = (projectInfo?.projectName || projectName || 'unknown_project').replace(/\s+/g, '+');
    const fileName = file.name;

    if (fieldName === 'dubbedTrailerFile') {
      const dubbedS3Url = `s3://mediashippers-filestash/${orgName}/${projectFolder}/trailers/${language}/${fileName}`;
      updatedEntries[index].dubbedTrailerFileName = fileName;
      updatedEntries[index].dubbedTrailerUrl = dubbedS3Url;
    }

    if (fieldName === 'dubbedSubtitleFile') {
      const subtitleS3Url = `s3://mediashippers-filestash/${orgName}/${projectFolder}/srt files/${language}/${fileName}`;
      updatedEntries[index].dubbedSubtitleFileName = fileName;
      updatedEntries[index].dubbedSubtitleUrl = subtitleS3Url;
    }

    setDubbedEntries(updatedEntries);
    updateParent(updatedEntries);
  };

  const resetFileField = (index, fieldName) => {
    const updatedEntries = [...dubbedEntries];
    updatedEntries[index][fieldName] = null;
    setDubbedEntries(updatedEntries);
    updateParent(updatedEntries);
  };

  const addNewEntry = () => {
    setDubbedEntries([...dubbedEntries, {}]);
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
          {/* Language Selector */}
          <div className="form-section">
            <div className="form-label grid-3 span-12-phone">
              <h3>Select Language</h3>
            </div>
            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
              <select
                name="language"
                value={entry.language || ''}
                onChange={(e) => handleChange(index, e)}
                className="file-upload-input"
                style={{ width: '100%', padding: '10px', color: 'black' }}
              >
                <option value="">Select Language</option>
                {languageList.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              {errors?.language && <div className="error">{errors.language}</div>}
            </div>
          </div>

          {/* Trailer Upload or URL */}
          <div className="form-section">
            <div className="form-label grid-3 span-12-phone">
              <h3>Upload Trailer or Provide S3 URL</h3>
            </div>
            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
              <div className="upload-or-url-option d-flex text-white" style={{ gap: '20px' }}>
                <label>
                  <input
                    type="radio"
                    name={`trailerOption-${index}`}
                    value="upload"
                    checked={entry.trailerOption === 'upload'}
                    onChange={() => handleChange(index, { target: { name: 'trailerOption', value: 'upload' } })}
                  />
                  Upload Trailer
                </label>
                <label>
                  <input
                    type="radio"
                    name={`trailerOption-${index}`}
                    value="url"
                    checked={entry.trailerOption === 'url'}
                    onChange={() => handleChange(index, { target: { name: 'trailerOption', value: 'url' } })}
                  />
                  Provide S3 URL
                </label>
              </div>

              {entry.trailerOption === 'upload' && (
                <div className="form-field-input">
                  {!entry.dubbedTrailerFile ? (
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(index, e, 'dubbedTrailerFile')}
                    />
                  ) : (
                    <>
                      <p>{entry.dubbedTrailerFile.name}</p>
                      <button
                        onClick={() => resetFileField(index, 'dubbedTrailerFile')}
                        className="btn btn-secondary mt-2"
                      >
                        Change File
                      </button>
                    </>
                  )}
                  {errors?.trailerFile && <div className="error">{errors.trailerFile}</div>}
                </div>
              )}

              {entry.trailerOption === 'url' && (
                <div className="form-field-input">
                  <input
                    type="url"
                    name="dubbedTrailerUrl"
                    value={entry.dubbedTrailerUrl || ''}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Paste public trailer S3 URL"
                  />
                  {errors?.trailerUrl && <div className="error">{errors.trailerUrl}</div>}
                </div>
              )}
            </div>
          </div>

          {/* Subtitle Upload */}
          <div className="form-section">
            <div className="form-label grid-3 span-12-phone">
              <h3>Upload Subtitle (SRT)</h3>
            </div>
            <div className="form-field radio-buttons span-6 span-8-tablet span-12-phone">
              <input
                type="file"
                accept=".srt"
                onChange={(e) => handleFileChange(index, e, 'dubbedSubtitleFile')}
              />
              {entry.dubbedSubtitleFile && <p>{entry.dubbedSubtitleFile.name}</p>}
              {errors?.srtFile && <div className="error">{errors.srtFile}</div>}
            </div>
          </div>
        </div>
      ))}

      <div className="form-section">
        <button
          type="button"
          onClick={addNewEntry}
          className="btn btn-primary"
          style={{ marginTop: '10px' }}
        >
          + Add More Dubbed Files
        </button>
      </div>
    </div>
  );
};

export default DubbedFiles;
