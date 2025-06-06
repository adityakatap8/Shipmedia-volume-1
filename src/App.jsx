import React, { useEffect } from 'react';  // Importing useEffect from React
import './App.css';
import Home from './pages/homePage/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./pages/registerPage/Register";
import Plans from './pages/plans/Plans';
import Login from './pages/loginPage/Login';
import Sidebar from './components/sidebar/Sidebar';
import DashboardLayout from './components/dashboardLayout/DashboardLayout';
import { AuthProvider } from './utils/AuthContext';
import { UserProvider } from './contexts/UserContext';
import logger from './utils/logger';  // Importing the logger utility

import {
  orderManagement,
  jobQueue,
  billing,
  profile,
  mainTabsWatchfolder,
  catalogue,
  mainTabsOndemand,
  listingTable,
  jobQueueTable,
  orderSummary,
  projectsForm,
  projectsDashboard,
  viewAndEditForm,
  userOrganizationManagement,
  dealDashboard,
  cartPage,
  dealDetails
} from './pages/mainPage/Main';

import ProtectedRoute from './components/protectedRoutes/ProtectedRoutes';
import BrowseFestival from './components/browseFestival/BrowseFestival';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Showcase from "./components/shakaPlayer/pages/Showcase";
import Categories from "../src/components/shakaPlayer/pages/Categories";
import Search from "../src/components/shakaPlayer/pages/Search";
import MovieDetails from "../src/components/shakaPlayer/pages/MovieDetails";
import SeriesDetails from "../src/components/shakaPlayer/pages/SeriesDetails";
import ShakaPlayer from "../src/components/shakaPlayer/pages/ShakaPlayer";
import { Toaster } from "../src/components/shakaPlayer/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/shakaPlayer/components/ui/sonner";
import { PlayerMenu } from "../src/components/shakaPlayer/components/PlayerMenu";
import ForgotPassword from './pages/forgotPasswordPage/forgotPassword';
import { Navebar1 } from './components/dashboardNavbar/Navbar1';
import UserManagement from './components/userManagement/managementPanel/UserManagement';


const queryClient = new QueryClient();

// Define ShakaPlayer Routes
const ShakaPlayerRoutes = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Showcase />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:categoryId" element={<Categories />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
      <Route path="/series/:seriesId" element={<SeriesDetails />} />
      <Route path="/player/:type/:id" element={<ShakaPlayer />} />
      <Route path="/PlayerMenu" element={<PlayerMenu />} />
    </Routes>
  </QueryClientProvider>
);

