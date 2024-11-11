import React from 'react';

const UserProfile = () => {
    return (
        <div className="flex flex-col items-left border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
            <h2 className="text-2xl font-bold p-2 ml-6 text-customCardBlue text-left">User Profile</h2>

            <div className="space-y-2">
                {/* UserProfile */}
                <div className="p-4 text-left">
                    <div className="m-2 p-2">
                        <p className="text-xl text-customCardBlue">
                            Name : <span className='ml-48 text-customCardBlue font-bold'>Alex</span>
                        </p>
                        <p className="text-xl mt-3 text-customCardBlue">
                            Email : <span className='ml-48 text-customCardBlue font-bold'>alex123@gmail.com</span>
                        </p>
                    </div>
                    <div className="text-xl text-customCardBlue m-2 p-2">
                        <p>Password : <span className='ml-40 text-customCardBlue font-bold'>****</span></p>
                    </div>
                    <div className="text-xl text-customCardBlue m-2 p-2">
                    <p> Current Plan : <span className='ml-32 text-customCardBlue font-bold'>Standard Monthly Plan</span></p>
                    </div>
                    <div className="text-xl text-customCardBlue m-2 p-2">
                        <p> Available Credits : <span className='ml-24 text-customCardBlue font-bold'>$100</span></p>
                    </div>
                </div>
            </div>

            <div className="flex justify-start mt-6 ml-4">
                <button className="bg-customCardBlue text-white py-2 px-8 font-bold text-lg rounded-3xl hover:bg-blue-600 transition duration-300">
                    Edit
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
