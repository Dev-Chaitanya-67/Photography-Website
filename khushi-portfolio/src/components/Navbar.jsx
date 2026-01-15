import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, Menu, User } from "lucide-react"; // Added User Icon
import "../styles/global.css";

const Navbar = ({ toggleLogin, user, onLogout }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  // Simplified Active Check
  const isActive = (path) => location.pathname === path;

  // LOGIC: Handle "My Gallery" click
  const handleGalleryClick = (e) => {
    if (!user) {
      e.preventDefault(); // Stop navigation
      toggleLogin(); // Open Login Modal instead
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo-wrapper">
          <img src="/logo.jpg" alt="Logo" className="nav-logo-img" />
        </Link>

        <div className="nav-links">
          {/* HOME */}  
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>

          {/* COLLECTIONS */}
          <Link
            to="/collections"
            className={`nav-link ${isActive("/collections") ? "active" : ""}`}
          >
            Our Collections
          </Link>

          {/* PACKAGES */}
          <Link
            to="/packages"
            className={`nav-link ${isActive("/packages") ? "active" : ""}`}
          >
            Our Packages
          </Link>

          {/* ARTIST (ABOUT) */}
          <Link
            to="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
          >
            The Artist
          </Link>

          {/* MY GALLERY */}
          <Link
            to="/dashboard"
            onClick={handleGalleryClick}
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            style={{ color: isActive("/dashboard") ? "white" : "var(--accent)" }} 
          >
            My Gallery
          </Link>
        </div>

        <div className="nav-actions">
          {/* LOGIN BUTTON (Only if NOT logged in) */}
          {!user && (
            <button className="btn-login-premium" onClick={toggleLogin}>
              Login
            </button>
          )}

          {/* USER ICON (Only if logged in) - REPLACED TEXT WITH ICON */}
          {user && (
            <Link 
              to="/profile" 
              className="nav-profile-link" 
              title="My Profile"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
               <User size={24} color="var(--accent)" />
            </Link>
          )}

          {/* MOBILE MENU TRIGGER */}
          <button className="menu-trigger-premium" onClick={toggleMenu}>
            <Menu size={28} strokeWidth={1.5} color="white" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <button className="close-menu-btn" onClick={toggleMenu}>
          <X size={24} />
        </button>

        <Link 
            to="/" 
            onClick={toggleMenu}
            className={isActive("/") ? "active-link" : ""}
        >
          Home
        </Link>
        <Link 
            to="/collections" 
            onClick={toggleMenu} 
            className={isActive("/collections") ? "active-link" : ""}
        >
          Our Collections
        </Link>
        <Link 
            to="/packages" 
            onClick={toggleMenu}
            className={isActive("/packages") ? "active-link" : ""}
        >
          Our Packages
        </Link>

        {/* Added Artist Link to Mobile Menu as well */}
        <Link
            to="/about"
            className={isActive("/about") ? "active-link" : ""}
            onClick={toggleMenu}
        >
            The Artist
        </Link>

        {/* Mobile Gallery Link */}
        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active-link" : ""}
          onClick={(e) => {
            toggleMenu();
            handleGalleryClick(e);
          }}
          style={{ color: "var(--accent)" }}
        >
          My Gallery
        </Link>

        <div className="menu-divider"></div>

        {!user ? (
          <button
            className="btn-login-premium"
            onClick={() => {
              toggleMenu();
              toggleLogin();
            }}
          >
            Member Login
          </button>
        ) : (
          <button
            className="btn-login-premium"
            onClick={handleLogoutClick}
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            Log Out
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;