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
        </div>

    );
}

export default SetupWatchFolder;
