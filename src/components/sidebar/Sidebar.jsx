import React from 'react';
import Menu from '../dashboardMenu/Menu';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Importing the arrow icons
import './index.css'; // Import your custom stylesheet

const Sidebar = ({ isSidebarCollapsed, toggleSidebar }) => {
  return (
    <div className="sidebar"> {/* Apply the sidebar class */}
      <div
        className={`${
          isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`} // Add class based on collapse state
      >
        {/* Menu component */}
        <Menu isSidebarCollapsed={isSidebarCollapsed} />

        {/* Button to toggle sidebar visibility */}
        <button
          onClick={toggleSidebar}
          className={`p-2 mt-4 mx-auto rounded-full bg-blue-500 text-white focus:outline-none ${
            isSidebarCollapsed ? 'w-10' : 'w-32' // Adjust width for the expanded state
          } flex items-center justify-center`} // Flex container to align items inline
        >
          {isSidebarCollapsed ? (
            <FaArrowRight className="text-white text-2xl" /> // Arrow pointing right when collapsed
          ) : (
            <>
              <FaArrowLeft className="text-white text-2xl inline" /> {/* Left arrow */}
              <span className="ml-2 text-white text-sm">Collapse</span> {/* Collapse text */}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
