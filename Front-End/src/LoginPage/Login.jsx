import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { auth, googleProvider, facebookProvider } from "../firebaseConfig";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      alert("Login successful!");
      setIsLoggedIn(true);
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      alert("Logged in with Facebook!");
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("Facebook Login Error:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent! Check your email.");
    } catch (error) {
      console.error("Password Reset Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to FITZONE</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="social-login">
          <button onClick={handleGoogleLogin} className="google-btn">
            Continue with Google
          </button>
          <button onClick={handleFacebookLogin} className="facebook-btn">
            Continue with Facebook
          </button>
        </div>

        <button className="forgot-password" onClick={handlePasswordReset}>
          Forgot Password?
        </button>

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
