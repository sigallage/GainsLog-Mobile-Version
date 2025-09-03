// src/hooks/useAuthStatus.js
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';

const useAuthStatus = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    getAccessTokenSilently 
  } = useAuth0();

  const [authChecked, setAuthChecked] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Handle token refresh and auth state changes
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        if (isAuthenticated) {
          console.log('User is authenticated:', user);
          await getAccessTokenSilently({
            authorizationParams: {
              audience: 'gains-log-api',
              scope: 'openid profile email write:workouts offline_access'
            }
          });
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.debug('Auth state check:', error.message);
      } finally {
        setAuthChecked(true);
      }
    };

    if (!isLoading) {
      checkAuthState();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently, user, forceUpdate]);

  // Listen for custom auth state changes (for mobile manual token exchange)
  useEffect(() => {
    const handleAuthStateChange = (event) => {
      console.log('Custom auth state change detected');
      setForceUpdate(prev => prev + 1);
    };

    const handleStorageChange = (event) => {
      if (event.key === 'auth0.is.authenticated' || 
          event.key === 'auth0.cached.tokens' ||
          event.key === 'auth0.cached.user') {
        console.log('Auth storage change detected');
        setForceUpdate(prev => prev + 1);
      }
      
      // Also handle standard Auth0 storage changes for web
      if (!Capacitor.isNativePlatform() && 
          event.key === '@@auth0spajs@@::xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk') {
        window.location.reload();
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { 
    isAuthenticated, 
    isLoading: isLoading || !authChecked, 
    user,
    // Optional: Add these if needed by your components
    getAccessTokenSilently 
  };
};

export default useAuthStatus;