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
import WorkoutGenerator from "./workoutGenerator/workoutGenerator.jsx"; //Import Workout Generator

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); //Fix auto logout issue
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
        <Route path="/workout-generator" element={isLoggedIn ? <WorkoutGenerator /> : <Login setIsLoggedIn={setIsLoggedIn} />} /> {/*Added Workout Generator Route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
