import React from 'react';
import greenTickMark from '../../assets/greenTickMark.png';

const SourceFolderSuccess = () => {
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
            Source URL Added Successfully
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

        {/* Details Section */}
        <div className="flex flex-col items-center border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-5">
            <div className="grid grid-cols-2 gap-5 mb-4">
            <div className='text-left'>
                <div className="text-black-500">Title</div>
                <div className="text-customCardBlue font-bold">Uploaded filename title</div>
            </div>
            <div className='text-left'>
                <div className="text-black-500">Category</div>
                <div className="text-customCardBlue font-bold">Movie</div>
            </div>
            <div  className='text-left'>
                <div className="text-black-500">Genre</div>
                <div className="text-customCardBlue font-bold">Action</div>
            </div>
            <div  className='text-left'>
                <div className="text-black-500">Language</div>
                <div className="text-customCardBlue font-bold">English</div>
            </div>
            <div className='text-left'>
                <div className="text-black-500">Auxiliary File</div>
                <div className="text-customCardBlue font-bold">Filename.mp3</div>
            </div>
            <div className='text-left'>
                <div className="text-black-500">Subtitles / Closed Caption</div>
                <div className="text-customCardBlue font-bold">uploaded filename.type</div>
            </div>
            <div  className='text-left'>
                <div className="text-black-500">Audio</div>
                <div className="text-customCardBlue font-bold">Filename.mp3</div>
            </div>
            </div>

            <div className="flex justify-center">
            <button className="bg-customCardBlue text-white py-2 px-4 rounded-3xl hover:bg-blue-600">
                Edit
            </button>
            </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
                <button
                className="py-2 px-5 bg-customCardBlue text-white rounded-3xl mr-4 mb-2"
                >
                Next
                </button>
        </div>
    </div>
  );
};

export default SourceFolderSuccess;
