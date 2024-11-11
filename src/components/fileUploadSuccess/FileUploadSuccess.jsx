import greenTickMark from '../../assets/greenTickMark.png';
import React, { useState } from "react";
import Modal from "react-modal";

const FileUploadSuccess = () => {
    const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

    const openMetadataModal = () => {
        setIsMetadataModalOpen(true);
      };

    const closeMetadataModal = () => {
        setIsMetadataModalOpen(false);
    };

  return (
    <div>
        {/* Success Notification with URL */}
        <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
            <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
                <img
                    src={greenTickMark} 
                    alt="Success"
                    className="w-14 h-14"
                    />
            </div>
            </div>
            <div className="text-center text-2xl font-semibold text-customCardBlue mb-4">
            File Uploaded Successfully
            </div>
            <div className="w-50">
                <input
                    type="text"
                    value="https://my-example-bucket.s3.amazonaws.com/myfile.txt"
                    readOnly
                    className="w-full border-2 rounded-3xl border-customGrey-300 px-3 py-2 text-center"
                />
            </div>
            <div className="flex justify-center mt-4">
            <button className="w-20 font-bold bg-customCardBlue text-white py-2 px-4 rounded-3xl hover:bg-blue-600">
                Edit
            </button>
            </div>
        </div>

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

export default FileUploadSuccess;
