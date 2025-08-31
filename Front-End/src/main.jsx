import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import App from './App';

// Initialize mobile app if running on native platform
if (Capacitor.isNativePlatform()) {
  // Configure status bar
  StatusBar.setStyle({ style: Style.Dark });
  
  // Hide splash screen when app is ready
  SplashScreen.hide();
}

// Determine redirect URI based on platform
const getRedirectUri = () => {
  if (Capacitor.isNativePlatform()) {
    // Use a simpler, more reliable callback URL for mobile
    return "com.gainslog.app://callback";
  }
  return window.location.origin;
};

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
  domain="dev-o87gtr0hl6pu381w.us.auth0.com"
  clientId="xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk"
  authorizationParams={{
    redirect_uri: getRedirectUri(),
    audience: "gains-log-api",
    scope: "openid profile email write:workouts offline_access"
  }}
  useRefreshTokens={true}
  cacheLocation="localstorage"
  onRedirectCallback={(appState) => {
    console.log('Auth0 callback received:', appState);
    // For mobile, just reload the app to refresh auth state
    if (Capacitor.isNativePlatform()) {
      window.location.reload();
    } else {
      window.location.href = appState?.returnTo || window.location.pathname;
    }
  }}
>
    <App />
  </Auth0Provider>
);