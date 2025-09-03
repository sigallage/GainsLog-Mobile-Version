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
  useEffect(() => {
    const isMobile = isMobilePlatform();
    console.log('Mobile platform detected:', isMobile);
    
    if (isMobile) {
      console.log('Setting up mobile auth handler');
      
      const handleAuthCallback = async (url) => {
        console.log('Auth callback received:', url);
        
        try {
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get('code');
          const state = urlObj.searchParams.get('state');
          const error = urlObj.searchParams.get('error');
          
          if (error) {
            console.error('Auth0 error in callback:', error);
            return;
          }
          
          if (code && state) {
            console.log('Auth code received, processing callback');
            
            // Store the auth success flag
            sessionStorage.setItem('auth_success', 'true');
            sessionStorage.setItem('auth_timestamp', Date.now().toString());
            
            // Instead of navigating, just update the current URL without reload
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('code', code);
            currentUrl.searchParams.set('state', state);
            
            console.log('Updating URL for Auth0 processing:', currentUrl.toString());
            
            // Update URL without reload to trigger Auth0's handleRedirectCallback
            window.history.replaceState({}, '', currentUrl.toString());
            
            // Dispatch a custom event to notify Auth0 of the URL change
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        } catch (error) {
          console.error('Error processing auth callback:', error);
        }
      };

      const handleAppUrlOpen = (event) => {
        console.log('Deep link received:', event.url);
        if (event.url.includes('com.gainslog.app://callback')) {
          handleAuthCallback(event.url);
        }
      };

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

      // Set up listeners
      CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen);
      
      // Check initial URL
      checkInitialUrl();

      return () => {
        CapacitorApp.removeAllListeners();
      };
    }
  }, []);

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
    cacheLocation="localstorage"
    // For mobile Capacitor apps, we need to handle CORS differently
    httpTimeoutInSeconds={isMobilePlatform() ? 60 : 10}
    // Enable the issuer verification for mobile
    issuer={`https://dev-o87gtr0hl6pu381w.us.auth0.com/`}
    onRedirectCallback={(appState) => {
      console.log('Auth0 onRedirectCallback triggered:', appState);
      console.log('User should now be authenticated');
      
      const isMobile = isMobilePlatform();
      
      // Clear any processing flags
      sessionStorage.removeItem('auth_processing');
      sessionStorage.removeItem('auth_code');
      sessionStorage.removeItem('auth_state');
      
      // Mark authentication as successful
      sessionStorage.setItem('auth_completed', 'true');
      sessionStorage.setItem('auth_completion_time', Date.now().toString());
      
      // For mobile, clear the URL parameters without reloading
      if (isMobile) {
        console.log('Mobile auth completed - cleaning URL');
        
        // Clear URL parameters without reload
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        
        // Force a re-render to update auth state
        setTimeout(() => {
          console.log('Authentication state should now be updated');
          // Trigger a custom event to notify components of auth success
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { authenticated: true } 
          }));
        }, 500);
      } else {
        // Navigate to the intended page or home for web
        if (appState?.returnTo) {
          window.location.href = appState.returnTo;
        }
      }
    }}
  >
    <App />
  </Auth0Provider>
</MobileAuthHandler>
);