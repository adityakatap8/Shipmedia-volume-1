import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaVideo, FaClipboardList, FaMoneyBillAlt, FaUserAlt } from 'react-icons/fa'; // Importing some icons

function Menu({ isSidebarCollapsed }) {
  return (
    <div className="flex flex-col mt-6 font-medium text-left">
      <Link
        to="/main"
        className="flex items-center py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
      >
        {/* Show text and icon or only icon based on collapsed state */}
        {!isSidebarCollapsed && <span>Order Management</span>}
        {isSidebarCollapsed && <FaHome className="text-2xl" />}
      </Link>

      <Link
        to="/projects-form"
        className="flex items-center py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
      >
        {!isSidebarCollapsed && <span>Projects</span>}
        {isSidebarCollapsed && <FaProjectDiagram className="text-2xl" />}
      </Link>

      <Link
        to="/video-catalogue"
        className="flex items-center py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
      >
        {!isSidebarCollapsed && <span>Video Catalogue</span>}
        {isSidebarCollapsed && <FaVideo className="text-2xl" />}
      </Link>

      <Link
        to="/job-queue"
        className="flex items-center py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
      >
        {!isSidebarCollapsed && <span>Job Queue</span>}
        {isSidebarCollapsed && <FaClipboardList className="text-2xl" />}
      </Link>

      <Link
        to="/billing"
        className="flex items-center py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
      >
        {!isSidebarCollapsed && <span>Billing</span>}
        {isSidebarCollapsed && <FaMoneyBillAlt className="text-2xl" />}
      </Link>

      <Link
        to="/profile"
        className="flex items-center py-2.5 px-4 text-lg hover:bg-customCardBlue-700 hover:text-white"
      >
        {!isSidebarCollapsed && <span>Profile</span>}
        {isSidebarCollapsed && <FaUserAlt className="text-2xl" />}
      </Link>
    </div>
  );
}

export default Menu;
