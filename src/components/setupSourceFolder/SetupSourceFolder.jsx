import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";

// For the modal to be rendered correctly, attach it to the root of your app
Modal.setAppElement("#root");

const SetupSourceFolder = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
        setFiles([...files, ...acceptedFiles]);
        console.log(acceptedFiles);
    },
  });

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openMetadataModal = () => {
    setIsMetadataModalOpen(true);
  };

  const closeMetadataModal = () => {
    setIsMetadataModalOpen(false);
  };

  const getButtonClass = (provider) => {
    return `py-2 px-4 rounded-full border-2 ${
      selectedProvider === provider
        ? "bg-customCardBlue text-white"
        : "bg-white text-black border-gray-300"
    } focus:outline-none focus:ring focus:border-blue-300`;
  };
  
  return (
    <div>
        <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
            <h2 className="text-lg font-semibold mb-4 text-center text-customCardBlue">
            To Encode a Video, Tell us where your source video is located
            </h2>
            <div className="flex justify-between items-center w-full mb-4">
            {/* Left Side: URL Input and Drag-and-Drop */}
            <div className="flex-1 pr-4 m-5">
                <input
                className="border border-gray-300 rounded-lg py-2 px-4 w-full mb-4"
                placeholder="Add URL Here"
                />
                <div
                {...getRootProps()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-full cursor-pointer"
                >
                <input {...getInputProps()} />
                <p className="mb-2">Drag and Drop your content here</p>
                <div className="text-6xl">+</div>
                </div>

            {/* Displaying the uploaded files */}
            {files.length > 0 && (
                <div className="mt-4 text-left">
                    <h4 className="font-semibold">Uploaded Files:</h4>
                    <ul className="list-disc list-inside">
                    {files.map((file, index) => (
                        <li key={index} className="text-gray-700">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>

            {/* Vertical Dotted Line */}
            <div className="flex items-center p-2 ml-30">
                <div className="h-64 border-l-2 border-dotted border-gray-300"></div>
            </div>

            {/* Right Side: Cloud Provider Buttons */}
            <div className="flex flex-col space-y-4 m-5">
                <button
                className={getButtonClass("AWS S3")}
                onClick={() => handleProviderClick("AWS S3")}
                >
                AWS S3
                </button>
                <button
                className={getButtonClass("Azure")}
                onClick={() => handleProviderClick("Azure")}
                >
                Azure
                </button>
                <button
                className={getButtonClass("GCP")}
                onClick={() => handleProviderClick("GCP")}
                >
                GCP
                </button>
            </div>
            
            </div>

            {/* Modal for AWS S3 / Azure / GCP input */}
            {isModalOpen && (
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Provider Input Modal"
                className="absolute bg-white rounded-3xl shadow-lg max-w-md p-6"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
            >
                <h2 className="text-lg font-semibold mb-4">
                {selectedProvider} Settings
                </h2>
                <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Key"
                    className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                />
                <input
                    type="text"
                    placeholder="Secret"
                    className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                />
                <input
                    type="text"
                    placeholder="Path"
                    className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                />
                <input
                    type="text"
                    placeholder="Region"
                    className="border border-gray-300 rounded-2xl py-2 px-4 w-full"
                />
                <button
                    type="submit"
                    className="py-2 px-4 bg-customCardBlue text-white rounded-3xl"
                    onClick={closeModal}
                >
                    Save
                </button>
                </form>
            </Modal>
            )}

            {/* Metadata Modal */}
            {isMetadataModalOpen && (
            <Modal
                isOpen={isMetadataModalOpen}
                onRequestClose={closeMetadataModal}
                contentLabel="Metadata Input Modal"
                className="absolute bg-white rounded-3xl shadow-lg max-w-2xl p-6"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
            >
                <h2 className="text-lg font-semibold mb-4">Add Metadata</h2>
                <form className="grid grid-cols-2 gap-4">
                    {/* First Column */}
                    <div className="space-y-4">
                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Title</label>
                        <input
                            type="text"
                            placeholder="Enter title"
                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                        />
                        </div>

                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Genre</label>
                        <select className="border border-gray-300 rounded-lg py-2 px-4 w-full">
                            <option>Select Genre</option>
                            <option value="action">Action</option>
                            <option value="comedy">Comedy</option>
                            <option value="drama">Drama</option>
                            <option value="thriller">Thriller</option>
                        </select>
                        </div>

                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Auxilluary files</label>
                        <input
                            type="file"
                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                        />
                        </div>

                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Audio</label>
                        <input
                            type="file"
                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                        />
                        </div>
                    </div>

                    {/* Second Column */}
                    <div className="space-y-4">
                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Category</label>
                        <select className="border border-gray-300 rounded-lg py-2 px-4 w-full">
                            <option>Select Category</option>
                            <option value="movie">Movie</option>
                            <option value="series">Series</option>
                            <option value="documentary">Documentary</option>
                        </select>
                        </div>

                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Language</label>
                        <select className="border border-gray-300 rounded-lg py-2 px-4 w-full">
                            <option>Select Language</option>
                            <option value="action">English</option>
                            <option value="comedy">Hindi</option>
                            <option value="drama">Spanish</option>
                            <option value="thriller">French</option>
                        </select>
                        </div>

                        <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Subtitles/Closed captions</label>
                        <input
                            type="file"
                            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                        />
                        </div>

                    </div>

                    <div className="col-span-2">
                        <button
                        type="submit"
                        className="mt-4 py-2 px-4 bg-customCardBlue text-white rounded-3xl"
                        onClick={closeMetadataModal}
                        >
                        Save Metadata
                        </button>
                    </div>
                </form>
            </Modal>
            )}

        </div>
        <div className="flex items-center w-full">
            {/* Centered Button */}
            <div className="flex-1 flex justify-center">
                <button
                className="py-2 px-4 bg-customCardBlue text-white rounded-3xl"
                onClick={openMetadataModal}
                >
                Click to Add Metadata
                </button>
            </div>

            {/* Right-Aligned Button */}
            <div className="flex justify-end">
                <button
                className="py-2 px-5 bg-customCardBlue text-white rounded-3xl mr-4"
                >
                Next
                </button>
            </div>
        </div>

    </div>

  );
};

export default SetupSourceFolder;
