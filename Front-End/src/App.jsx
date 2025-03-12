import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import HomePage from "./HomePage/home.jsx";
import WorkoutLog from "./WorkoutLog/WorkoutLog.jsx";
import Login from "./LoginPage/Login.jsx";
import Signup from "./SignupPage/SignUp.jsx";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workout-log" element={<WorkoutLog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
