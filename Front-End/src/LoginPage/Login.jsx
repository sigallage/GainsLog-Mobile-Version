import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { 
    loginWithRedirect, 
    logout, 
    user, 
    isAuthenticated, 
    isLoading,
    getAccessTokenSilently 
  } = useAuth0();
  const navigate = useNavigate();

  // Enhanced silent authentication check
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) return;
      
      try {
        await getAccessTokenSilently({
          authorizationParams: {
            prompt: "none",
            scope: "openid profile email",
            audience: "gains-log-api" // Added audience for consistency
          },
          timeout: 5000 // Add timeout to prevent hanging
        });
      } catch (error) {
        // Only log if it's not a "login_required" error
        if (error.error !== "login_required") {
          console.debug("Silent auth check:", error.message);
        }
      }
    };
    
    // Only run in production or if needed
    if (process.env.NODE_ENV === "production") {
      checkAuth();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  // Improved redirect handling
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo') || "/workout-log"; // Consistent default
      
      // Clear Auth0 state from URL
      if (window.location.search.includes("code=")) {
        navigate(returnTo, { replace: true });
      } else {
        navigate(returnTo);
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async () => {
    // Store current path for post-login return
    const returnPath = window.location.pathname !== "/login" 
      ? window.location.pathname 
      : "/workout-log";
    
    await loginWithRedirect({
      authorizationParams: {
        prompt: "login",
        scope: "openid profile email write:workouts offline_access",
        audience: "gains-log-api",
        redirect_uri: window.location.origin
      },
      appState: {
        returnTo: returnPath // Dynamic return path
      }
    });
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin,
        clientId: "xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk" // Explicit client ID
      }
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to GAINSLOG</h2>

        {!isAuthenticated ? (
          <>
            <button 
              onClick={handleLogin} 
              className="auth-btn login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Redirecting..." : "Log in with Auth0"}
            </button>
            <p className="signup-text">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="signup-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
              >
                Sign Up
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="welcome-message">
              <p>Welcome back, {user?.name}!</p>
              {user?.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="user-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="auth-buttons">
              <button 
                onClick={handleLogout}
                className="auth-btn logout-btn"
              >
                Log Out
              </button>
              <button 
                onClick={() => navigate("/profile")} 
                className="auth-btn profile-btn"
              >
                Go to Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;