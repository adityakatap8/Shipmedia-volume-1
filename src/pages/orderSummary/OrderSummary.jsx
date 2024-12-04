import React, { useState } from 'react';
import "./index.css";

const OrderSummary = () => {
    // Dummy data for the selected source and cloud details
    const dummyFileName = "sample-file.txt"; // Dummy file name for file upload option
    const cloudDetails = {
        cloudName: "AWS",
        accessKey: "AKIAEXAMPLEKEY",
        secretKey: "EXAMPLESECRETKEY",
        region: "us-west-1",
    };

    return (
        <div className="mx-auto">
            <div className='text-left text-2xl pb-4 mt-2'>
                <h4>Order Summary</h4>
            </div>

            <div className="border-2 rounded-3xl border-customGrey-300 p-4 mt-4 mb-4 flex flex-col">
                {/* Wrapper for Selected Source / File Name */}
                <div>
                    {/* Selected Source / File Name with blur effect */}
                    <div className="text-blue-500 text-sm font-bold blur-title text-left">
                        Selected Source / File Name
                    </div>
                    
                    {/* Input field for the file name */}
                    <input 
                        type="text" 
                        className="mt-2 p-2 border-2 rounded-lg border-gray-300 w-full"
                        value={dummyFileName} 
                        readOnly
                    />

                    {/* Cloud details box */}
                    <div className="mt-4 p-4 border-2 rounded-lg border-gray-300">
                        {/* Cloud service name */}
                        <div className="text-sm font-bold text-left">Cloud Storage (AWS)</div>
                        
                        {/* Display cloud details */}
                        <div className="mt-2">
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Cloud Service</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.cloudName}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Access Key</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.accessKey}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Secret Key</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.secretKey}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Region</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.region}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional sections below */}
                <div className="mt-6 border-2 rounded-3xl border-customGrey-300 p-4 mt-4 mb-4 flex flex-col">
                    {/* Compartment 1: Codec Service */}
                    <div className="flex-1 border-r-2 border-dotted border-gray-300 p-4 flex flex-col justify-start items-start">
                        <h5 className="text-lg font-bold">Codec Service</h5>

                        {/* Cards inside Codec Service */}
                        <div className="flex flex-wrap justify-start mt-2">
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Codec 1</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Codec 2</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Codec 3</h6>
                            </div>
                        </div>
                    </div>

                    {/* Compartment 2: Quality Checks */}
                    <div className="flex-1 border-r-2 border-dotted border-gray-300 p-4 flex flex-col justify-start items-start">
                        <h5 className="text-lg font-bold">Quality Checks</h5>

                        {/* Cards inside Quality Checks */}
                        <div className="flex flex-wrap justify-start mt-2">
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Check 1</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Check 2</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Check 3</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Check 4</h6>
                            </div>
                        </div>
                    </div>

                    {/* Compartment 3: File Transfer */}
                    <div className="flex-1 p-4 flex flex-col justify-start items-start">
                        <h5 className="text-lg font-bold">File Transfer</h5>

                        {/* Cards inside File Transfer */}
                        <div className="flex flex-wrap justify-start mt-2">
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Transfer 1</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Transfer 2</h6>
                            </div>
                            <div className="card p-2 m-2 border border-gray-300 rounded-lg w-24 text-center">
                                <h6 className="text-sm font-medium">Transfer 3</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Destination Location with blur effect */}
                <div>
                    {/* Selected Source / File Name with blur effect */}
                    <div className="text-blue-500 text-sm font-bold blur-title text-left">
                        Selected Source / File Name
                    </div>
                    
                    {/* Input field for the file name */}
                    <input 
                        type="text" 
                        className="mt-2 p-2 border-2 rounded-lg border-gray-300 w-full"
                        value={dummyFileName} 
                        readOnly
                    />

                    {/* Cloud details box */}
                    <div className="mt-4 p-4 border-2 rounded-lg border-gray-300">
                        {/* Cloud service name */}
                        <div className="text-sm font-bold text-left">Cloud Storage (AWS)</div>
                        
                        {/* Display cloud details */}
                        <div className="mt-2">
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Cloud Service</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.cloudName}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Access Key</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.accessKey}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Secret Key</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.secretKey}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs font-medium text-left">Region</label>
                                    <div className="p-2 border-2 rounded-lg border-gray-300 w-48 text-left">
                                        {cloudDetails.region}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
