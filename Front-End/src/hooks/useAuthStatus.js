// src/hooks/useAuthStatus.js
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';

const useAuthStatus = () => {
  const { 
    isAuthenticated: auth0IsAuthenticated, 
    isLoading: auth0IsLoading, 
    user: auth0User, 
    getAccessTokenSilently 
  } = useAuth0();

  const [authChecked, setAuthChecked] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [manualAuthState, setManualAuthState] = useState(null);

  // Check manual authentication state (for mobile)
  const checkManualAuth = () => {
    const isMobile = Capacitor.isNativePlatform();
    
    if (isMobile) {
      const isAuth = localStorage.getItem('auth0.is.authenticated') === 'true';
      const tokens = localStorage.getItem('auth0.cached.tokens');
      const user = localStorage.getItem('auth0.cached.user');
      
      if (isAuth && tokens && user) {
        try {
          const parsedTokens = JSON.parse(tokens);
          const parsedUser = JSON.parse(user);
          
          // Check if tokens are still valid
          if (parsedTokens.expires_at && Date.now() < parsedTokens.expires_at) {
            return {
              isAuthenticated: true,
              user: parsedUser,
              tokens: parsedTokens
            };
          }
        } catch (error) {
          console.error('Error parsing manual auth data:', error);
        }
      }
    }
    
    return {
      isAuthenticated: false,
      user: null,
      tokens: null
    };
  };

  // Handle token refresh and auth state changes
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const manualAuth = checkManualAuth();
        setManualAuthState(manualAuth);
        
        if (auth0IsAuthenticated) {
          console.log('User is authenticated via Auth0:', auth0User);
          await getAccessTokenSilently({
            authorizationParams: {
              audience: 'gains-log-api',
              scope: 'openid profile email write:workouts offline_access'
            }
          });
        } else if (manualAuth.isAuthenticated) {
          console.log('User is authenticated via manual token exchange:', manualAuth.user);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.debug('Auth state check:', error.message);
      } finally {
        setAuthChecked(true);
      }
    };

    if (!auth0IsLoading) {
      checkAuthState();
    }
  }, [auth0IsAuthenticated, auth0IsLoading, getAccessTokenSilently, auth0User, forceUpdate]);

  // Listen for custom auth state changes (for mobile manual token exchange)
  useEffect(() => {
    const handleAuthStateChange = (event) => {
      console.log('Custom auth state change detected');
      const manualAuth = checkManualAuth();
      setManualAuthState(manualAuth);
      setForceUpdate(prev => prev + 1);
    };

    const handleStorageChange = (event) => {
      if (event.key === 'auth0.is.authenticated' || 
          event.key === 'auth0.cached.tokens' ||
          event.key === 'auth0.cached.user') {
        console.log('Auth storage change detected');
        const manualAuth = checkManualAuth();
        setManualAuthState(manualAuth);
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

  // Determine the final authentication state
  const isMobile = Capacitor.isNativePlatform();
  const finalAuthState = isMobile && manualAuthState ? manualAuthState : {
    isAuthenticated: auth0IsAuthenticated,
    user: auth0User,
    tokens: null
  };

  return { 
    isAuthenticated: finalAuthState.isAuthenticated, 
    isLoading: auth0IsLoading || !authChecked, 
    user: finalAuthState.user,
    // Optional: Add these if needed by your components
    getAccessTokenSilently,
    tokens: finalAuthState.tokens
  };
};

export default useAuthStatus;