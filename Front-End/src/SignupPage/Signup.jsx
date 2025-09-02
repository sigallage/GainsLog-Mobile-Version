import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";  // ← Changed import source
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/httpClient";
import "./Signup.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  // Save user to MongoDB when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      apiClient.post("/api/users", {
        auth0Id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      })
        .then((response) => {
          console.log("User saved:", response.data);
          navigate("/profile");
        })
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignup = () => {
    loginWithRedirect({
      screen_hint: "signup",
      redirect_uri: window.location.origin // Ensure redirect comes back to signup page
    });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <button onClick={handleSignup} className="auth-btn">
          Sign Up with Auth0
        </button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;