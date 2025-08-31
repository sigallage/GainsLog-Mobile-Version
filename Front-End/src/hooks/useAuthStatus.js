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
  }, [isAuthenticated, isLoading, getAccessTokenSilently, user]);

  // Only sync auth state across tabs for web (not mobile)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      const handleStorageChange = (event) => {
        if (event.key === '@@auth0spajs@@::xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk') {
          window.location.reload();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
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