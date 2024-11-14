import React from 'react'
import LOGO from '../../assets/LOGO.png';
import user from '../../assets/User1.jpg';
import Navbar1 from '../dashboardNavbar/Navbar1';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <div className="flex flex-col min-h-screen w-64 bg-white-800 text-black border-r-4">
      <nav className="flex flex-col mt-6 font-medium text-left">
        <Link
          to="/main"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Order Management
        </Link>
        <Link
          to="/video-catalogue"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Video Catalogue
        </Link>
        <Link
          to="/job-queue"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Job Queue
        </Link>
        <Link
          to="/billing"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Billing
        </Link>
        <Link
          to="/profile"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Profile
        </Link>
      </nav>
    </div>
    </div>
  )
}

export default Menu
