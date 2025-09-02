// src/components/AuthDebug.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import { getRedirectUri } from '../utils/auth';

const AuthDebug = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth0();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>Platform: {Capacitor.isNativePlatform() ? 'Mobile' : 'Web'}</div>
      <div>Redirect URI: {getRedirectUri()}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user?.name || 'None'}</div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default AuthDebug;