function App() {
  // Log app initialization when the app is loaded
  useEffect(() => {
    logger.log('App initialized');
  }, []);

  return (
    <UserProvider>
      <AuthProvider>
        <Router>
          <ConditionalNavbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/login" element={<Login />} />
            <Route path='/dashnav' element={<Navebar1 />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/projects" element={
              <ProtectedRoute>
                <DashboardLayout>{projectsDashboard()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/main" element={
              <ProtectedRoute>
                <DashboardLayout>{orderManagement()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/job-queue" element={
              <ProtectedRoute>
                <DashboardLayout>{jobQueue()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout>{profile()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <DashboardLayout>{billing()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/tabs-on-demand" element={
              <ProtectedRoute>
                <DashboardLayout>{mainTabsOndemand()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/tabs-watch-folder" element={
              <ProtectedRoute>
                <DashboardLayout>{mainTabsWatchfolder()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/video-catalogue" element={
              <ProtectedRoute>
                <DashboardLayout>{catalogue()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/listing-table" element={
              <ProtectedRoute>
                <DashboardLayout>{listingTable()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/jobQueue-table" element={
              <ProtectedRoute>
                <DashboardLayout>{jobQueueTable()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/order-summary" element={
              <ProtectedRoute>
                <DashboardLayout>{orderSummary()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/projects-form" element={
              <ProtectedRoute>
                <DashboardLayout>{projectsForm()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/view-form" element={
              <ProtectedRoute>
                <DashboardLayout>{viewAndEditForm()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/view-form/:projectId" element={
              <ProtectedRoute>
                <DashboardLayout>{viewAndEditForm()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/browse-festival" element={
              <ProtectedRoute>
                <DashboardLayout>{BrowseFestival()}</DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/showcase" element={
              <ProtectedRoute>
                <DashboardLayout><Showcase /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <DashboardLayout><Search /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute>
                <DashboardLayout><Categories /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/showcase-projects" element={
              <ProtectedRoute>
                <DashboardLayout><Showcase /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/series/:seriesId" element={
              <ProtectedRoute>
                <DashboardLayout><SeriesDetails /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/movie/:projectId" element={
              <ProtectedRoute>
                <DashboardLayout><MovieDetails /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute>
                <DashboardLayout><UserManagement /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/user-org-register" element={
              <ProtectedRoute>
                <DashboardLayout>{userOrganizationManagement()}</DashboardLayout></ProtectedRoute>} />

            <Route path="/deals" element={
              <ProtectedRoute>
                <DashboardLayout>{dealDashboard()}</DashboardLayout></ProtectedRoute>} />

            <Route path="/cart" element={
              <ProtectedRoute>
                <DashboardLayout>{cartPage()}</DashboardLayout></ProtectedRoute>} />
            <Route path="/deal-details/:dealId" element={
              <ProtectedRoute>
                <DashboardLayout>{dealDetails()}</DashboardLayout></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  useEffect(() => {
    logger.log('Navigated to:', location.pathname); // Log when the user navigates to a new route
  }, [location]);

  const showNavbarRoutes = ['/'];
  const showNavbar = showNavbarRoutes.includes(location.pathname);

  if (showNavbar) {
    return null;
  } else {
    return null;
  }
}

export default App;




// import React from 'react';
// import './App.css';
// import Home from './pages/homePage/Home';
// import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
// import Navbar from './components/navbar/Navbar';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Register from "./pages/registerPage/Register";
// import Plans from './pages/plans/Plans';
// import Navbar1 from './components/dashboardNavbar/Navbar1';
// import Login from './pages/loginPage/Login';
// import Sidebar from './components/sidebar/Sidebar';
// import DashboardLayout from './components/dashboardLayout/DashboardLayout';
// import { AuthProvider } from './utils/AuthContext';
// import { UserProvider } from './contexts/UserContext';

// import {
//   orderManagement,
//   jobQueue,
//   billing,
//   profile,
//   mainTabsWatchfolder,
//   catalogue,
//   mainTabsOndemand,
//   listingTable,
//   jobQueueTable,
//   orderSummary,
//   projectsForm,
//   projectsDashboard,
//   viewAndEditForm,
// } from './pages/mainPage/Main';

// import BrowseFestival from './components/browseFestival/BrowseFestival';

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Showcase from "./components/shakaPlayer/pages/Showcase";
// import Categories from "../src/components/shakaPlayer/pages/Categories";
// import Search from "../src/components/shakaPlayer/pages/Search";
// import MovieDetails from "../src/components/shakaPlayer/pages/MovieDetails";
// import SeriesDetails from "../src/components/shakaPlayer/pages/SeriesDetails";
// import ShakaPlayer from "../src/components/shakaPlayer/pages/ShakaPlayer";
// import { Toaster } from "../src/components/shakaPlayer/components/ui/toaster";
// import { Toaster as Sonner } from "../src/components/shakaPlayer/components/ui/sonner";
// import { PlayerMenu } from "../src/components/shakaPlayer/components/PlayerMenu";

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <UserProvider>
//       <AuthProvider>
//         <Router>
//           <ConditionalNavbar />
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/plans" element={<Plans />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashnav" element={<Navbar1 />} />

//             {/* Routes using DashboardLayout, no auth protection */}
//             <Route path="/projects" element={<DashboardLayout>{projectsDashboard()}</DashboardLayout>} />
//             <Route path="/main" element={<DashboardLayout>{orderManagement()}</DashboardLayout>} />
//             <Route path="/job-queue" element={<DashboardLayout>{jobQueue()}</DashboardLayout>} />
//             <Route path="/profile" element={<DashboardLayout>{profile()}</DashboardLayout>} />
//             <Route path="/billing" element={<DashboardLayout>{billing()}</DashboardLayout>} />
//             <Route path="/tabs-on-demand" element={<DashboardLayout>{mainTabsOndemand()}</DashboardLayout>} />
//             <Route path="/tabs-watch-folder" element={<DashboardLayout>{mainTabsWatchfolder()}</DashboardLayout>} />
//             <Route path="/video-catalogue" element={<DashboardLayout>{catalogue()}</DashboardLayout>} />
//             <Route path="/listing-table" element={<DashboardLayout>{listingTable()}</DashboardLayout>} />
//             <Route path="/jobQueue-table" element={<DashboardLayout>{jobQueueTable()}</DashboardLayout>} />
//             <Route path="/order-summary" element={<DashboardLayout>{orderSummary()}</DashboardLayout>} />
//             <Route path="/projects-form" element={<DashboardLayout>{projectsForm()}</DashboardLayout>} />
//             <Route path="/view-form" element={<DashboardLayout>{viewAndEditForm()}</DashboardLayout>} />
//             <Route path="/view-form/:projectId" element={<DashboardLayout>{viewAndEditForm()}</DashboardLayout>} />
//             <Route path="/browse-festival" element={<DashboardLayout>{BrowseFestival()}</DashboardLayout>} />
//             <Route path="/showcase" element={<DashboardLayout><Showcase /></DashboardLayout>} />
//             <Route path="/search" element={<DashboardLayout><Search /></DashboardLayout>} />
//             <Route path="/categories" element={<DashboardLayout><Categories /></DashboardLayout>} />
//             <Route path="/showcase-projects" element={<DashboardLayout><Showcase /></DashboardLayout>} />
//             <Route path="/series/:seriesId" element={<DashboardLayout><SeriesDetails /></DashboardLayout>} />
//             <Route path="/movie/:projectId" element={<DashboardLayout><MovieDetails /></DashboardLayout>} />
//             <Route path="/player/:type/:id" element={<DashboardLayout><ShakaPlayer /></DashboardLayout>} />
//             <Route path="/PlayerMenu" element={<DashboardLayout><PlayerMenu /></DashboardLayout>} />
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </UserProvider>
//   );
// }

// function ConditionalNavbar() {
//   const location = useLocation();
//   const showNavbarRoutes = ['/'];
//   const showNavbar = showNavbarRoutes.includes(location.pathname);

//   return showNavbar ? <Navbar /> : null;
// }

// export default App;

