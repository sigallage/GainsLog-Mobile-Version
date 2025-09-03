import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMobileAuth } from '../../hooks/useMobileAuth';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import './SimpleLoginScreen.css';

const SimpleLoginScreen = () => {
  const { loginWithRedirect } = useAuth0();
  const { login: mobileLogin, isLoading, isMobile } = useMobileAuth();
  const [error, setError] = useState(null);

  const handleMobileLogin = async () => {
    setError(null);
    try {
      console.log('Mobile login button clicked - starting authentication');
      await mobileLogin();
    } catch (error) {
      console.error('Mobile login failed:', error);
      setError('Mobile login failed. Try web login below.');
    }
  };

  const handleWebLogin = async () => {
    setError(null);
    try {
      console.log('Web login button clicked');
      
      // Direct web URL that bypasses Google's mobile browser restrictions
      const webLoginUrl = `https://dev-o87gtr0hl6pu381w.us.auth0.com/authorize?` +
        `response_type=code&` +
        `client_id=xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk&` +
        `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
        `scope=${encodeURIComponent('openid profile email')}&` +
        `audience=${encodeURIComponent('gains-log-api')}&` +
        `connection=google-oauth2`;

      if (isMobile) {
        // Open in external browser for mobile
        await Browser.open({
          url: webLoginUrl,
          windowName: '_system',
          presentationStyle: 'fullscreen'
        });
      } else {
        // Use Auth0's redirect for web
        await loginWithRedirect({
          authorizationParams: {
            connection: 'google-oauth2',
            redirect_uri: window.location.origin,
            scope: 'openid profile email',
            audience: 'gains-log-api'
          }
        });
      }
    } catch (error) {
      console.error('Web login failed:', error);
      setError('Web login failed. Please try again.');
    }
  };

  const handleGuestMode = () => {
    console.log('Guest mode selected');
    localStorage.setItem('guestMode', 'true');
    window.location.reload();
  };

  return (
    <div className="simple-login-screen">
      <div className="login-container">
        <h1 className="app-title">GAINSLOG</h1>
        <p className="app-subtitle">Track Your Fitness Journey</p>
        
        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            background: '#ffe0e0', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <div className="login-methods">
          <button 
            className="login-btn primary" 
            onClick={handleMobileLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : '🔐 Sign In (Recommended)'}
          </button>
          
          <button 
            className="login-btn secondary" 
            onClick={handleWebLogin}
            disabled={isLoading}
          >
            🌐 Web Login (Alternative)
          </button>
          
          <button 
            className="login-btn secondary" 
            onClick={handleGuestMode}
          >
            👤 Continue as Guest
          </button>
          
          <div className="platform-info">
            <small>Platform: {Capacitor.getPlatform()} | Mobile: {isMobile ? 'Yes' : 'No'}</small>
          </div>
        </div>
        
        <div className="login-help">
          <p><strong>Having trouble with Google login?</strong></p>
          <p>
            {isMobile 
              ? '• Try "Recommended" first - opens secure external browser\n• If blocked, use "Web Login" option\n• Guest mode for testing without login'
              : 'Use any login method to authenticate with Auth0'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginScreen;
