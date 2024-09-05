import React, { useState } from 'react';
import { FaCaretDown, FaEye, FaDownload } from 'react-icons/fa';
import Modal from "react-modal";

const AdminPage = () => {
    // Initial data for the table
    const [tableData, setTableData] = useState([
        {
            name: 'Gerame Media',
            orderid: 'W-123',
            jobid: 'J-12',
            filename: 'test.mp4',
            ordertype: 'On-demand',
            title: 'Mp4 delivery for HS',
            preset: 'MP4 H.264',
            action: 'Executed',
            status: 'In Queue',
            creationDate: '03.09.2024 09:15',
            modifiedDate: '03.09.2024 10:15',
            opsUser: 'Ajay',
            view: 'view/download',
        },
        {
            name: 'Director Cutz',
            orderid: 'W-123',
            jobid: 'J-12',
            filename: 'test.mp4',
            ordertype: 'Watch folder',
            title: 'Mov delivery for HS',
            preset: 'MOV PRO RES',
            action: 'Executed',
            status: 'In Progress',
            creationDate: '04.09.2024 13:15',
            modifiedDate: '03.09.2024 14:15',
            opsUser: 'Ajay',
            view: 'view/download',
        },
    ]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const [tempStatus, setTempStatus] = useState({});
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const statusOptions = ['In Queue', 'In Progress', 'Completed'];

    // Handle temp status change for a specific row
    const handleTempStatusChange = (index, newStatus) => {
        setTempStatus((prevState) => ({
            ...prevState,
            [index]: newStatus,
        }));
    };

    // Update the status permanently after clicking 'Update'
    const handleStatusUpdate = (index) => {
        const updatedData = [...tableData];
        updatedData[index].status = tempStatus[index] || updatedData[index].status; // Update the status for the specific row
        setTableData(updatedData);
        setIsDropdownOpen(null); // Close the dropdown after updating
    };

    const openViewModal = () => {
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="w-full bg-customCardBlue text-white uppercase text-sm text-center">
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Order Id</th>
                        <th className="py-3 px-6">Job Id</th>
                        <th className="py-3 px-6">Filename</th>
                        <th className="py-3 px-6">Order Type</th>
                        <th className="py-3 px-6">Title</th>
                        <th className="py-3 px-6">Preset</th>
                        <th className="py-3 px-6">User Action</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Creation Date</th>
                        <th className="py-3 px-6">Last Modified Date</th>
                        <th className="py-3 px-6">Ops User</th>
                        <th className="py-3 px-10">View</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800 text-sm">
                    {tableData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 relative text-center">
                            <td className="py-3 px-2">{row.name}</td>
                            <td className="py-3 px-2">{row.orderid}</td>
                            <td className="py-3 px-2">{row.jobid}</td>
                            <td className="py-3 px-2">{row.filename}</td>
                            <td className="py-3 px-2">{row.ordertype}</td>
                            <td className="py-3 px-2">{row.title}</td>
                            <td className="py-3 px-2">{row.preset}</td>
                            <td className="py-3 px-2">{row.action}</td>
                            <td className="py-3 px-2 relative">
                                <button
                                    onClick={() => setIsDropdownOpen(isDropdownOpen === index ? null : index)}
                                    className="bg-gray-100 px-3 py-1 rounded flex items-center cursor-pointer"
                                >
                                    {row.status}
                                    <FaCaretDown className="ml-2" />
                                </button>

                                {/* Dropdown */}
                                {isDropdownOpen === index && (
                                    <div
                                        className="absolute z-50 bg-white border border-gray-200 shadow-lg p-3 rounded mt-1 right-0"
                                        style={{
                                            top: '50%', // Ensure it opens below the button
                                            maxHeight: '200px', // Limit height in case of small screen
                                            overflowY: 'auto', // Scroll if content exceeds height
                                        }}
                                    >
                                        <ul className="space-y-2">
                                            {statusOptions.map((option, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => handleTempStatusChange(index, option)}
                                                    className={`cursor-pointer ${(tempStatus[index] || row.status) === option ? 'font-bold' : ''
                                                        } hover:bg-gray-100 px-2 py-1 rounded`}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => handleStatusUpdate(index)}
                                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded w-full"
                                        >
                                            Update
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="py-3 px-2">{row.creationDate}</td>
                            <td className="py-3 px-2">{row.modifiedDate}</td>
                            <td className="py-3 px-2">{row.opsUser}</td>
                            <td className="py-3">
                                {/* View and Download icons */}
                                <button className="mr-2 text-blue-500 hover:text-blue-700 text-2xl" onClick={openViewModal}>
                                    <FaEye /> {/* Eye icon for viewing the report */}
                                </button>
                                <button className="text-green-500 hover:text-green-700 text-2xl">
                                    <FaDownload /> {/* Download icon for downloading the report */}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Metadata Modal */}
            {isViewModalOpen && (
                <Modal
                    isOpen={isViewModalOpen}
                    onRequestClose={closeViewModal}
                    contentLabel="Metadata Input Modal"
                    className="absolute bg-white rounded-3xl shadow-lg mt-4 p-6 w-2/3 h-4/5 overflow-y-auto"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
                >
                    <div className='grid grid-cols-2'>
                        <div>
                            <h2 className="text-xl text-customCardBlue font-bold mb-4">Job Details</h2>
                        </div>
                        <div className='text-end'>
                            <button className="py-2 px-5 bg-customCardBlue text-white rounded-3xl">
                                Download
                            </button>
                        </div>
                    </div>
                    <hr className='mb-4'></hr>
                    <div className="grid grid-cols-4 gap-x-10 gap-y-2">
                        <div>
                            <p><strong>Customer/User Name</strong></p>
                        </div>
                        <div>
                            <p><strong>Order Id</strong></p>
                        </div>
                        <div>
                            <p><strong>Job Id</strong></p>
                        </div>
                        <div>
                            <p><strong>Filename</strong></p>
                        </div>
                        <div>
                            <p>Gerame Media</p>
                        </div>
                        <div>
                            <p>W-123</p>
                        </div>
                        <div>
                            <p>J-12</p>
                        </div>
                        <div>
                            <p>test.mp4</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-10 gap-y-2 mt-4">
                        <div>
                            <p><strong>Order Type</strong></p>
                        </div>
                        <div>
                            <p><strong>Title</strong></p>
                        </div>
                        <div>
                            <p><strong>User Action</strong></p>
                        </div>
                        <div>
                            <p><strong>Creation Date</strong></p>
                        </div>
                        <div>
                            <p>On-demand</p>
                        </div>
                        <div>
                            <p>Mp4 delivery for HS</p>
                        </div>
                        <div>
                            <p>Executed</p>
                        </div>
                        <div>
                            <p>03.09.2024 09:15</p>
                        </div>
                    </div>
                    <h2 className="text-xl text-customCardBlue font-bold mt-4">Preset Details</h2>
                    <hr className='mt-4'></hr>
                    <div className="grid grid-cols-4 gap-x-10 gap-y-2 mt-4">
                        <div>
                            <p><strong>Preset Title</strong></p>
                        </div>
                        <div>
                            <p><strong>Video Container</strong></p>
                        </div>
                        <div>
                            <p><strong>Video Codec</strong></p>
                        </div>
                        <div>
                            <p><strong>Size</strong></p>
                        </div>
                        <div>
                            <p>MP4 H.264</p>
                        </div>
                        <div>
                            <p>MPEG</p>
                        </div>
                        <div>
                            <p>H.264</p>
                        </div>
                        <div>
                            <p>1920X1080</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-10 gap-y-2 mt-4">
                        <div>
                            <p><strong>Resolution</strong></p>
                        </div>
                        <div>
                            <p><strong>Frame Rate</strong></p>
                        </div>
                        <div>
                            <p><strong>Scan Type</strong></p>
                        </div>
                        <div>
                            <p><strong>Bit Depth</strong></p>
                        </div>
                        <div>
                            <p>HD</p>
                        </div>
                        <div>
                            <p>Same As Source</p>
                        </div>
                        <div>
                            <p>Progressive</p>
                        </div>
                        <div>
                            <p>10bits</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-10 gap-y-2 mt-4">
                        <div>
                            <p><strong>Chroma Subsampling</strong></p>
                        </div>
                        <div>
                            <p><strong>Video Bit Rate</strong></p>
                        </div>
                        <div>
                            <p><strong>Audio Codec</strong></p>
                        </div>
                        <div>
                            <p><strong>Audio Sample Rate</strong></p>
                        </div>
                        <div>
                            <p>422</p>
                        </div>
                        <div>
                            <p>50mbps</p>
                        </div>
                        <div>
                            <p>AAC</p>
                        </div>
                        <div>
                            <p>48KHz</p>
                        </div>
                    </div>

                </Modal>
            )}
        </div>
    );
};

export default AdminPage;
