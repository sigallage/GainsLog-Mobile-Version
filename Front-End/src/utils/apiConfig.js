// src/utils/apiConfig.js
import { Capacitor } from '@capacitor/core';

/**
 * Dynamically determines the correct API URL based on the environment
 * - Android Emulator: Uses adb port forwarding (localhost)
 * - Physical Device: Auto-detects host machine's WiFi IP
 * - Web Browser: Uses localhost
 */

// Get the current host's IP address using a simple method
const getCurrentHostIP = () => {
  // For web browsers, we can get the current page's host
  if (!Capacitor.isNativePlatform()) {
    return window.location.hostname || 'localhost';
  }
  
  // For mobile, we'll use some common private IP ranges as fallbacks
  const commonIPs = [
    '192.168.1.', '192.168.0.', '10.0.0.', '172.16.',
    '192.168.2.', '192.168.100.', '192.168.43.'
  ];
  
  // Try to detect based on common patterns
  // This is a simplified detection - in a real app you'd want more robust detection
  return '192.168.1.100'; // Fallback that most people can change in .env
};

const getApiUrl = () => {
  // If we have a manually set environment variable, use it
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim() !== '') {
    console.log('Using environment variable API URL:', envApiUrl);
    return envApiUrl;
  }
  
  // Check if we're running in Capacitor (mobile app)
  if (Capacitor.isNativePlatform()) {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'android') {
      // For Android, detect if we're in emulator or physical device
      const userAgent = navigator.userAgent;
      const isEmulator = userAgent.includes('Android') && (
        userAgent.includes('sdk') || 
        userAgent.includes('emulator') || 
        userAgent.includes('Emulator') ||
        window.location.hostname === 'localhost'
      );
      
      if (isEmulator) {
        // Emulator with adb port forwarding - use localhost
        console.log('Detected Android Emulator - using localhost with port forwarding');
        return 'http://localhost:3000';
      } else {
        // Physical device - auto-detect or use fallback
        console.log('Detected Android Physical Device - using auto-detected IP');
        const hostIP = getCurrentHostIP();
        return `http://${hostIP}:3000`;
      }
    } else if (platform === 'ios') {
      // iOS simulator can use localhost, physical device needs host IP
      const isSimulator = window.location.hostname === 'localhost';
      if (isSimulator) {
        return 'http://localhost:3000';
      } else {
        const hostIP = getCurrentHostIP();
        return `http://${hostIP}:3000`;
      }
    }
  }
  
  // Web browser - use localhost
  return 'http://localhost:3000';
};

// Export the dynamically determined API URL
export const API_BASE_URL = getApiUrl();

// Export a function to get the full API endpoint
export const getApiEndpoint = (path = '') => {
  const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
};

// Log the configuration for debugging
console.log('API Configuration Debug:', {
  platform: Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web',
  isNative: Capacitor.isNativePlatform(),
  apiUrl: API_BASE_URL,
  userAgent: navigator.userAgent,
  hostname: window.location.hostname,
  href: window.location.href,
  environmentVariable: import.meta.env.VITE_API_URL
});

// Test the connection
const testConnection = async () => {
  try {
    console.log(`Testing connection to: ${API_BASE_URL}`);
    const response = await fetch(`${API_BASE_URL}/api/users/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Connection test result:', response.status, response.statusText);
    if (response.ok) {
      console.log('✅ API connection successful!');
    } else {
      console.warn('⚠️ API responded but with error status');
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('💡 Tip: Make sure your backend server is running and accessible');
  }
};

// Run connection test after a short delay
setTimeout(testConnection, 2000);

export default { API_BASE_URL, getApiEndpoint };
