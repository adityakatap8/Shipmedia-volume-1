import React from 'react';
import logo from '../../assets/Logo.png';
import user from '../../assets/User1.jpg';

const Navbar1 = ({ user }) => {
    const handleLogout = () => {
        fetch(`https://www.mediashippers.com/api/auth/logout`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to login page or refresh the page
                    window.location.href = '/login';
                } else {
                    console.error('Logout failed:', data.message);
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    };

    return (
        <nav className="bg-white-800 p-2 flex items-center justify-between border-b-4">
            <div className="flex items-center p-1">
                <img src={logo} alt="Logo" className="h-14 w-auto pl-5" />
            </div>
            
            <div className="flex items-center space-x-4 pr-10 pt-2">
                <img src={user?.avatar || user} alt="User Profile" className="h-10 w-10" />
                <span className="text-black">{user?.name}</span>
                <span className="text-gray-600 ml-2">ID: {user?._id.toString()}</span>
                
                {/* Logout button */}
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Logout
                </button>
                <h1>hello</h1>
            </div>
        </nav>
    );
};

export default Navbar1;
