import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useAuthStatus from "../hooks/useAuthStatus";
import { apiClient } from "../utils/httpClient";
import "./WorkoutLog.css";

const AUTH0_AUDIENCE = "gains-log-api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const WorkoutLog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAuthenticated,
    tokens
  } = useAuthStatus();
  
  const { 
    getAccessTokenSilently: auth0GetToken,
    loginWithRedirect 
  } = useAuth0();

  const [workoutName, setWorkoutName] = useState(localStorage.getItem("workoutName") || "");
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(localStorage.getItem("workoutStarted") === "true");
  const [workoutLog, setWorkoutLog] = useState(JSON.parse(localStorage.getItem("workoutLog")) || []);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [unit, setUnit] = useState("kg");
  const [restTimer, setRestTimer] = useState(60);
  const [countdown, setCountdown] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Add exercise if coming from exercise selection
  useEffect(() => {
    if (location.state?.selectedExercise) {
      addExerciseToLog(location.state.selectedExercise);
    }
  }, [location.state]);

  // Persist workout state
  useEffect(() => {
    localStorage.setItem("workoutName", workoutName);
    localStorage.setItem("workoutStarted", isWorkoutStarted);
    localStorage.setItem("workoutLog", JSON.stringify(workoutLog));
  }, [workoutName, isWorkoutStarted, workoutLog]);

  // Recover state after login redirect
  useEffect(() => {
    if (location.state?.workoutData) {
      setWorkoutName(location.state.workoutData.name || "");
      setWorkoutLog(location.state.workoutData.exercises || []);
      setIsWorkoutStarted(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Check token status periodically
  useEffect(() => {
    const checkToken = async () => {
      try {
        if (tokens && tokens.access_token) {
          // Mobile - check token expiry
          if (tokens.expires_at && Date.now() >= tokens.expires_at) {
            console.log("Mobile token expired");
          }
        } else {
          // Web - check Auth0 token
          await auth0GetToken({ 
            authorizationParams: { prompt: "none" } 
          });
        }
      } catch (error) {
        if (error.error === "login_required") {
          console.log("Token refresh needed");
        }
      }
    };
    const interval = setInterval(checkToken, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [auth0GetToken, tokens]);

  const startWorkout = () => {
    if (!workoutName.trim()) {
      alert("Please enter a workout name!");
      return;
    }
    setIsWorkoutStarted(true);
  };

  const addExerciseToLog = (exercise) => {
    if (workoutLog.some((item) => item.name === exercise.name)) {
      alert("This exercise is already added.");
      return;
    }
    setWorkoutLog([...workoutLog, { 
      name: exercise.name, 
      sets: [] 
    }]);
  };

  const handleAddExercise = () => {
    navigate("/exercises", { 
      state: { 
        fromWorkoutLog: true,
        currentExercises: workoutLog.map(ex => ex.name)
      }
    });
  };

  const removeExercise = (exerciseIndex) => {
    const updatedLog = workoutLog.filter((_, index) => index !== exerciseIndex);
    setWorkoutLog(updatedLog);
  };

  const addSet = (exerciseIndex) => {
    if (!weight || !reps || isNaN(weight) || isNaN(reps)) {
      alert("Please enter valid weight and reps!");
      return;
    }

    const updatedLog = [...workoutLog];
    updatedLog[exerciseIndex].sets.push({ 
      weight: parseFloat(weight), 
      reps: parseInt(reps), 
      unit 
    });
    setWorkoutLog(updatedLog);
    setWeight("");
    setReps("");
    startRestTimer();
  };

  const startRestTimer = () => {
    setCountdown(restTimer);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const saveWorkout = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({
        appState: { 
          returnTo: window.location.pathname,
          workoutData: {
            name: workoutName,
            exercises: workoutLog
          }
        },
        authorizationParams: {
          prompt: "login",
          scope: "openid profile email write:workouts offline_access",
          audience: AUTH0_AUDIENCE
        }
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      
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
          if (error.error === "login_required") {
            await loginWithRedirect({
              appState: {
                returnTo: window.location.pathname,
                workoutData: { name: workoutName, exercises: workoutLog }
              }
            });
          }
          throw error;
        });
      }

      await apiClient.post("/api/workouts", {
        name: workoutName,
        exercises: workoutLog,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      });

      // Clear state on success
      localStorage.removeItem("workoutName");
      localStorage.removeItem("workoutStarted");
      localStorage.removeItem("workoutLog");
      
      navigate("/workout-history", {
        state: { 
          success: true,
          message: "Workout saved successfully!"
        }
      });

    } catch (error) {
      console.error("Save error:", error);
      
      if (error.response?.status === 401) {
        setSaveError("Session expired. Redirecting to login...");
        await loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
            workoutData: { name: workoutName, exercises: workoutLog }
          }
        });
      } else {
        setSaveError(
          error.response?.data?.message ||
          error.message ||
          "Failed to save workout. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="workout-log-container">
      <h1>Workout Log</h1>

      {!isWorkoutStarted ? (
        <div className="start-workout">
          <input
            type="text"
            placeholder="Enter Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="workout-name-input"
          />
          <button 
            onClick={startWorkout}
            className="start-button"
          >
            Start Workout
          </button>
        </div>
      ) : (
        <>
          <div className="workout-header">
            <h2>{workoutName}</h2>
            <button 
              onClick={handleAddExercise}
              className="add-exercise-button"
            >
              + Add Exercise
            </button>
          </div>

          {saveError && (
            <div className="error-message">
              {saveError}
              <button onClick={() => setSaveError(null)}>Dismiss</button>
            </div>
          )}

          {workoutLog.length > 0 ? (
            <div className="workout-summary">
              {workoutLog.map((exercise, index) => (
                <div key={index} className="exercise-card">
                  <div className="exercise-header">
                    <h3>{exercise.name}</h3>
                    <button 
                      onClick={() => removeExercise(index)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  </div>

                  {exercise.sets.length > 0 && (
                    <div className="sets-list">
                      <h4>Sets:</h4>
                      <ul>
                        {exercise.sets.map((set, i) => (
                          <li key={i}>
                            Set {i + 1}: {set.weight} {set.unit} × {set.reps} reps
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="set-inputs">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Weight"
                      min="0"
                      step="0.1"
                    />
                    <select 
                      value={unit} 
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      placeholder="Reps"
                      min="1"
                    />
                    <button 
                      onClick={() => addSet(index)}
                      className="add-set-button"
                    >
                      Add Set
                    </button>
                  </div>
                </div>
              ))}

              <div className="action-buttons">
                <button 
                  onClick={saveWorkout}
                  disabled={isSaving}
                  className="save-button"
                >
                  {isSaving ? "Saving..." : "Save Workout"}
                </button>
              </div>
            </div>
          ) : (
            <p className="no-exercises">Add your first exercise to begin</p>
          )}

          <div className="rest-timer">
            <h3>Rest Timer: {countdown !== null ? `${countdown}s` : "Ready"}</h3>
            <div className="timer-controls">
              <input
                type="number"
                value={restTimer}
                onChange={(e) => setRestTimer(Math.max(0, e.target.value))}
                min="0"
              />
              <button 
                onClick={startRestTimer}
                className="timer-button"
              >
                Start Timer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutLog;