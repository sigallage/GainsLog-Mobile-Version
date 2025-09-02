// src/utils/auth.js
import { Capacitor } from '@capacitor/core';

// More robust platform detection
const isMobilePlatform = () => {
  // Check multiple indicators for mobile platform
  const capacitorNative = Capacitor.isNativePlatform();
  const capacitorPlatform = Capacitor.getPlatform();
  const userAgent = navigator.userAgent;
  const isAndroidApp = userAgent.includes('wv') && userAgent.includes('Android'); // Android WebView
  const hasCapacitorNative = window.Capacitor && window.Capacitor.isNative;
  
  console.log('Platform detection:', {
    capacitorNative,
    capacitorPlatform,
    isAndroidApp,
    hasCapacitorNative,
    userAgent: userAgent.substring(0, 100)
  });
  
  return capacitorNative || capacitorPlatform === 'android' || capacitorPlatform === 'ios' || isAndroidApp || hasCapacitorNative;
};

// Get the appropriate redirect URI based on platform
export const getRedirectUri = () => {
  const isMobile = isMobilePlatform();
  console.log('Is mobile platform:', isMobile);
  
  if (isMobile) {
    return "com.gainslog.app://callback";
  }
  return window.location.origin;
};

// Standard Auth0 configuration for the app
export const getAuth0Config = () => ({
  domain: "dev-o87gtr0hl6pu381w.us.auth0.com",
  clientId: "xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk",
  audience: "gains-log-api",
  scope: "openid profile email write:workouts offline_access"
});

// Helper function for consistent login calls
export const performLogin = async (loginWithRedirect, options = {}) => {
  console.log('Attempting login with redirect URI:', getRedirectUri());
  
  const defaultOptions = {
    authorizationParams: {
      redirect_uri: getRedirectUri(),
      audience: "gains-log-api",
      scope: "openid profile email write:workouts offline_access",
      prompt: "login"
    },
    appState: {
      returnTo: options.returnTo || window.location.pathname
    }
  };

  // Merge with any additional options
  const finalOptions = {
    ...defaultOptions,
    ...options,
    authorizationParams: {
      ...defaultOptions.authorizationParams,
      ...options.authorizationParams
    }
  };

  try {
    await loginWithRedirect(finalOptions);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Helper function for consistent logout calls
export const performLogout = async (logout) => {
  console.log('Attempting logout');
  
  const logoutOptions = {
    logoutParams: {
      returnTo: getRedirectUri(),
      clientId: "xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk"
    }
  };

  try {
    await logout(logoutOptions);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
