import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import './SimpleLogin.css';

const SimpleLoginScreen = ({ onClose }) => {
  const { loginWithRedirect } = useAuth0();
  const isMobile = Capacitor.isNativePlatform();

  const handleWebLogin = async () => {
    try {
      // For mobile, we'll use a different approach - redirect to web version
      if (isMobile) {
        // Open the web version of the app in system browser for login
        window.open('https://gainslog-web.vercel.app', '_system');
      } else {
        await loginWithRedirect();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGuestMode = () => {
    // Create a guest session with limited features
    localStorage.setItem('guestMode', 'true');
    onClose();
  };

  return (
    <div className="simple-login-overlay">
      <div className="simple-login-container">
        <div className="login-header">
          <h2>Welcome to GainsLog</h2>
          <p>Choose how you'd like to continue</p>
        </div>

        <div className="login-options">
          <button className="login-btn primary" onClick={handleWebLogin}>
            {isMobile ? 'Login via Web Browser' : 'Login with Auth0'}
          </button>
          
          <button className="login-btn secondary" onClick={handleGuestMode}>
            Continue as Guest
          </button>
          
          <button className="login-btn tertiary" onClick={onClose}>
            Cancel
          </button>
        </div>

        {isMobile && (
          <div className="mobile-note">
            <p>📱 For the best login experience, we'll open your web browser</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleLoginScreen;
