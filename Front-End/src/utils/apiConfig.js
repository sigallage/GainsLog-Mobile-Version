// src/utils/apiConfig.js
import { Capacitor } from '@capacitor/core';

/**
 * Dynamically determines the correct API URL based on the environment
 * - Android Emulator: Uses 10.0.2.2:5000 (emulator's way to access host)
 * - Physical Device: Uses your WiFi IP address
 * - Web Browser: Uses localhost
 */
const getApiUrl = () => {
  // If we have a manually set environment variable, use it
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  // Check if we're running in Capacitor (mobile app)
  if (Capacitor.isNativePlatform()) {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'android') {
      // Try to detect if we're in an emulator vs physical device
      // This is a heuristic - you might need to adjust based on your setup
      const userAgent = navigator.userAgent || '';
      const isEmulator = userAgent.includes('Android') && (
        userAgent.includes('sdk') || 
        userAgent.includes('emulator') ||
        userAgent.includes('AVD') ||
        window.location.hostname === 'localhost'
      );
      
      if (isEmulator) {
        // Android emulator - use special IP to access host machine
        console.log('Detected Android Emulator - using 10.0.2.2:5000');
        return 'http://10.0.2.2:5000';
      } else {
        // Physical Android device - use WiFi IP
        console.log('Detected Physical Android Device - using WiFi IP');
        return envApiUrl || 'http://172.27.0.174:5000';
      }
    } else if (platform === 'ios') {
      // iOS simulator can use localhost, physical device needs WiFi IP
      const isSimulator = window.location.hostname === 'localhost';
      if (isSimulator) {
        return 'http://localhost:5000';
      } else {
        return envApiUrl || 'http://172.27.0.174:5000';
      }
    }
  }
  
  // Web browser - use localhost or environment variable
  return envApiUrl || 'http://localhost:5000';
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
console.log('API Configuration:', {
  platform: Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web',
  isNative: Capacitor.isNativePlatform(),
  apiUrl: API_BASE_URL,
  userAgent: navigator.userAgent
});

export default { API_BASE_URL, getApiEndpoint };
