import React from 'react';

const PlanCards = () => {
    return (
        <div className="flex flex-col items-left border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
            {/* Remaining Conversion Credits Section */}
            <div className="w-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center bg-customCardBlue text-white p-3 border-2 rounded-3xl">
                    <span>Remaining Conversion Credits :</span>
                    <span>0</span>
                </div>
                <p className="mt-3 text-red-600 border-2 rounded-3xl">
                    Your job and watch folder processing has stopped due to insufficient credit points. Purchase additional credit points to resume the services.
                </p>
            </div>

            <div className='mt-2 ml-8 text-left'>
                <h1 className='text-xl font-bold mb-4 text-customCardBlue'>Active plan</h1>
                <div className="bg-white p-3 rounded-3xl border-2 border-customCardBlue">
                    <p className='ml-32'>Purchase a plan to reactivate your services.
                    <button className="ml-48 text-right bg-customCardBlue font-bold text-white py-3 px-12 rounded-3xl hover:bg-blue-600 transition duration-300">
                        Buy Now
                    </button>
                    </p>
                </div>
            </div>

            {/* Plans Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="bg-customCardBlue p-4 ml-8 rounded-3xl shadow-md text-center text-white w-64 h-80">
                    <h3 className="text-xl font-bold">Core</h3>
                    <h3 className='text-xl font-semibold'>(on demand)</h3>
                    <p className="text-base mt-2">Each Credit = $2/GB</p>
                    <p className="text-base mt-2">Unlimited Conversions</p>
                    <p className="text-base mt-2">Minimum Credits 25 Watchfolder</p>
                    <button className="w-40 mt-4 bg-white font-bold  text-customCardBlue py-2 px-4 rounded-3xl border border-customCardBlue hover:bg-blue-700 hover:text-white transition duration-300">
                        Buy Now
                    </button>
                </div>

                <div className="bg-customCardBlue p-4 ml-8 rounded-3xl shadow-md text-center text-white w-64 h-80">
                    <h3 className="text-xl font-bold">Standard</h3>
                    <p className="text-base mt-4">$199/ month</p>
                    <p className="text-base mt-3">Each Credit = $1.5/GB</p>
                    <p className="text-base mt-3">Unlimited Conversions Watchfolder</p>
                    <button className="w-40 mt-3 bg-white font-bold  text-customCardBlue py-2 px-4 rounded-3xl border border-customCardBlue hover:bg-blue-700 hover:text-white transition duration-300">
                        Buy Now
                    </button>
                </div>

                <div className="bg-customCardBlue p-4 ml-8 rounded-3xl shadow-md text-center text-white w-64 h-80">
                    <h3 className="text-xl font-bold">Premium</h3>
                    <p className="text-base mt-4">$399/ month</p>
                    <p className="text-base mt-3">Each Credit = $1/GB</p>
                    <p className="text-base mt-3">Unlimited Conversions Watchfolder</p>
                    <button className="w-40 mt-3 bg-white font-bold  text-customCardBlue py-2 px-4 rounded-3xl border border-customCardBlue hover:bg-blue-700 hover:text-white transition duration-300">
                        Buy Now
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PlanCards;
