import useAuthStatus from '../hooks/useAuthStatus';
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 Hook
import { performLogin, performLogout } from "../utils/auth";
import { useMobileAuth } from "../hooks/useMobileAuth";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../components/ui/sheet";
import "../components/ui/sheet.css";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Auth0 hooks
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, isLoading, user } = useAuthStatus();
  const { login: mobileLogin, logout: mobileLogout, isMobile } = useMobileAuth();

  // Listen for auth state changes
  React.useEffect(() => {
    const handleAuthStateChange = (event) => {
      console.log('Auth state change event received:', event.detail);
      // Force a re-render to update the UI
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

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
  }, [isAuthenticated, isLoading, user, forceUpdate]);

  const handleLogin = async () => {
    console.log('Header login clicked');
    try {
      if (isMobile) {
        // Use the improved mobile login with external browser
        await mobileLogin();
      } else {
        await performLogin(loginWithRedirect, {
          returnTo: window.location.pathname
        });
      }
    } catch (error) {
      console.error('Header login failed:', error);
      // Show user-friendly error
      alert('Login failed. Please try the alternative login options in the app.');
    }
  };

  const handleSignup = async () => {
    console.log('Header signup clicked');
    try {
      if (isMobile) {
        await mobileLogin();
      } else {
        await performLogin(loginWithRedirect, {
          returnTo: window.location.pathname,
          authorizationParams: {
            screen_hint: "signup"
          }
        });
      }
    } catch (error) {
      console.error('Header signup failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (isMobile) {
        mobileLogout();
      } else {
        await performLogout(logout);
      }
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
                  className="sheet-auth-button logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="sheet-auth-options">
                  <h4>Sign In to GainsLog</h4>
                  <button 
                    className="sheet-auth-button primary-login" 
                    onClick={() => {handleLogin(); setMenuOpen(false);}}
                  >
                    Sign In with Google
                  </button>
                  <button 
                    className="sheet-auth-button secondary-login" 
                    onClick={() => {handleSignup(); setMenuOpen(false);}}
                  >
                    Create Account
                  </button>
                  <button 
                    className="sheet-auth-button guest-btn" 
                    onClick={() => {
                      localStorage.setItem('guestMode', 'true');
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Continue as Guest
                  </button>
                  <small className="auth-note">
                    Sign in to save your workouts and track progress
                  </small>
                </div>
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
