import React from "react";
import "../Footer/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa"; // Import icons

const Footer = () => {
  return (
    <footer className="fitness-footer">
      <div className="footer-content">
        <div className="footer-logo">GainsLog</div>

        <nav>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#workouts">Workouts</a></li>
            <li><a href="#nutrition">Nutrition</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="social-icons">
          <a href="#" className="social-icon"><FaFacebookF /></a>
          <a href="#" className="social-icon"><FaTwitter /></a>
          <a href="#" className="social-icon"><FaInstagram /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 GainsLog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
