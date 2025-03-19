import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./WorkoutLog.css";

const WorkoutLog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [workoutName, setWorkoutName] = useState(localStorage.getItem("workoutName") || "");
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(localStorage.getItem("workoutStarted") === "true");
  const [workoutLog, setWorkoutLog] = useState(JSON.parse(localStorage.getItem("workoutLog")) || []);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [unit, setUnit] = useState("kg");
  const [restTimer, setRestTimer] = useState(60);
  const [countdown, setCountdown] = useState(null);

  // If an exercise was selected from Exercises Page, add it to workout log
  useEffect(() => {
    if (location.state?.selectedExercise) {
      addExerciseToLog(location.state.selectedExercise);
    }
  }, [location.state]);

  // Save workout state to localStorage (for persistence)
  useEffect(() => {
    localStorage.setItem("workoutName", workoutName);
    localStorage.setItem("workoutStarted", isWorkoutStarted);
    localStorage.setItem("workoutLog", JSON.stringify(workoutLog));
  }, [workoutName, isWorkoutStarted, workoutLog]);

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
    setWorkoutLog([...workoutLog, { name: exercise.name, sets: [] }]);
  };

  const handleAddExercise = () => {
    navigate("/exercises", { state: { fromWorkoutLog: true } });
  };

  // Remove an exercise from the log
  const removeExercise = (exerciseIndex) => {
    const updatedLog = workoutLog.filter((_, index) => index !== exerciseIndex);
    setWorkoutLog(updatedLog);
  };

  const addSet = (exerciseIndex) => {
    if (!weight || !reps) {
      alert("Please enter weight and reps!");
      return;
    }

    const updatedLog = [...workoutLog];
    updatedLog[exerciseIndex].sets.push({ weight, reps, unit });
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
    if (!workoutName.trim() || workoutLog.length === 0) {
      alert("Please enter a workout name and add at least one exercise!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/workout", {
        name: workoutName,
        exercises: workoutLog,
      });

      console.log("Workout saved successfully:", response.data);

      // Reset everything after saving
      setWorkoutName("");
      setWorkoutLog([]);
      setIsWorkoutStarted(false);
      setWeight("");
      setReps("");
      setCountdown(null);

      // Clear local storage
      localStorage.removeItem("workoutName");
      localStorage.removeItem("workoutStarted");
      localStorage.removeItem("workoutLog");

      alert("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error.response ? error.response.data : error);
      alert("Error saving workout. Please try again.");
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
          />
          <button onClick={startWorkout}>Start Workout</button>
        </div>
      ) : (
        <>
          <h2>{workoutName}</h2>

          <button onClick={handleAddExercise}>Add Exercise</button>

          {workoutLog.length > 0 && (
            <div className="workout-summary">
              <h3>Workout Summary</h3>
              {workoutLog.map((exercise, index) => (
                <div key={index} className="exercise-entry">
                  <h4>{exercise.name}</h4>

                  {/* Remove Exercise Button */}
                  <button className="remove-exercise-btn" onClick={() => removeExercise(index)}>Remove</button>

                  {exercise.sets.length > 0 && (
                    <ol>
                      {exercise.sets.map((set, i) => (
                        <li key={i}>
                          {set.weight} {set.unit} x {set.reps} reps
                        </li>
                      ))}
                    </ol>
                  )}
                  <div className="set-inputs">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Weight"
                    />
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      placeholder="Reps"
                    />
                    <button onClick={() => addSet(index)}>Add Set</button>
                  </div>
                </div>
              ))}
              <button onClick={saveWorkout}>Save Workout</button>
            </div>
          )}

          <div className="rest-timer">
            <h3>Rest Timer: {countdown !== null ? `${countdown}s` : "Ready"}</h3>
            <input
              type="number"
              value={restTimer}
              onChange={(e) => setRestTimer(e.target.value)}
            />
            <button onClick={startRestTimer}>Start Rest Timer</button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutLog;
