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

  useEffect(() => {
    //Reset login state when the website is loaded
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  }, []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/workout-log" element={isLoggedIn ? <WorkoutLog /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/workout-history" element={isLoggedIn ? <WorkoutHistory /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
