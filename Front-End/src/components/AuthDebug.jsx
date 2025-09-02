// src/components/AuthDebug.jsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import { getRedirectUri } from '../utils/auth';

const AuthDebug = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth0();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Capture console logs for debugging
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setLogs(prev => [...prev.slice(-4), args.join(' ')].slice(0, 5));
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev.slice(-4), `ERROR: ${args.join(' ')}`].slice(0, 5));
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '350px',
      maxHeight: '300px',
      overflow: 'auto',
      fontFamily: 'monospace'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#4CAF50' }}>
        🔍 Auth Debug Panel
      </div>
      
      <div><strong>Platform:</strong> {Capacitor.isNativePlatform() ? '📱 Mobile' : '💻 Web'}</div>
      <div><strong>Redirect URI:</strong> {getRedirectUri()}</div>
      <div><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</div>
      <div><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
      <div><strong>User:</strong> {user?.name || 'None'}</div>
      <div><strong>Current URL:</strong> {window.location.href}</div>
      
      {error && (
        <div style={{ color: '#f44336', marginTop: '5px' }}>
          <strong>❌ Error:</strong> {error.message}
        </div>
      )}
      
      <div style={{ marginTop: '10px', borderTop: '1px solid #555', paddingTop: '5px' }}>
        <strong>Recent Logs:</strong>
        {logs.map((log, index) => (
          <div key={index} style={{ fontSize: '10px', color: '#ccc', marginTop: '2px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthDebug;
