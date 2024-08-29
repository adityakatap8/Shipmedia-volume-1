import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 h-auto bg-white-800 text-black border-r-4">
      <nav className="flex flex-col mt-6 font-medium text-left">
        <Link
          to="/order"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Order Management
        </Link>
        <Link
          to="/job"
          className="py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
        >
          Job Queue
        </Link>
        <Link
          to="/bill"
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
  );
};

export default Sidebar;
