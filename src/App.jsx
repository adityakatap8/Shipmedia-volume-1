import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/homePage/Home';
import Register from './pages/registerPage/Register';
import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';

function App() {
  return (
    <Router>
    <ConditionalNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  
  // Hide Navbar on the /register route
  if (location.pathname === '/register') {
    return null;
  }
  
  return <Navbar />;
}

export default App;
