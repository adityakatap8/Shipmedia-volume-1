import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaProjectDiagram,
  FaVideo,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

function Menu({ isSidebarCollapsed }) {
  const [isFilmProjectsOpen, setFilmProjectsOpen] = useState(false);
  const [isFilmServicesOpen, setFilmServicesOpen] = useState(false); // State for "Film Services"

  const handleFilmProjectsClick = () => {
    setFilmProjectsOpen(!isFilmProjectsOpen);
  };

  const handleFilmServicesClick = () => {
    setFilmServicesOpen(!isFilmServicesOpen);
  };

  return (
    <div className="flex flex-col mt-6 font-medium text-left">
      {/* Film Projects */}
      <div>
        <Link
          to="/projects"
          className="flex items-center py-2.5 px-4 text-lg"
          onClick={handleFilmProjectsClick}
        >
          {!isSidebarCollapsed && (
            <>
              <span>Film Projects</span>
              {isFilmProjectsOpen ? (
                <FaChevronUp className="ml-auto" />
              ) : (
                <FaChevronDown className="ml-auto" />
              )}
            </>
          )}
          {isSidebarCollapsed && <FaProjectDiagram className="text-2xl" />}
        </Link>

        {/* Submenu for Film Projects */}
        {!isSidebarCollapsed && isFilmProjectsOpen && (
          <div className="ml-6">
            <Link to="/video-catalogue" className="block py-2.5 px-4 text-lg">
              Project File Upload
            </Link>
          </div>
        )}
      </div>

      {/* Film Services */}
      <div>
        <Link
        to="/main"
          className="flex items-center py-2.5 px-4 text-lg"
          onClick={handleFilmServicesClick}
        >
          {!isSidebarCollapsed && (
            <>
              <span>Film Services</span>
              {/* {isFilmServicesOpen ? (
                <FaChevronUp className="ml-auto" />
              ) : (
                <FaChevronDown className="ml-auto" />
              )} */}
            </>
          )}
          {isSidebarCollapsed && <FaHome className="text-2xl" />}
        </Link>

        {/* No submenus for Film Services anymore */}
      </div>

      {/* Film Showcase */}
      <Link
        to="/showcase-projects"
        className="flex items-center py-2.5 px-4 text-lg"
      >
        {!isSidebarCollapsed && <span>Film Showcase</span>}
        {isSidebarCollapsed && <FaVideo className="text-2xl" />}
      </Link>

      <Link
        to="/usermanagement"
        className="flex items-center py-2.5 px-4 text-lg"
      >
        {!isSidebarCollapsed && <span>User Management</span>}
        {isSidebarCollapsed && <FaVideo className="text-2xl" />}
      </Link>

      {/* Profile */}
      {/* <Link
        to="/profile"
        className="flex items-center py-2.5 px-4 text-lg"
      >
        {!isSidebarCollapsed && <span>Profile</span>}
        {isSidebarCollapsed && <FaUserAlt className="text-2xl" />}
      </Link> */}
    </div>
  );
}

export default Menu;
