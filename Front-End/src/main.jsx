import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { getRedirectUri } from './utils/auth';
import App from './App';

// Auth0 mobile callback handler
const MobileAuthHandler = ({ children }) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handleAppUrlOpen = (event) => {
        console.log('Deep link received:', event.url);
        
        if (event.url.includes('com.gainslog.app://callback')) {
          console.log('Auth0 callback detected');
          
          // Extract auth parameters
          const url = new URL(event.url);
          const code = url.searchParams.get('code');
          const state = url.searchParams.get('state');
          const error = url.searchParams.get('error');
          
          if (error) {
            console.error('Auth0 error:', error);
            return;
          }
          
          if (code && state) {
            console.log('Auth code received, updating URL for Auth0 processing');
            
            // Update the current URL to include the auth parameters
            // This allows Auth0 to process the callback
            const newUrl = `${window.location.origin}/?code=${code}&state=${state}`;
            window.history.replaceState({}, '', newUrl);
            
            // Force a page reload to trigger Auth0 callback processing
            setTimeout(() => {
              console.log('Reloading to process auth callback');
              window.location.reload();
            }, 100);
          }
        }
      };

      CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen);

      return () => {
        CapacitorApp.removeAllListeners();
      };
    }
  }, []);

  return children;
};

// Initialize mobile app if running on native platform
if (Capacitor.isNativePlatform()) {
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
    onRedirectCallback={(appState) => {
      console.log('Auth0 onRedirectCallback triggered:', appState);
      console.log('User should now be authenticated');
      
      // Clear the URL parameters
      window.history.replaceState({}, '', window.location.pathname);
      
      // Navigate to the intended page or home
      if (appState?.returnTo) {
        window.location.href = appState.returnTo;
      }
    }}
  >
    <App />
  </Auth0Provider>
</MobileAuthHandler>
);