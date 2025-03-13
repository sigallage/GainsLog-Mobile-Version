import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (token exists in localStorage)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fitness-header">
      <div className="logo" onClick={() => navigate("/")}>FitZone</div>
      <nav>
        <ul className="nav-links">
          <li><button onClick={() => navigate("/")} className="nav-button">Home</button></li>
          <li><button onClick={() => navigate("/workout-log")} className="nav-button">Workouts</button></li>
        </ul>
      </nav>

      {/*  Show Profile Icon if Logged In */}
      {isLoggedIn ? (
        <div className="profile-container">
          <FaUserCircle className="profile-icon" onClick={() => navigate("/profile")} />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}
    </header>
  );
};

export default Header;
