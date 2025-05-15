import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to FITZONE</h2>

        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()} className="auth-btn">
            Log in with Auth0
          </button>
        ) : (
          <>
            <p>Welcome, {user?.name}!</p>
            <button 
              onClick={() => logout({ returnTo: window.location.origin })} 
              className="auth-btn"
            >
              Log Out
            </button>
            <button onClick={() => navigate("/profile")} className="auth-btn">
              Go to Profile
            </button>
          </>
        )}

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;