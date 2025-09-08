import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useAuthStatus from "../hooks/useAuthStatus";
import { performLogin } from "../utils/auth";
import { apiClient } from "../utils/httpClient";
import { API_BASE_URL } from "../utils/apiConfig";
import "./workoutGenerator.css";

const AUTH0_AUDIENCE = "gains-log-api";
const API_URL = API_BASE_URL;

const WorkoutGenerator = () => {
  const { 
    isAuthenticated,
    tokens
  } = useAuthStatus();
  
  const { 
    getAccessTokenSilently: auth0GetToken,
    loginWithRedirect 
  } = useAuth0();

  const [level, setLevel] = useState("beginner");
  const [experience, setExperience] = useState(0);
  const [workoutType, setWorkoutType] = useState("full body");
  const [workout, setWorkout] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateWorkout = async () => {
    console.log('Generate workout clicked, authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      try {
        await performLogin(loginWithRedirect, {
          returnTo: window.location.pathname
        });
      } catch (error) {
        console.error('Login redirect failed:', error);
      }
      return;
    }

    setLoading(true);
    setWorkout("");
    setError(null);

    try {
      let token;
      if (tokens && tokens.access_token) {
        // Use manually stored token for mobile
        token = tokens.access_token;
      } else {
        // Use Auth0 for web
        token = await auth0GetToken({
          authorizationParams: {
            audience: AUTH0_AUDIENCE,
            scope: "write:workouts"
          },
          timeout: 5000
        }).catch(async (error) => {
          console.error('Token fetch failed:', error);
          if (error.error === "login_required") {
            try {
              await performLogin(loginWithRedirect, {
                returnTo: window.location.pathname
              });
            } catch (loginError) {
              console.error('Login redirect failed:', loginError);
            }
          }
          throw error;
        });
      }

      const prompt = `Generate a ${level} level ${workoutType} workout for someone with ${experience} weeks of gym experience`;
      
      const response = await apiClient.post("/api/aiworkouts/generate", {
        level,
        experience,
        workoutType,
        prompt,
        modelUsed: "gpt-3.5-turbo"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      });

      setWorkout(response.data.workout);
    } catch (error) {
      console.error("Error generating workout:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to generate workout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-generator">
      <h2>AI-Powered Workout Generator</h2>

      <label>Fitness Level:</label>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <label>Weeks in Gym:</label>
      <input
        type="number"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        min="0"
        max="104"
      />

      <label>Workout Type:</label>
      <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
        <option value="full body">Full Body</option>
        <option value="leg day">Leg Day</option>
        <option value="chest day">Chest Day</option>
        <option value="back & biceps">Back & Biceps</option>
        <option value="shoulders & triceps">Shoulders & Triceps</option>
      </select>

      <button onClick={generateWorkout} disabled={loading}>
        {loading ? "Generating..." : "Get Workout Plan"}
      </button>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {workout && (
        <div className="workout-output">
          <h3>Your Workout Plan:</h3>
          <pre>{workout}</pre>
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator;