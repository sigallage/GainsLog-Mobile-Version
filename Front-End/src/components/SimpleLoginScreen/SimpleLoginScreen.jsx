import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMobileAuth } from '../../hooks/useMobileAuth';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import './SimpleLoginScreen.css';

const SimpleLoginScreen = () => {
  const { loginWithRedirect } = useAuth0();
  const { login: mobileLogin, isLoading, isMobile } = useMobileAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Clear messages after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleMobileLogin = async () => {
    setError(null);
    setSuccess(null);
    setButtonLoading(true);
    
    try {
      console.log('Mobile login button clicked - starting authentication');
      setSuccess('Opening secure browser for authentication...');
      await mobileLogin();
    } catch (error) {
      console.error('Mobile login failed:', error);
      setError('Mobile login failed. Try web login below or check your connection.');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleWebLogin = async () => {
    setError(null);
    setSuccess(null);
    setButtonLoading(true);
    
    try {
      console.log('Web login button clicked');
      setSuccess('Redirecting to authentication...');
      
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
      setError('Web login failed. Please try again or check your connection.');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleGuestMode = () => {
    console.log('Guest mode selected');
    setSuccess('Entering guest mode...');
    localStorage.setItem('guestMode', 'true');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const isAnyLoading = isLoading || buttonLoading;

  return (
    <div className="simple-login-screen">
      <div className="login-container">
        <h1 className="app-title">GAINSLOG</h1>
        <p className="app-subtitle">Track Your Fitness Journey</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <div className="login-methods">
          <button 
            className={`login-btn primary ${isAnyLoading ? 'loading' : ''}`}
            onClick={handleMobileLogin}
            disabled={isAnyLoading}
          >
            {isAnyLoading ? '' : 'Sign In with Google (Recommended)'}
          </button>
          
          <button 
            className={`login-btn secondary ${isAnyLoading ? 'loading' : ''}`}
            onClick={handleWebLogin}
            disabled={isAnyLoading}
          >
            {isAnyLoading ? '' : 'Web Login (Alternative)'}
          </button>
          
          <button 
            className="login-btn guest" 
            onClick={handleGuestMode}
            disabled={isAnyLoading}
          >
            Continue as Guest
          </button>
        </div>
        
        <div className="platform-info">
          Platform: {isMobile ? 'Mobile' : 'Web'} • {isMobile ? 'Android' : 'Browser'}
        </div>
        
        <div className="login-help">
          <p><strong>Recommended:</strong> Uses your device's secure browser</p>
          <p><strong>Alternative:</strong> Fallback web authentication</p>
          <p><strong>Guest Mode:</strong> Explore app features without account</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginScreen;
