import React, { useState } from 'react';

const JobQueueTable = () => {
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
      <div className="mb-4 text-start">
        <h1 className='text-black font-semibold ml-4 mb-2'>Job Queue</h1>
      </div>

      {/* Filter Inputs */}
      <div className="flex flex-wrap space-x-4 mb-4">
        <div className="flex flex-col mb-2 m-2">
          <label className="mb-1 text-left ml-2 mb-2 font-semibold">Order Id</label>
          <input type="text" placeholder="Search by Order Id" className="border-2 border-customCardBlue rounded-3xl px-2 py-2 mb-2 m-2" />
        </div>

        <div className="flex flex-col mb-2 m-2">
          <label className="mb-1 text-left ml-2 mb-2 font-semibold">Job Id</label>
          <input type="text" placeholder="Search by Job Id" className="border-2 border-customCardBlue rounded-3xl px-2 py-2 mb-2 m-2" />
        </div>

        <div className="flex flex-col mb-2 m-2">
          <label className="mb-1 text-left ml-2 mb-2 font-semibold">Source</label>
          <select className="border-2 border-customCardBlue rounded-3xl mt-2 px-4 py-2">
            <option>AWS</option>
            <option>Azure</option>
            <option>GCP</option>
          </select>
        </div>

        <div className="flex flex-col mb-2 m-2">
          <label className="mb-1 text-left ml-2 mb-2 font-semibold">Status</label>
          <select className="border-2 border-customCardBlue rounded-3xl mt-2 px-4 py-2">
            <option>Start</option>
            <option>Created</option>
            <option>Finished</option>
          </select>
        </div>

      </div>

      {/* Apply and Reset Buttons */}
      <div className="flex space-x-4 mb-4">
        <button className="bg-customCardBlue text-white rounded-3xl font-bold px-5 py-2">Apply</button>
        <button className="border-2 border-customCardBlue text-customCardBlue rounded-3xl font-bold px-4 py-2">Reset</button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">
              <input type="checkbox" className="form-checkbox" />
            </th>
            <th className="border p-2">Order Id</th>
            <th className="border p-2">Job Id</th>
            <th className="border p-2">Order Type</th>
            <th className="border p-2">Source</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Progress</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Started At</th>
            <th className="border p-2">Finished At</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              <input
                type="checkbox"
                className="form-checkbox"
              />
            </td>
            <td className="border p-2">O-123</td>
            <td className="border p-2">J-123-1</td>
            <td className="border p-2">On-Demand</td>
            <td className="border p-2">AWS</td>
            <td className="border p-2">In progress</td>
            <td className="border p-2 text-customCardBlue">57%</td>
            <td className="border p-2">2024-01-19 03:14:07</td>
            <td className="border p-2">2024-01-19 03:14:07</td>
            <td className="border p-2">2024-01-19 03:14:07</td>
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

export default JobQueueTable;
