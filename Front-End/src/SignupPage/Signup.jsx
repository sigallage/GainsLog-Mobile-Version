import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <button onClick={() => loginWithRedirect({ screen_hint: "signup" })} className="auth-btn">
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
