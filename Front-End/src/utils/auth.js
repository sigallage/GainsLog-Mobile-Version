// src/utils/auth.js
import { Capacitor } from '@capacitor/core';

// Get the appropriate redirect URI based on platform
export const getRedirectUri = () => {
  if (Capacitor.isNativePlatform()) {
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
