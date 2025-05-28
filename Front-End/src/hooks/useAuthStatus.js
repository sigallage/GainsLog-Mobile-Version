// src/hooks/useAuthStatus.js
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useAuthStatus = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    getAccessTokenSilently 
  } = useAuth0();

  // Handle token refresh and auth state changes
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        if (isAuthenticated) {
          await getAccessTokenSilently({
            authorizationParams: {
              audience: 'gains-log-api',
              scope: 'openid profile email write:workouts offline_access'
            }
          });
        }
      } catch (error) {
        console.debug('Auth state check:', error.message);
      }
    };

    checkAuthState();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === '@@auth0spajs@@::xqrbTdmsTw4g7TTTVZVC5KGqPuq7sFrk') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    isAuthenticated, 
    isLoading, 
    user,
    // Optional: Add these if needed by your components
    getAccessTokenSilently 
  };
};

export default useAuthStatus;