import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import HomePage from "./HomePage/home.jsx";
import WorkoutLog from "./WorkoutLog/WorkoutLog.jsx";
import Login from "./LoginPage/Login.jsx";
import Signup from "./SignupPage/Signup.jsx";
import Exercises from "./ExercisePage/Exercises.jsx";
import WorkoutHistory from "./WorkoutHistory/WorkoutHistory.jsx";
import WorkoutGenerator from "./workoutGenerator/workoutGenerator.jsx";
import AIRecipeGenerator from "./RecipeGenerator/recipeGenerator.jsx";
import Profile from "./ProfilePage/Profile.jsx";
import Contact from "./Contact Page/Contact.jsx";
import AuthDebug from "./components/AuthDebug.jsx";


function App() {
  return (
    <Router>

        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/workout-log" element={<WorkoutLog />} />
          <Route path="/workout-history" element={<WorkoutHistory />} />
          <Route path="/workout-generator" element={<WorkoutGenerator />} />
          <Route path="/recipe" element={<AIRecipeGenerator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <AuthDebug />
      
    </Router>
  );
}

export default App;
