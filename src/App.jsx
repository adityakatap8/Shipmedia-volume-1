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

// // Import individual components
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
//   userProfile,
//   orderSummary,
//   projects,
//   projectsForm,
//   projectsDashboard,
//   viewAndEditForm
// } from './pages/mainPage/Main';

// import ProtectedRoute from './components/protectedRoutes/ProtectedRoutes';
// import BrowseFestival from './components/browseFestival/BrowseFestival';
// // import ShakaPlayer from './components/shakaplayer/src/App';

// function App() {
//   return (
//     <UserProvider>
//       <AuthProvider>
//         <Router>
//           <ConditionalNavbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/plans" element={<Plans />} />
//             <Route path="/login" element={<Login />} />
//             <Route path='/dashnav' element={<Navbar1 />} />
//             <Route path="/main" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {orderManagement()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/job-queue" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {jobQueue()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/profile" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {profile()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/billing" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {billing()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/tabs-on-demand" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {mainTabsOndemand()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/tabs-watch-folder" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {mainTabsWatchfolder()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/video-catalogue" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {catalogue()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/listing-table" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {listingTable()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/jobQueue-table" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {jobQueueTable()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/order-summary" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {orderSummary()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             {/* <Route path="/projects" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {projects()} </DashboardLayout>
//               </ProtectedRoute>
//             } /> */}
//             <Route path="/projects" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {projectsDashboard()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/projects-form" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {projectsForm()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route path="/view-form" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {viewAndEditForm()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//             <Route
//               path="/view-form/:projectId"
//               element={
//                 <ProtectedRoute>
//                   <DashboardLayout>
//                   {viewAndEditForm()}
//                   </DashboardLayout>
//                 </ProtectedRoute>
//               }
//             />
//              <Route path="/browse-festival" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {BrowseFestival()} </DashboardLayout>
//               </ProtectedRoute>
//             } />
//              {/* <Route path="/showcase" element={
//               <ProtectedRoute>
//                 <DashboardLayout> {  <ShakaPlayer />} </DashboardLayout>
//               </ProtectedRoute>
//             } /> */}
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

//   if (showNavbar) {
//     return <Navbar />;
//   } else {
//     return null;
//   }
// }

// export default App;



import React from 'react';
import './App.css';
import Home from './pages/homePage/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./pages/registerPage/Register";
import Plans from './pages/plans/Plans';
import Navbar1 from './components/dashboardNavbar/Navbar1';
import Login from './pages/loginPage/Login';
import Sidebar from './components/sidebar/Sidebar';
import DashboardLayout from './components/dashboardLayout/DashboardLayout';
import { AuthProvider } from './utils/AuthContext';
import { UserProvider } from './contexts/UserContext';

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
import {PlayerMenu} from "../src/components/shakaPlayer/components/PlayerMenu"




const queryClient = new QueryClient();

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
            <Route path='/dashnav' element={<Navbar1 />} />
            <Route path="/projects" element={
              <ProtectedRoute>
                <DashboardLayout> {projectsDashboard()} </DashboardLayout>
              </ProtectedRoute>
            } />
          
            <Route path="/main" element={
              <ProtectedRoute>
                <DashboardLayout> {orderManagement()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/job-queue" element={
              <ProtectedRoute>
                <DashboardLayout> {jobQueue()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout> {profile()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <DashboardLayout> {billing()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/tabs-on-demand" element={
              <ProtectedRoute>
                <DashboardLayout> {mainTabsOndemand()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/tabs-watch-folder" element={
              <ProtectedRoute>
                <DashboardLayout> {mainTabsWatchfolder()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/video-catalogue" element={
              <ProtectedRoute>
                <DashboardLayout> {catalogue()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/listing-table" element={
              <ProtectedRoute>
                <DashboardLayout> {listingTable()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/jobQueue-table" element={
              <ProtectedRoute>
                <DashboardLayout> {jobQueueTable()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/order-summary" element={
              <ProtectedRoute>
                <DashboardLayout> {orderSummary()} </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects-form" element={
              <ProtectedRoute>
                <DashboardLayout> {projectsForm()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/view-form" element={
              <ProtectedRoute>
                <DashboardLayout> {viewAndEditForm()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/view-form/:projectId" element={
              <ProtectedRoute>
                <DashboardLayout>
                  {viewAndEditForm()}
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/browse-festival" element={
              <ProtectedRoute>
                <DashboardLayout> {BrowseFestival()} </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/showcase" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Showcase />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Search />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Categories />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/showcase-projects" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Showcase />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/showcase-projects" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Showcase />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/series/:seriesId" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SeriesDetails />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/movie/:projectId" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MovieDetails />
                </DashboardLayout>
              </ProtectedRoute>
            } />           
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  const showNavbarRoutes = ['/'];
  const showNavbar = showNavbarRoutes.includes(location.pathname);

  if (showNavbar) {
    return <Navbar />;
  } else {
    return null;
  }
}

export default App;
