import React, { useState } from 'react';

const ListingTable = () => {
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [showStopPopup, setShowStopPopup] = useState(false);

  const handleStartClick = () => {
    setShowStartPopup(true);
  };

  const handleStopClick = () => {
    setShowStopPopup(true);
  };

  const handleClosePopup = () => {
    setShowStartPopup(false);
    setShowStopPopup(false);
  };

  return (
    <div className="p-8">
        
      {/* Create New Order Button */}
      <div className="mb-4 text-end">
        <button className="bg-customCardBlue text-white rounded-3xl font-bold px-4 py-3">Create New Order</button>
      </div>

       {/* Filter Inputs */}
       <div className="flex flex-wrap space-x-4 mb-4">
        <input type="text" placeholder="Search by Title" className="border-2 border-customCardBlue rounded-3xl px-4 py-2 mb-2 m-2" />
        <select className="border-2 border-customCardBlue rounded-3xl px-4 py-2 mb-2 m-2">
          <option>Created on</option>
        </select>
        <select className="border-2 border-customCardBlue rounded-3xl px-4 py-2 mb-2 m-2">
          <option>Status</option>
        </select>
        <select className="border-2 border-customCardBlue rounded-3xl px-4 py-2 mb-2 m-2">
          <option>Order type</option>
        </select>
        <select className="border-2 border-customCardBlue rounded-3xl px-4 py-2 mb-2 m-2">
          <option>Workflow type</option>
        </select>
      </div>

      {/* Apply and Reset Buttons */}
      <div className="flex space-x-4 mb-4">
        <button className="bg-customCardBlue text-white rounded-3xl font-bold px-5 py-2">Apply</button>
        <button className="border-2 border-customCardBlue text-customCardBlue rounded-3xl font-bold px-4 py-2">Reset</button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Order Id</th>
            <th className="border p-2">Order Title</th>
            <th className="border p-2">Order Type</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Created On</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">W-123</td>
            <td className="border p-2">Jurrasic Park -4k</td>
            <td className="border p-2">On-Demand</td>
            <td className="border p-2">Scheduled</td>
            <td className="border p-2">09:00 / 15:00 CST</td>
            <td className="border p-2">Name</td>
            <td className="border p-2 space-x-2">
              <button onClick={handleStartClick} className="border-2 border-customCardBlue rounded-3xl text-customCardBlue px-3 py-1">
                Start
              </button>
              <button onClick={handleStopClick} className="border-2 border-customCardBlue rounded-3xl text-customCardBlue px-3 py-1">
                Stop
              </button>
              <button className="border-2 border-customCardBlue rounded-3xl text-customCardBlue px-3 py-1">Edit</button>
            </td>
          </tr>
          {/* Repeat for other rows */}
        </tbody>
      </table>

      {showStartPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <p>This will start the process immediately. Do you want to proceed?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={handleClosePopup} className="border-2 border-customCardBlue rounded-3xl px-4 py-2">
                Yes
              </button>
              <button onClick={handleClosePopup} className="border-2 border-customCardBlue rounded-3xl px-4 py-2">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showStopPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <p>Would you like to cancel the processing of this order?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={handleClosePopup} className="border-2 border-customCardBlue rounded-3xl px-4 py-2">
                Yes
              </button>
              <button onClick={handleClosePopup} className="border-2 border-customCardBlue rounded-3xl px-4 py-2">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingTable;
