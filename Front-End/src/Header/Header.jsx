import useAuthStatus from '../hooks/useAuthStatus';
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 Hook
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auth0 hooks
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, user } = useAuthStatus();
  

  return (
    <header className="fitness-header">
      <div className="logo" onClick={() => navigate("/")}>FitZone</div>
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
      </div>
      <nav className={menuOpen ? "nav-mobile open" : "nav-mobile"}>
        <ul className="nav-links">
          <li><button onClick={() => {navigate("/"); setMenuOpen(false);}} className="nav-button">Home</button></li>
          <li><button onClick={() => {navigate("/workout-log"); setMenuOpen(false);}} className="nav-button">Workout Log</button></li>
          <li><button onClick={() => {navigate("/recipe"); setMenuOpen(false);}} className="nav-button">Nutrition Log</button></li>
          <li><button onClick={() => {navigate("/contact"); setMenuOpen(false);}} className="nav-button">Contact</button></li>
        </ul>
      </nav>
      {/* Desktop nav for larger screens */}
      <nav className="nav-desktop">
        <ul className="nav-links">
          <li><button onClick={() => navigate("/")} className="nav-button">Home</button></li>
          <li><button onClick={() => navigate("/workout-log")} className="nav-button">Workout Log</button></li>
          <li><button onClick={() => navigate("/recipe")} className="nav-button">Nutrition Log</button></li>
          <li><button onClick={() => navigate("/contact")} className="nav-button">Contact</button></li>
        </ul>
      </nav>
      {/*  Show Profile Icon if Logged In */}
      {isAuthenticated ? (
        <div className="profile-container">
          <FaUserCircle 
            className="profile-icon" 
            onClick={() => setShowProfile(!showProfile)} 
          />
          {showProfile && (
            <div className="profile-dropdown">
              <p>Welcome, {user.name}!</p>
              <button onClick={() => navigate("/profile")}>My Profile</button>
              <button 
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => loginWithRedirect()}>
            Login
          </button>
          <button className="signup-btn" onClick={() => loginWithRedirect({ screen_hint: "signup" })}>
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
