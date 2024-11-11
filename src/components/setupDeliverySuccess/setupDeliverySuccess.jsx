import React from 'react';
import greenTickMark from '../../assets/greenTickMark.png';

const SetupDeliverySuccess = () => {
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
                    Destination URL Added Successfully
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
            <div className='d-flex'>
                <button className="py-2 px-4 bg-customCardBlue text-white font-bold border-gray-300 rounded-full border-2 ml-5">
                    Save
                </button>
                <button className="py-2 px-4 bg-customCardBlue text-white font-bold border-gray-300 rounded-full border-2 ml-5">
                    Schedule Order
                </button>
                <button className="py-2 px-4 bg-customOrange text-white font-bold border-gray-300 rounded-full border-2 ml-5">
                    Execute
                </button>
            </div>
        </div>
    );
};

export default SetupDeliverySuccess;
