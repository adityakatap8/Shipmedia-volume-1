import React from 'react';

const PaymentSummary = () => {
    return (
        <div className="flex flex-col items-left border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
            <h2 className="text-2xl font-bold p-4 mb-4 text-customCardBlue text-left">Payment Summary</h2>

            <div className="space-y-4">
                {/* Payment Summary Card */}
                <div className="p-4 text-left border-2 rounded-3xl border-customGrey-300">
                    <div className="mb-2 m-2 p-2">
                        <p className="text-xl text-customCardBlue">
                            Plan Chosen : <span className='ml-24 text-customCardBlue font-bold'>Standard Monthly Plan</span>
                        </p>
                        <p className="text-xl mt-3 text-customCardBlue">
                            Conversion points : <span className='ml-16 text-customCardBlue font-bold'>60</span>
                        </p>
                    </div>
                    <div className="text-xl text-customCardBlue m-2 p-2">
                        <p>Total Amount : <span className='ml-24 text-customCardBlue font-bold'>$120</span></p>
                        <p className='mt-2 ml-40 px-2 py-2 font-bold'> + </p>
                        <p>Tax : <span className='ml-48 text-customCardBlue font-bold'>$10</span></p>
                    </div>
                    <div className="text-3xl font-bold text-customCardBlue m-2 p-2 mt-4">
                        Total Payable: <span className="text-3xl ml-6">$130</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button className="bg-customCardBlue text-white py-2 px-8 font-bold text-lg rounded-3xl hover:bg-blue-600 transition duration-300">
                    Proceed
                </button>
            </div>
        </div>
    );
};

export default PaymentSummary;
