import React, { useState } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";

const BulkUpload = () => {
  const [jsonFiles, setJsonFiles] = useState([]);
  const [parsedProjects, setParsedProjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [response, setResponse] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const userId = user?.userId || '';

  const toggleProject = (index) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleJsonFilesUpload = async (e) => {
    const files = Array.from(e.target.files);
    const allProjects = [];

    if (!userId) {
      alert('❌ Cannot upload: Missing logged-in user ID.');
      return;
    }

    for (const file of files) {
      if (!file.name.endsWith('.json')) continue;

      try {
        const text = await file.text();
        const content = JSON.parse(text);

        if (Array.isArray(content)) {
          const withUserId = content.map((project) => ({
            ...project,
            userId,
          }));
          allProjects.push(...withUserId);
        } else if (typeof content === 'object' && content !== null) {
          allProjects.push({ ...content, userId });
        }
      } catch (err) {
        console.error(`❌ Failed to parse ${file.name}:`, err);
        alert(`❌ Failed to parse ${file.name}. Check file format.`);
      }
    }

    setJsonFiles(files);
    setParsedProjects(allProjects);
    setResponse(null);
  };

  const handleRemoveFiles = () => {
    setJsonFiles([]);
    setParsedProjects([]);
    setExpandedProjects({});
    setResponse(null);
  };

  const handleUploadAgain = () => {
    handleRemoveFiles(); // Clear everything to allow new uploads
  };

  const uploadToBackend = async () => {
    if (!parsedProjects || parsedProjects.length === 0) {
      alert('No valid projects to upload.');
      return;
    }

    try {
      setUploading(true);

      const token = Cookies.get("token");

      const res = await axios.post(
        `http://localhost:3000/api/projectForm/bulkCreateProject`,
        { userId, projects: parsedProjects },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, count, skipped } = res.data;
      setResponse(res.data);

      // ✅ Conditional alert
      if (count === 0) {
        alert(`❌ No projects created.\nReasons:\n${(skipped || [])
          .map((s) => `• Project ${s.index + 1}: ${s.reason}`)
          .join('\n')}`);
      } else if (skipped?.length) {
        alert(`⚠️ ${count} projects created.\n${skipped.length} skipped:\n${skipped
          .map((s) => `• Project ${s.index + 1}: ${s.reason}`)
          .join('\n')}`);
      } else {
        alert('✅ All projects uploaded successfully!');
      }

      setParsedProjects([]);
    } catch (err) {
      console.error('❌ Error uploading projects:', err);
      alert(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center text-white space-y-8">
      {/* Upload input (hidden when response exists) */}
      {!response && (
        <div className="w-[55%] p-8 border border-gray-600 bg-gray-800 rounded-lg text-center">
          <p><strong>Upload Multiple Project JSON Files</strong></p>
          <p className="text-sm text-gray-400 mt-1">Each file must be a valid project JSON (single or array).</p>
          <input
            type="file"
            accept=".json"
            multiple
            onChange={handleJsonFilesUpload}
            className="mt-4 text-sm text-white"
          />
        </div>
      )}

      {/* Parsed preview */}
      {parsedProjects.length > 0 && (
        <div className="w-[55%] bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">📦 Parsed {parsedProjects.length} Project(s)</h2>

          <ul className="text-sm max-h-64 overflow-y-auto list-disc pl-4">
            {parsedProjects.map((project, index) => (
              <li key={index} className="mb-2">
                <div
                  onClick={() => toggleProject(index)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {expandedProjects[index] ? <FaChevronDown /> : <FaChevronRight />}
                  <span>Project {index + 1}</span>
                </div>
                {expandedProjects[index] && (
                  <pre className="ml-6 mt-1 bg-gray-700 text-xs p-2 rounded max-h-60 overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(project, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={uploadToBackend}
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              {uploading ? 'Uploading...' : 'Submit All to Backend'}
            </button>
            <button
              onClick={handleRemoveFiles}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
            >
              Remove Files
            </button>
          </div>
        </div>
      )}

      {/* Server response */}
      {response && (
        <div className="w-[55%] mt-6 bg-green-700 p-4 rounded text-sm flex flex-col items-center">
          <h3 className="font-semibold mb-2">✅ Server Response:</h3>
          <pre className="bg-green-800 p-2 rounded max-h-60 overflow-auto whitespace-pre-wrap w-full">
            {JSON.stringify(response, null, 2)}
          </pre>

          {/* Upload Again button */}
          <button
            onClick={handleUploadAgain}
            className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
          >
            Upload File Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
