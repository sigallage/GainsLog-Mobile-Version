import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import "./Header.css";

const Header = ({ isLoggedIn, setIsLoggedIn }) => { //Receive props from App.js
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("userId");
    setIsLoggedIn(false); //Update global login state
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fitness-header">
      <div className="logo" onClick={() => navigate("/")}>FitZone</div>
      <nav>
        <ul className="nav-links">
          <li><button onClick={() => navigate("/")} className="nav-button">Home</button></li>
          <li><button onClick={() => navigate("/workout-log")} className="nav-button">Workout Log</button></li>
          <li><button onClick={() => navigate("/nutrition-log")} className="nav-button">Nutrition Log</button></li>
          <li><button onClick={() => navigate("/contact")} className="nav-button">Contact</button></li>
        </ul>
      </nav>

      {/* Show Profile Icon if Logged In */}
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
