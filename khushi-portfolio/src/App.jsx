/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Packages from "./components/Packages";
import About from "./components/About";
import Collections from "./pages/Collections"; 
import Home from "./pages/Home";
import ClientDashboard from "./pages/ClientDashboard"; 
import LoginModal from "./components/LoginModal"; 
import "./styles/global.css";
import AdminPanel from './pages/AdminPanel';
import Booking from './pages/Booking';
import UserProfile from './pages/UserProfile';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Check for logged-in user when App loads
  useEffect(() => {
    const session = localStorage.getItem('currentUser');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  // 2. Helper to handle login success (updates UI instantly)
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setLoginOpen(false);
  };

  // 3. Helper to handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      
      {/* Pass 'currentUser' to Navbar so it knows what to show */}
      <Navbar 
        toggleLogin={() => setLoginOpen(true)} 
        user={currentUser}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/about" element={<div className="pt-20 bg-[#050505] min-h-screen"><About /></div>} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>

      <footer>
        <div style={{fontFamily: "var(--font-head)", fontSize: "2rem", color: "white", marginBottom: "1rem"}}>KHUSHI</div>
        <p style={{ fontSize: "0.9rem" }}>&copy; 2026 Khushi Cinematic Photography.</p>
      </footer>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess} // Pass this new function
      />

    </Router>
  );
}

export default App;