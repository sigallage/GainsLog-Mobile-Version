import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import HomePage from "./HomePage/home.jsx";
import WorkoutLog from "./WorkoutLog/WorkoutLog.jsx";
import Login from "./LoginPage/Login.jsx";
import Signup from "./SignupPage/SignUp.jsx";
import Exercises from "./ExercisePage/Exercises.jsx";
import WorkoutHistory from "./WorkoutHistory/WorkoutHistory.jsx";
import WorkoutGenerator from "./workoutGenerator/workoutGenerator.jsx";
import AIRecipeGenerator from "./RecipeGenerator/recipeGenerator.jsx";
import Profile from "./ProfilePage/Profile.jsx";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;

  // If user is authenticated, redirect to homepage
  if (isAuthenticated) {
    navigate("/");
  }

  return children;
};

function App() {
  return (
    <Auth0Provider
      domain="dev-o87gtr0hl6pu381w.us.auth0.com"
      clientId="acnZDR3AReNIYeWPupwNHubOE53wirFx"
      authorizationParams={{
        redirect_uri: "http://localhost:5173",
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<AuthWrapper><Signup /></AuthWrapper>} />
          <Route path="/login" element={<AuthWrapper><Login /></AuthWrapper>} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/workout-log" element={<WorkoutLog />} />
          <Route path="/workout-history" element={<WorkoutHistory />} />
          <Route path="/workout-generator" element={<WorkoutGenerator />} />
          <Route path="/recipe" element={<AIRecipeGenerator />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </Auth0Provider>
  );
}

export default App;
