import React from 'react';
import './App.css';
import Home from './pages/homePage/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./pages/registerPage/Register"
import Plans from './pages/plans/Plans';
import Navbar1 from './components/dashboardNavbar/Navbar1';
import Login from './pages/loginPage/Login';
import Sidebar from './components/sidebar/Sidebar'
import Main from './pages/mainPage/Main';
import DashboardLayout from './components/dashboardLayout/DashboardLayout'
import JobQueue from '../src/components/jobQueueTable/JobQueueTable';
import Profile from './pages/profile/Profile';
import Billing from './pages/billing/Billing';
import OrderManagement from './pages/mainPage/Main';
import MainTabsOndemand from './components/tabs-onDemand/MainTabs-ondemand';
import MainTabsWatchfolder from './components/tabs-watchFolder/MainTabs-watchfolder';
import Catalogue from './components/tabs-catalogue/MainTabs-Catalogue';
import ListingTable from './components/listingTable/ListingTable';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoutes';
import { AuthProvider } from './utils/AuthContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path='' element={<DashboardLayout />} />
          <Route path="/dashnav" element={<Navbar1 />} />
          <Route path="/main" element={
            <ProtectedRoute>
              <DashboardLayout> <Main.orderManagement /> </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/job-queue" element={
            <ProtectedRoute>
              <DashboardLayout> <Main.jobQueueTable /> </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<ProtectedRoute>
            <DashboardLayout> <Main.profile /> </DashboardLayout>
          </ProtectedRoute>
          } />
          <Route path="/billing" element={<ProtectedRoute>
            <DashboardLayout> <Main.billing /> </DashboardLayout>
          </ProtectedRoute>
          } />
          <Route path="/tabs-on-demand" element={<ProtectedRoute>
            <DashboardLayout> <Main.mainTabsOndemand /> </DashboardLayout>
          </ProtectedRoute>
          } />
          <Route path="/tabs-watch-folder" element={<ProtectedRoute>
            <DashboardLayout> <Main.mainTabsWatchfolder /> </DashboardLayout>
          </ProtectedRoute>
          } />
          <Route path="/video-catalogue" element={<ProtectedRoute>
            <DashboardLayout> <Main.catalogue /> </DashboardLayout>
          </ProtectedRoute>
          } />
          <Route path="/listing-table" element={<ProtectedRoute>
            <DashboardLayout> <Main.listingTable /> </DashboardLayout>
          </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
    </UserProvider>
  );
}

// function ConditionalNavbar() {
//   const location = useLocation();

//   // Define the routes for showing the Sidebar
//   // const sidebarRoutes = ['/plans', '/main', '/job-queue','/profile', '/billing'];

//   // Define the routes where Navbar should be hidden
//   const hideNavbarRoutes = ['/register', '/login', '/main', '/job-queue', '/profile', '/billing', '/tabs-on-demand', '/tabs-watchfolder', '/listing-table', '/jobQueue-table'];

//   // Show Sidebar for specific routes
//   // if (sidebarRoutes.includes(location.pathname)) {
//   //   return <Sidebar />;
//   // }

//   // Hide Navbar on specific routes
//   if (hideNavbarRoutes.includes(location.pathname)) {
//     return null;
//   }

//   // Default: Show Navbar
//   return <Navbar />;
// }

function ConditionalNavbar() {
  const location = useLocation();

  // Define the routes where Navbar should be shown
  const showNavbarRoutes = ['/'];

  // Determine whether to show Navbar or nothing at all
  const showNavbar = showNavbarRoutes.includes(location.pathname);

  if (showNavbar) {
    return <Navbar />;
  } else {
    return null;
  }
}
export default App;