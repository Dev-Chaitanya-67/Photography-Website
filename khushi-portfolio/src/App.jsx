/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Collections from "./pages/Collections"; 
import Home from "./pages/Home";
import ClientDashboard from "./pages/ClientDashboard"; 
import LoginModal from "./components/LoginModal"; 
import "./styles/global.css";
import AdminPanel from './pages/AdminPanel';
// import Booking from './pages/Booking'; <--- REMOVED
import UserProfile from './pages/UserProfile';
import Footer from "./components/Footer";
import PackagesPage from "./pages/PackagesPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('currentUser');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      
      <Navbar 
        toggleLogin={() => setLoginOpen(true)} 
        user={currentUser}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Home toggleLogin={() => setLoginOpen(true)} />} />
        
        <Route path="/collections" element={<Collections />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/about" element={<div className="pt-20 bg-[#050505] min-h-screen"><About /></div>} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* <Route path="/booking" element={<Booking />} />  <--- REMOVED */}
        <Route path="/profile" element={<UserProfile />} />
      </Routes>

      <Footer/>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess} 
      />

    </Router>
  );
}

export default App;