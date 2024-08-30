import React, { useState } from 'react';

const VideoAudioSettings = () => {
  const [selectedEncoding, setSelectedEncoding] = useState('video');

  return (
    <div className="items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-lg font-normal text-left mb-2">Container Settings</label>
        <select className="block w-1/2 mx-1 bg-customCardBlue text-white p-2 rounded leading-tight">
          <option>MPEG 4</option>
          <option>MOV</option>
          <option>MXF</option>
          <option>IMF</option>
          <option>MPEG DASH ISO</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-lg font-normal text-left mb-2">Encoding Settings</label>
        <div className="flex">
          <button
            onClick={() => setSelectedEncoding('video')}
            className={`p-2 ml-64 w-1/4 mx-1 rounded-3xl text-center ${selectedEncoding === 'video' ? 'bg-customCardBlue text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Video
          </button>
          <button
            onClick={() => setSelectedEncoding('audio')}
            className={`p-2 ml-2 w-1/4 rounded-3xl text-center ${selectedEncoding === 'audio' ? 'bg-customCardBlue text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Audio
          </button>
        </div>
      </div>

      {selectedEncoding === 'video' && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-normal text-left mb-2">Video Codec</label>
            <select className="block w-1/2 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight">
              <option>MPEG 4 AVC</option>
              <option>AV1</option>
              <option>HEVC</option>
              <option>VP9</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg text-left font-normal mb-2">Resolution</label>
            <div className="flex space-x-2">
                <select className="block w-1/4 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight" style={{ "marginLeft":"24rem"}}>
                    <option>Width</option>
                    {/* Add options for width */}
                </select>
                <select className="block w-1/4 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight">
                    <option>Height</option>
                    {/* Add options for height */}
                </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg text-left font-normal mb-2">Frame Rate</label>
            <div className="flex space-x-2">
              <select className="block w-1/2 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight">
                <option>Follow Source</option>
                {/* Add options for frame rate */}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg text-left font-normal mb-2">Aspect Ratio</label>
            <div className="flex space-x-2">
              <select className="block w-1/2 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight">
                <option>Follow Source</option>
                {/* Add options for aspect ratio */}
              </select>
            </div>
          </div>
        </div>
      )}

      {selectedEncoding === 'audio' && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg text-left font-normal mb-2">Audio Codec</label>
            <select className="block w-1/2 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight" style={{ "marginLeft":"24rem"}}>
              <option>Advanced Audio Coding</option>
              <option>Dolby Digital</option>
              <option>Dolby Digital PLUS</option>
              <option>Dolby Digital PLUS JOC (atmos)</option>
              <option>Dolby Digital Passthrough</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg text-left font-normal mb-2">Coding Mode</label>
            <select className="block w-1/2 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight" style={{ "marginLeft":"24rem"}}>
              <option>1.0 MONO</option>
              <option>2.0 Stereo</option>
              <option>5.1 Surround</option>
              <option>1.0 Audio Description</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg text-left font-normal mb-2">Sample Rate</label>
            <select className="block w-1/2 mx-1 bg-gray-200 text-gray-700 p-2 rounded leading-tight" style={{ "marginLeft":"24rem"}}>
              <option>8.0</option>
              <option>12.0</option>
              <option>16.0</option>
              <option>22.05</option>
              {/* Add options for sample rate */}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAudioSettings;
