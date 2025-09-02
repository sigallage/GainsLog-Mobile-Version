import useAuthStatus from '../hooks/useAuthStatus';
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 Hook
import { performLogin, performLogout } from "../utils/auth";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../components/ui/sheet";
import "../components/ui/sheet.css";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auth0 hooks
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, isLoading, user } = useAuthStatus();

  // Add more detailed debugging
  console.log('Header auth state:', { isAuthenticated, isLoading, user: user?.name });
  
  // Check if we're authenticated but not showing it
  if (isAuthenticated && user) {
    console.log('User is authenticated:', user.name);
  } else if (!isAuthenticated && !isLoading) {
    console.log('User is not authenticated');
  }

  // Debug auth state changes
  React.useEffect(() => {
    console.log('=== Auth State Check ===');
    console.log('Authenticated:', isAuthenticated);
    console.log('Loading:', isLoading);
    console.log('User:', user?.name);
    console.log('Platform: Mobile');
  }, [isAuthenticated, isLoading, user]);

  const handleLogin = async () => {
    console.log('Header login clicked');
    try {
      await performLogin(loginWithRedirect, {
        returnTo: window.location.pathname
      });
    } catch (error) {
      console.error('Header login failed:', error);
    }
  };

  const handleSignup = async () => {
    console.log('Header signup clicked');
    try {
      await performLogin(loginWithRedirect, {
        returnTo: window.location.pathname,
        authorizationParams: {
          screen_hint: "signup"
        }
      });
    } catch (error) {
      console.error('Header signup failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await performLogout(logout);
    } catch (error) {
      console.error('Header logout failed:', error);
    }
  };
  

  return (
    <header className="fitness-header">
      <div className="logo" onClick={() => navigate("/")}>GainsLog</div>
      
      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={() => setMenuOpen(true)}>
        <FaBars size={28} />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetClose onClick={() => setMenuOpen(false)}>
              <FaTimes />
            </SheetClose>
          </SheetHeader>
          
          <div className="sheet-nav-menu">
            <button onClick={() => {navigate("/"); setMenuOpen(false);}} className="sheet-nav-button">
              Home
            </button>
            <button onClick={() => {navigate("/workout-log"); setMenuOpen(false);}} className="sheet-nav-button">
              Workout Log
            </button>
            <button onClick={() => {navigate("/recipe"); setMenuOpen(false);}} className="sheet-nav-button">
              Nutrition Log
            </button>
            <button onClick={() => {navigate("/exercises"); setMenuOpen(false);}} className="sheet-nav-button">
              Exercises
            </button>
            <button onClick={() => {navigate("/workout-history"); setMenuOpen(false);}} className="sheet-nav-button">
              Workout History
            </button>
            <button onClick={() => {navigate("/workout-generator"); setMenuOpen(false);}} className="sheet-nav-button">
              Generate Workout
            </button>
            <button onClick={() => {navigate("/contact"); setMenuOpen(false);}} className="sheet-nav-button">
              Contact
            </button>
          </div>

          <div className="sheet-auth-section">
            {isLoading ? (
              <div className="sheet-profile-info">
                <p>Loading...</p>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="sheet-profile-info">
                  <p>Welcome, {user?.name || 'User'}!</p>
                </div>
                <button onClick={() => {navigate("/profile"); setMenuOpen(false);}} className="sheet-nav-button">
                  My Profile
                </button>
                <button 
                  onClick={() => {handleLogout(); setMenuOpen(false);}}
                  className="sheet-auth-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="sheet-auth-button" onClick={() => {handleLogin(); setMenuOpen(false);}}>
                  Login
                </button>
                <button className="sheet-auth-button" onClick={() => {handleSignup(); setMenuOpen(false);}}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop nav for larger screens */}
      <nav className="nav-desktop">
        <ul className="nav-links">
          <li><button onClick={() => navigate("/")} className="nav-button">Home</button></li>
          <li><button onClick={() => navigate("/workout-log")} className="nav-button">Workout Log</button></li>
          <li><button onClick={() => navigate("/recipe")} className="nav-button">Nutrition Log</button></li>
          <li><button onClick={() => navigate("/contact")} className="nav-button">Contact</button></li>
        </ul>
      </nav>
      
      {/*  Show Profile Icon if Logged In (Desktop) */}
      {isLoading ? (
        <div className="auth-buttons desktop-only">
          <span>Loading...</span>
        </div>
      ) : isAuthenticated ? (
        <div className="profile-container desktop-only">
          <FaUserCircle 
            className="profile-icon" 
            onClick={() => setShowProfile(!showProfile)} 
          />
          {showProfile && (
            <div className="profile-dropdown">
              <p>Welcome, {user?.name}!</p>
              <button onClick={() => navigate("/profile")}>My Profile</button>
              <button 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-buttons desktop-only">
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
          <button className="signup-btn" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
