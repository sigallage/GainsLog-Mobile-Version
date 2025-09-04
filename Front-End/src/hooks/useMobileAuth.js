import { useAuth0 } from '@auth0/auth0-react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

export const useMobileAuth = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const isMobile = Capacitor.isNativePlatform();

  const mobileLogin = async () => {
    if (isMobile) {
      try {
        console.log('Starting mobile login with external browser...');
        
        // Use Capacitor Browser to open Auth0 in external browser
        // This complies with Google's secure browser policy
        const authUrl = `https://dev-o87gtr0hl6pu381w.us.auth0.com/authorize?` +
          `response_type=code&` +
          `client_id=xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk&` +
          `redirect_uri=${encodeURIComponent('com.gainslog.app://callback')}&` +
          `scope=${encodeURIComponent('openid profile email')}&` +
          `audience=${encodeURIComponent('gains-log-api')}&` +
          `connection=google-oauth2&` + // Force Google connection
          `prompt=login`; // Force fresh login

        console.log('Opening external browser with URL:', authUrl);

        await Browser.open({
          url: authUrl,
          windowName: '_system',
          presentationStyle: 'fullscreen'
        });

        return new Promise((resolve, reject) => {
          const listener = CapacitorApp.addListener('appUrlOpen', async (data) => {
            if (data.url.includes('com.gainslog.app://callback')) {
              console.log('Auth callback received:', data.url);
              
              try {
                // Close the browser
                await Browser.close();
                
                // Remove the listener
                listener.remove();
                
                // Process the callback
                await handleAuthCallback(data.url);
                resolve();
              } catch (error) {
                console.error('Error processing callback:', error);
                reject(error);
              }
            }
          });

          // Set a timeout to clean up if no callback is received
          setTimeout(() => {
            listener.remove();
            reject(new Error('Login timeout - no callback received'));
          }, 300000); // 5 minutes timeout
        });

      } catch (error) {
        console.error('Mobile login error:', error);
        // Fallback to web login if external browser fails
        return webLogin();
      }
    } else {
      return webLogin();
    }
  };

  const webLogin = async () => {
    console.log('Using web login...');
    return loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        scope: 'openid profile email',
        audience: 'gains-log-api',
        connection: 'google-oauth2'
      }
    });
  };

  const handleAuthCallback = async (callbackUrl) => {
    try {
      console.log('Processing auth callback:', callbackUrl);
      
      const url = new URL(callbackUrl);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      
      if (error) {
        console.error('Auth error:', error);
        throw new Error(`Authentication failed: ${error}`);
      }
      
      if (code) {
        console.log('Auth code received, exchanging for tokens...');
        
        try {
          // Exchange the authorization code for tokens
          const tokenResponse = await fetch('https://dev-o87gtr0hl6pu381w.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              grant_type: 'authorization_code',
              client_id: 'xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk',
              code: code,
              redirect_uri: 'com.gainslog.app://callback'
            })
          });
          
          if (!tokenResponse.ok) {
            throw new Error(`Token exchange failed: ${tokenResponse.status}`);
          }
          
          const tokens = await tokenResponse.json();
          console.log('Tokens received successfully');
          
          // Store tokens in localStorage (Auth0 format)
          const authData = {
            access_token: tokens.access_token,
            id_token: tokens.id_token,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type,
            expires_in: tokens.expires_in,
            scope: tokens.scope,
            expires_at: Date.now() + (tokens.expires_in * 1000)
          };
          
          // Store in the same format Auth0 expects
          localStorage.setItem('auth0.is.authenticated', 'true');
          localStorage.setItem('auth0.cached.tokens', JSON.stringify(authData));
          
          // Get user info
          let userInfo = null;
          const userResponse = await fetch('https://dev-o87gtr0hl6pu381w.us.auth0.com/userinfo', {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`
            }
          });
          
          if (userResponse.ok) {
            userInfo = await userResponse.json();
            localStorage.setItem('auth0.cached.user', JSON.stringify(userInfo));
            console.log('User info stored:', userInfo.name);
          }
          
          // Trigger a re-render by dispatching a storage event
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'auth0.is.authenticated',
            newValue: 'true'
          }));
          
          // Also dispatch custom event for immediate UI update
          window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { authenticated: true, user: userInfo }
          }));
          
          console.log('Authentication completed successfully');
          
        } catch (tokenError) {
          console.error('Token exchange error:', tokenError);
          // Fallback to the URL method if token exchange fails
          console.log('Falling back to URL-based auth processing');
          
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('code', code);
          if (state) {
            currentUrl.searchParams.set('state', state);
          }
          
          window.history.replaceState({}, '', currentUrl.toString());
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw error;
    }
  };

  const mobileLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: isMobile ? 'com.gainslog.app://callback' : window.location.origin
      } 
    });
  };

  return {
    login: mobileLogin,
    logout: mobileLogout,
    isAuthenticated,
    user,
    isLoading,
    isMobile
  };
};
