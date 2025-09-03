import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMobileAuth } from '../hooks/useMobileAuth';
import { Capacitor } from '@capacitor/core';

const AuthDebugPanel = () => {
  const { isAuthenticated, user, isLoading, error } = useAuth0();
  const { login, logout, isMobile } = useMobileAuth();

  const handleLogin = async () => {
    try {
      console.log('Starting login from debug panel...');
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Auth Debug Panel</div>
      
      <div>Platform: {Capacitor.getPlatform()}</div>
      <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user?.email || 'None'}</div>
      {error && <div style={{ color: '#ff6b6b' }}>Error: {error.message}</div>}
      
      <div style={{ marginTop: '10px' }}>
        {!isAuthenticated ? (
          <button 
            onClick={handleLogin}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            style={{
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthDebugPanel;
