import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setUser } from '../../redux/userSlice/userSlice'; // Import the setUser action
import Sidebar from '../sidebar/Sidebar';
import Navbar1 from '../dashboardNavbar/Navbar1';
import ContentWrapper from '../contentWrapper/ContentWrapper';

const DashboardLayout = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get dispatch function

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      console.log('Checking authentication...');
      
      const token = window.localStorage.getItem("token");
      
      if (!token || !token.trim()) {
        console.log('No valid token found');
        setIsAuthenticated(false);
        return;
      }
      
      try {
        console.log('Fetching user data...');
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setUserData(userData);
        setIsAuthenticated(true);

        // Dispatch to Redux store to save the userId
        dispatch(setUser({ userId: userData.userId, isAuthenticated: true }));

      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFetchData();
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState); 
  };

  return (
    <div className="flex h-screen">
      <ContentWrapper>
        <Navbar1 user={userData} isAuthenticated={isAuthenticated} />
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <aside className={`transition-all ${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white-800`}>
              <Sidebar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            </aside>
            <div className={`flex-1 p-4 ${isSidebarCollapsed ? 'ml-16' : 'ml-0'}`}>
              {children}
            </div>
          </div>
        </main>
      </ContentWrapper>
    </div>
  );
};

export default DashboardLayout;
