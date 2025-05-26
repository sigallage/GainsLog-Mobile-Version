import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
  domain="dev-o87gtr0hl6pu381w.us.auth0.com"
  clientId="xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "gains-log-api",
    scope: "openid profile email write:workouts offline_access"
  }}
  useRefreshTokens={true}
  cacheLocation="localstorage"
  onRedirectCallback={(appState) => {
    
    window.location.href = appState?.returnTo || window.location.pathname;
  }}
>
    <App />
  </Auth0Provider>
);