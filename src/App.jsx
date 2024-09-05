import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/homePage/Home';
import Register from './pages/registerPage/Register';
import Login from './pages/loginPage/Login';
import Main from './pages/mainPage/Main';
import AdminPage from './pages/adminPage/AdminPage';

import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Navbar1 from './components/navbar1/Navbar1';
import SetupSourceFolder from './components/setupSourceFolder/SetupSourceFolder';
import SourceFolderSuccess from './components/sourceFolderSuccess/SourceFolderSuccess';
import FileUploadSuccess from './components/fileUploadSuccess/FileUploadSuccess';
import VideoAudioSettings from './components/videoAudioSettings/VideoAudioSettings';
import SetupDelivery from './components/setupDelivery/SetupDelivery';
import SetupDeliverySuccess from './components/setupDeliverySuccess/setupDeliverySuccess';
import ListingTable from './components/listingTable/ListingTable';
import JobQueueTable from './components/jobQueueTable/JobQueueTable';
import SetupWatchFolder from './components/setupWatchFolder/SetupWatchFolder';
import PlanCards from './components/planCards/PlanCards';
import PaymentSummary from './components/paymentSummary/PaymentSummary';
import UserProfile from './components/userProfile/UserProfile';
import CodecSettings from './components/codecSettings/CodecSettings';

function App() {
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<TestWithSidebar />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  
  // Hide Navbar on the /register route
  if (location.pathname === '/register' || location.pathname === '/login' || location.pathname === '/main') {
    return null;
  }
  else{
    return <Navbar />;
  } 
}

// Create a new component to include both Navbar1 and Sidebar on /test
function TestWithSidebar() {
  return (
    <div>
      <Navbar1 />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow">
          <CodecSettings />
        </main>
      </div>
    </div>
  );
}


export default App;