import React, { useContext, useState } from 'react';
import BlueButton from '../../components/blueButton/BlueButton';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

function Main() {
    const { userData, isLoading, setIsLoading, isAuthenticated } = useContext(UserContext);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (type) => {
        const allowedTypes = ['on-demand', 'watch-folder', 'video-catalogue'];

        if (!isAuthenticated) {
            console.error('User not authenticated');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            console.log('Sending request body:', {
                userId: userData.userId,
                userEmail: userData.email,
                type: type.toLowerCase()
            });

            const response = await fetch('http://localhost:3000/api/ordertype/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId: userData.userId,
                    userEmail: userData.email,
                    type: type.toLowerCase()
                })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Order submitted successfully:', data);

            let navigatePath;
            if (type === 'video-catalogue') {
                setSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
                setTimeout(() => {
                    setSuccessMessage(null);
                    navigate('/video-catalogue'); // Direct navigation without tabs
                }, 3000);
            } else {
                setSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
                setTimeout(() => {
                    setSuccessMessage(null);
                    navigate(`/tabs-${type.toLowerCase()}`);
                }, 3000);
            }
        } catch (err) {
            console.error('Error submitting order:', err);
            setError(`Failed to create ${type}. Please try again.`);
            if (err.message.includes('Invalid type')) {
                setError(err.message);
            }
            setTimeout(() => {
                setError(null);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto">
            <div className='text-left text-2xl pb-4 mt-2'>
                <h4>Order Management</h4>
            </div>
            
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {error && <p className="text-red-600">{error}</p>}
            <form onSubmit={(e) => handleSubmit('on-demand')}>
                <div className="border-2 rounded-3xl border-customGrey-300 p-2 mt-4 mb-4 flex">
                    {/* First Card */}
                    <div className="w-1/2 p-4 ml-20 mt-3 mb-3 flex flex-col justify-between bg-customCardBlue-700 text-white rounded-3xl w-64 h-[24rem] text-left">
                        <div>
                            <h2 className="text-3xl font-semibold mb-2">Create a new order</h2>
                            <p className="mt-4 text-xl">Add source URL or upload your files directly.</p>
                        </div>
                        <Link 
                            to='/tabs-on-demand'
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit('on-demand');
                            }}
                            className="mt-4 bg-white text-customCardBlue-700 px-4 py-2 rounded-3xl hover:bg-gray-100 text-xl"
                        >
                            Create Order
                        </Link>
                    </div>
                    {/* Vertical Dotted Line */}
                  
                    {/* Second Card */}
                    <div className="w-1/2 p-4 ml-40 mt-3 mb-3 flex flex-col justify-between bg-customCardBlue-700 text-white rounded-3xl w-64 h-[24rem] text-left">
                        <div>
                            <h2 className="text-3xl font-semibold mb-2">Setup a watch folder</h2>
                            <p className="mt-4 text-xl">Configure watchfolder on cloud or your local.</p>
                        </div>
                        <Link 
                            to='/tabs-watchfolder'
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit('watch-folder');
                            }}
                            className="mt-4 bg-white text-customCardBlue-700 px-4 py-2 rounded-3xl hover:bg-gray-100 text-xl"
                        >
                            Create Watchfolder
                        </Link>
                    </div>
                    {/* Third Card */}
                    {/* <div className="w-1/3 p-4 ml-20 mt-3 mb-3 flex flex-col justify-between bg-customCardBlue-700 text-white rounded-3xl w-64 h-[24rem] text-left">
                        <div>
                            <h2 className="text-3xl font-semibold mb-2">Create Video Catalogue</h2>
                            <p className="mt-4 text-xl">Set up a video catalogue for easy access and management.</p>
                        </div>
                        <Link 
                            to='/video-catalogue'
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit('video-catalogue');
                            }}
                            className="mt-4 bg-white text-customCardBlue-700 px-4 py-2 rounded-3xl hover:bg-gray-100 text-xl"
                        >
                            Create Video Catalogue
                        </Link>
                    </div> */}
                </div>
            </form>
        </div>
    );
}

export default Main;
