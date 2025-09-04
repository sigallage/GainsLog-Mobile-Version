// src/components/AuthStateManager.jsx
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';

const AuthStateManager = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    getAccessTokenSilently,
    loginWithRedirect,
    error 
  } = useAuth0();
  
  const [authChecks, setAuthChecks] = useState(0);
  const [tokenStatus, setTokenStatus] = useState('unknown');

  useEffect(() => {
    if (!isLoading) {
      checkAuthState();
    }
  }, [isLoading, isAuthenticated]);

  const checkAuthState = async () => {
    console.log('=== Auth State Check ===');
    console.log('Authenticated:', isAuthenticated);
    console.log('Loading:', isLoading);
    console.log('User:', user?.name);
    console.log('Platform:', Capacitor.isNativePlatform() ? 'Mobile' : 'Web');
    
    setAuthChecks(prev => prev + 1);

    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "gains-log-api",
            scope: "openid profile email write:workouts offline_access"
          }
        });
        console.log('Token obtained successfully:', token ? 'Yes' : 'No');
        setTokenStatus('success');
      } catch (error) {
        console.error('Token fetch failed:', error);
        setTokenStatus('failed');
        
        if (error.error === "login_required") {
          console.log('Login required, user needs to re-authenticate');
        }
      }
    } else {
      setTokenStatus('not_authenticated');
    }
  };

  const forceReauth = async () => {
    console.log('Forcing re-authentication');
    try {
      await loginWithRedirect({
        authorizationParams: {
          prompt: "login",
          redirect_uri: Capacitor.isNativePlatform() ? "com.gainslog.app://callback" : window.location.origin,
          audience: "gains-log-api",
          scope: "openid profile email write:workouts offline_access"
        }
      });
    } catch (error) {
      console.error('Force reauth failed:', error);
    }
  };

  // Only show in development and if there are auth issues
  if (process.env.NODE_ENV === 'production' || (isAuthenticated && tokenStatus === 'success')) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: isAuthenticated ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 10000,
      maxWidth: '250px',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        Auth Status
      </div>
      
      <div>Auth: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Loading: {isLoading ? 'Loading' : 'Ready'}</div>
      <div>Token: {tokenStatus === 'success' ? 'Valid' : tokenStatus === 'failed' ? 'Invalid' : 'Unknown'}</div>
      <div>Checks: {authChecks}</div>
      
      {error && (
        <div style={{ color: '#ffeb3b', marginTop: '5px', fontSize: '10px' }}>
          Error: {error.message}
        </div>
      )}
      
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={checkAuthState}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            marginRight: '5px',
            cursor: 'pointer'
          }}
        >
          Check Auth
        </button>
        
        {!isAuthenticated && (
          <button 
            onClick={forceReauth}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Force Login
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthStateManager;
