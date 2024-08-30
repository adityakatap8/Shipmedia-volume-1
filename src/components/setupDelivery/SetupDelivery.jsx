import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";

// For the modal to be rendered correctly, attach it to the root of your app
Modal.setAppElement("#root");

const SetupDelivery = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const getButtonClass = (provider) => {
    return `py-2 px-4 m-5 rounded-full border-2 ${
      selectedProvider === provider
        ? "bg-customCardBlue text-white"
        : "bg-white text-black border-gray-300"
    } focus:outline-none focus:ring focus:border-blue-300`;
  };
  
  return (
    <div>
        <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
       
            <div className="flex flex-wrap justify-center items-baseline">
                <button className={getButtonClass("AWS S3")} onClick={() => handleProviderClick("AWS S3")}>AWS S3</button>
                <button className={getButtonClass("Azure")} onClick={() => handleProviderClick("Azure")}>Azure</button>
                <button className={getButtonClass("GCP")} onClick={() => handleProviderClick("GCP")}>GCP</button>
            </div>

            <div className="flex flex-col w-full">
                <input className="border border-gray-300 rounded-3xl py-2 px-4 mb-4" placeholder="Provide email address to receive download link" />
            </div>

            <div className="flex flex-col">
                <button className="py-2 px-4 m-4 bg-white text-black border-gray-300 rounded-full border-2">Download</button>
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

        </div>

        <div className='d-flex'>
            <button className="py-2 px-4 text-customCardBlue bg-white font-bold border-gray-300 rounded-full border-2 ml-5">
                Save
            </button>
            <button className="py-2 px-4 text-customCardBlue bg-white font-bold border-gray-300 rounded-full border-2 ml-5">
                Schedule Order
            </button>
            <button className="py-2 px-4 text-customOrange bg-white font-bold border-gray-300 rounded-full border-2 ml-5">
                Execute
            </button>
        </div>

    </div>

  );
};

export default SetupDelivery;
