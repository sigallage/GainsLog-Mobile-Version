import React from "react";
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
import AuthStateManager from "./components/AuthStateManager.jsx";
import CustomSplashScreen from "./components/SplashScreen/SplashScreen.jsx";
import useAuthStatus from './hooks/useAuthStatus';

function App() {
  const { isLoading, isAuthenticated } = useAuthStatus();
  const isGuestMode = localStorage.getItem('guestMode') === 'true';
  
  // Check for auth callback parameters and force refresh if needed
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && !isAuthenticated && !isLoading) {
      console.log('Auth callback detected, processing authentication...');
      // Clear URL params to prevent loops
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Give Auth0 time to process the authentication
      setTimeout(() => {
        if (!isAuthenticated) {
          console.log('Auth state not updated, forcing reload...');
          window.location.reload();
        }
      }, 2000);
    }
  }, [isAuthenticated, isLoading]);
  
  // Always show the main app - authentication is handled by the header
  return (
    <CustomSplashScreen isLoading={isLoading}>
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
        <AuthStateManager />
      </Router>
    </CustomSplashScreen>
  );
}

export default App;
