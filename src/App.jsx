import React from 'react';
import './App.css';
import Home from './pages/homePage/Home';
import { BrowserRouter as Router, Route, Routes,useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./pages/registerPage/Register"
import Plans from './pages/plans/Plans';

function App() {
  return (
    <Router>
    <ConditionalNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/plans" element={<Plans />} />
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