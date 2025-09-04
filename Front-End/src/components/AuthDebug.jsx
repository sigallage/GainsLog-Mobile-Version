// src/components/AuthDebug.jsx
import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { getRedirectUri } from '../utils/auth';
import useAuthStatus from '../hooks/useAuthStatus';

const AuthDebug = () => {
  const { isAuthenticated, isLoading, user, error } = useAuthStatus();
  const [logs, setLogs] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Log current auth state to console for debugging
    console.log('=== AuthDebug Component State ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isLoading:', isLoading);
    console.log('user:', user);
    console.log('error:', error);
    
    // Update debug info state
    setDebugInfo({
      isAuthenticated,
      isLoading,
      user,
      error,
      timestamp: new Date().toLocaleTimeString()
    });
  }, [isAuthenticated, isLoading, user, error]);

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

  // Always show in development, don't hide in production for now
  // if (process.env.NODE_ENV === 'production') {
  //   return null;
  // }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.95)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 99999,
      maxWidth: '350px',
      maxHeight: '400px',
      overflow: 'auto',
      fontFamily: 'monospace',
      border: '2px solid #4CAF50',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#4CAF50' }}>
        Auth Debug Panel
      </div>
      
      <div><strong>Platform:</strong> {Capacitor.getPlatform()}</div>
      <div><strong>Mobile:</strong> {Capacitor.isNativePlatform() ? 'Yes' : 'No'}</div>
      <div><strong>Loading:</strong> {debugInfo.isLoading ? 'Yes' : 'No'}</div>
      <div><strong>Authenticated:</strong> {debugInfo.isAuthenticated ? 'Yes' : 'No'}</div>
      <div><strong>User:</strong> {debugInfo.user?.name || debugInfo.user?.nickname || 'None'}</div>
      <div><strong>Last Update:</strong> {debugInfo.timestamp || 'Never'}</div>
      
      {debugInfo.error && (
        <div style={{ color: '#f44336', marginTop: '5px' }}>
          <strong>Error:</strong> {debugInfo.error.message}
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
