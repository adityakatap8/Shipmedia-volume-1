import React from 'react'

function Main() {
    return (
        <div className="mx-auto p-6">
            <div className='text-left text-2xl pb-4 mt-2'>
                <h4>Order Management</h4>
            </div>
            
            <div className="border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 flex">
                {/* First Card */}
                <div className="w-1/2 p-4 ml-24 mt-3 mb-3 flex flex-col justify-between bg-customCardBlue-700 text-white rounded-3xl w-64 h-80 text-left">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2">Create a new order </h2>
                        <p className="mt-4 text-2xl">Add source URL or upload your files directly.</p>
                    </div>
                    <button className="mt-4 bg-customGrey text-customCardBlue-700 px-4 py-2 rounded-3xl hover:bg-gray-100 text-xl">
                        Create A Order
                    </button>
                </div>

                {/* Vertical Dotted Line */}
                <div className="flex items-center p-2 ml-32">
                    <div className="h-64 border-l-2 border-dotted border-gray-300"></div>
                </div>

                {/* Second Card */}
                <div className="w-1/2 p-4 ml-32 mt-3 mb-3 flex flex-col justify-between bg-customCardBlue-700 text-white rounded-3xl w-64 h-80 text-left">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2">Setup a watch folder</h2>
                        <p className="mt-4 text-2xl">Configure watchfolder on cloud or your local.</p>
                    </div>
                    <button className="mt-4 bg-customGrey text-customCardBlue-700 px-4 py-2 rounded-3xl hover:bg-gray-100 text-lg">
                        Setup Watchfolder
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Main