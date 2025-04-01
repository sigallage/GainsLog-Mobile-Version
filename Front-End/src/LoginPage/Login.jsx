import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Save user to MongoDB when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetch("http://localhost:5000/api/users/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth0Id: user.sub, // Unique Auth0 ID
          name: user.name,
          email: user.email,
          picture: user.picture,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User saved:", data))
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [isAuthenticated, user]);

  if (isLoading) return <div>Loading...</div>;

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
            <button onClick={() => logout({ returnTo: window.location.origin })} className="auth-btn">
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