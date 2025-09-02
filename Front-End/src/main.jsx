import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { getRedirectUri } from './utils/auth';
import App from './App';

// Improved platform detection
const isMobilePlatform = () => {
  const capacitorNative = Capacitor.isNativePlatform();
  const capacitorPlatform = Capacitor.getPlatform();
  const isAndroidApp = navigator.userAgent.includes('wv') && navigator.userAgent.includes('Android');
  const hasCapacitorNative = window.Capacitor && window.Capacitor.isNative;
  
  return capacitorNative || capacitorPlatform === 'android' || capacitorPlatform === 'ios' || isAndroidApp || hasCapacitorNative;
};

// Mobile Auth Handler with improved callback processing
const MobileAuthHandler = ({ children }) => {
  const [authProcessing, setAuthProcessing] = useState(false);

  useEffect(() => {
    const isMobile = isMobilePlatform();
    console.log('Mobile platform detected:', isMobile);
    
    if (isMobile) {
      console.log('Setting up mobile auth handler');
      
      // Check if we're returning from an auth callback on app startup
      const checkInitialUrl = async () => {
        try {
          const { url } = await CapacitorApp.getLaunchUrl() || {};
          if (url && url.includes('com.gainslog.app://callback')) {
            console.log('Launch URL contains auth callback:', url);
            handleAuthCallback(url);
          }
        } catch (error) {
          console.log('No launch URL or error getting launch URL:', error);
        }
      };

      const handleAuthCallback = (url) => {
        console.log('Processing auth callback:', url);
        setAuthProcessing(true);
        
        try {
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get('code');
          const state = urlObj.searchParams.get('state');
          const error = urlObj.searchParams.get('error');
          
          if (error) {
            console.error('Auth0 error in callback:', error);
            setAuthProcessing(false);
            return;
          }
          
          if (code && state) {
            console.log('Auth code received, processing callback');
            
            // Instead of manually processing, redirect to our app with the auth params
            // This lets Auth0 handle the callback properly
            const callbackUrl = `${window.location.origin}/?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
            
            console.log('Redirecting to callback URL for Auth0 processing:', callbackUrl);
            
            // Direct redirect to let Auth0 handle the callback
            window.location.href = callbackUrl;
          }
        } catch (error) {
          console.error('Error processing auth callback:', error);
          setAuthProcessing(false);
        }
      };

      const handleAppUrlOpen = (event) => {
        console.log('Deep link received:', event.url);
        if (event.url.includes('com.gainslog.app://callback')) {
          handleAuthCallback(event.url);
        }
      };

      // Set up listeners
      CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen);
      
      // Check initial URL
      checkInitialUrl();

      return () => {
        CapacitorApp.removeAllListeners();
      };
    }
  }, [authProcessing]);

  return children;
};

// Initialize mobile app if running on mobile platform
const isMobile = isMobilePlatform();
console.log('App initialization - Mobile platform:', isMobile);

if (isMobile) {
  console.log('Initializing mobile-specific features');
  // Configure status bar
  StatusBar.setStyle({ style: Style.Dark });
  
  // Hide splash screen when app is ready
  SplashScreen.hide();
}

const root = createRoot(document.getElementById('root'));

root.render(
<MobileAuthHandler>
  <Auth0Provider
    domain="dev-o87gtr0hl6pu381w.us.auth0.com"
    clientId="xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk"
    authorizationParams={{
      redirect_uri: getRedirectUri(),
      audience: "gains-log-api",
      scope: "openid profile email write:workouts offline_access"
    }}
    useRefreshTokens={true}
    cacheLocation={isMobilePlatform() ? "memory" : "localstorage"}
    onRedirectCallback={(appState) => {
      console.log('Auth0 onRedirectCallback triggered:', appState);
      console.log('User should now be authenticated');
      
      const isMobile = isMobilePlatform();
      
      // Clear the URL parameters
      window.history.replaceState({}, '', window.location.pathname);
      
      // Navigate to the intended page or home
      if (appState?.returnTo) {
        window.location.href = appState.returnTo;
      } else {
        // For mobile, we might need a slight delay to ensure auth state is established
        if (isMobile) {
          console.log('Mobile auth completed, ensuring auth state is ready');
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
        }
      }
    }}
  >
    <App />
  </Auth0Provider>
</MobileAuthHandler>
);