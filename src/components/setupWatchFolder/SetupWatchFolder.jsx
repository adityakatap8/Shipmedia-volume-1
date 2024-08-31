import React, { useState } from 'react';

function SetupWatchFolder() {
    const [useS3, setUseS3] = useState(false);

    return (
        <div>
            <div className="flex flex-col items-left border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
                <h1 className="text-lg font-semibold mb-4 text-left text-customCardBlue">
                    Add WatchFolder Title
                </h1>
                <div className="w-50">
                    <input
                        type="text"
                        value=""
                        readOnly
                        className="w-full border-2 rounded-3xl border-customGrey-300 px-3 py-2 text-center"
                    />
                </div>

                <div className='mt-4'>
                    <h1 className="text-lg font-semibold mb-4 text-left text-customCardBlue">
                        Setup your source folder
                    </h1>
                </div>
                <hr></hr>
                <div className='mt-4'>
                    <h1 className="text-lg font-semibold mb-4 text-left text-customCardBlue">
                        Point us to your source folder
                    </h1>
                    <div className="w-50">
                        <input
                            type="text"
                            value=""
                            readOnly
                            className="w-full border-2 rounded-3xl border-customGrey-300 px-3 py-2 text-center"
                        />
                    </div>
                    <div className="mt-4 text-left">
                        <input
                            id="s3-checkbox"
                            type="checkbox"
                            checked={useS3}
                            onChange={() => setUseS3(!useS3)}
                            className="ml-2"
                        />
                        <label
                            htmlFor="s3-checkbox"
                            className="text-gray-700 text-sm font-bold ml-2"
                        >
                            Amazon S3
                        </label>
                    </div>
                </div>
                <div className='mt-4'>
                    <h1 className="text-lg font-semibold mb-4 text-left text-customCardBlue">
                        Show source path only
                    </h1>
                    <input
                        type="text"
                        placeholder="Key"
                        className="border border-gray-300 rounded-2xl py-1 px-4 w-full mt-2"
                    />
                    <input
                        type="text"
                        placeholder="Secret"
                        className="border border-gray-300 rounded-2xl py-1 px-4 w-full mt-3"
                    />
                    <input
                        type="text"
                        placeholder="Path"
                        className="border border-gray-300 rounded-2xl py-1 px-4 w-full mt-3"
                    />
                    <input
                        type="text"
                        placeholder="Region"
                        className="border border-gray-300 rounded-2xl py-1 px-4 w-full mt-3"
                    />
                </div>

            </div>
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Add WatchFolder Title
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder=""
                        />
                    </div>

                    <hr className="my-4" />

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Setup Your Source Folder
                        </label>
                        <div className="flex items-center mb-3">
                            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1 4v-4m4 4h-1v-4h-1m1 4v-4m1-10h-2a2 2 0 00-2 2v6H7a2 2 0 00-2 2v2h14v-2a2 2 0 00-2-2h-1v-6a2 2 0 00-2-2z"
                                    />
                                </svg>
                            </button>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-3"
                                type="text"
                                placeholder="Point Us To You Source Folder"
                            />
                        </div>

                        <div className="mb-6">
                            <input
                                id="s3-checkbox"
                                type="checkbox"
                                checked={useS3}
                                onChange={() => setUseS3(!useS3)}
                                className="mr-2 leading-tight"
                            />
                            <label
                                htmlFor="s3-checkbox"
                                className="text-gray-700 text-sm font-bold"
                            >
                                Amazon S3
                            </label>
                        </div>

                        {useS3 && (
                            <div>
                                <div className="mb-4">
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="Key"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="Secret"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="Path"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="Region"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SetupWatchFolder;
