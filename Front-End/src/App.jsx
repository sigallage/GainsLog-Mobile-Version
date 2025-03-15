import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import HomePage from "./HomePage/home.jsx";
import WorkoutLog from "./WorkoutLog/WorkoutLog.jsx";
import Login from "./LoginPage/Login.jsx";
import Signup from "./SignupPage/SignUp.jsx";
import Exercises from "./ExercisePage/Exercises.jsx";
import WorkoutHistory from "./WorkoutHistory/WorkoutHistory.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert token existence to boolean (true/false)
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status on component mount

    // Listen for login/logout changes across tabs
    window.addEventListener("storage", checkLoginStatus);

    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  return (
    <Router>
      {/* Pass isLoggedIn and setIsLoggedIn to Header */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/exercises" element={<Exercises />} />

        {/* Protect Workout Pages - Redirects to Login if Not Logged In */}
        <Route path="/workout-log" element={isLoggedIn ? <WorkoutLog /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/workout-history" element={isLoggedIn ? <WorkoutHistory /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
