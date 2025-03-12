import React from "react";
import { useNavigate } from "react-router-dom";
import "../Header/Header.css";
import HomePage from "../HomePage/home.jsx";


const Header = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <header className="fitness-header">
      <div className="logo">FitZone</div>
      <nav>
        <ul className="nav-links">
          <li><button onClick={() => navigate("/")} className="nav-button">Home</button></li>
          <li><button onClick={() => navigate("/")} className="nav-button">Workouts</button></li>
          <li><button onClick={() => navigate("/")} className="nav-button">Nutrition</button></li>
          <li><button onClick={() => navigate("/")} className="nav-button">Contact</button></li>
        </ul>
      </nav>

      <div className="authButton">
      <button className="login-btn" onClick={() => navigate("/Login")}>Login</button>
      <button className="signup-btn" onClick={() => navigate("/Signup")}>Sign Up</button>
      </div>

    </header>
  );
};

export default Header;
