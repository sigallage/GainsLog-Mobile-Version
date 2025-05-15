import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./WorkoutHistory.css";

const WorkoutHistory = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkoutHistory();
    }
  }, [isAuthenticated]);

  const fetchWorkoutHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessTokenSilently();
      const response = await axios.get("http://localhost:5000/api/workout", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkoutHistory(response.data.workouts || []);
    } catch (err) {
      console.error("Failed to fetch workout history:", err);
      setError("Failed to load workout history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalVolume = (workout) => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exerciseTotal, set) => {
        const weight = set.unit === 'lb' ? set.weight * 0.453592 : set.weight;
        return exerciseTotal + (weight * set.reps);
      }, 0);
    }, 0);
  };

  return (
    <div className="workout-history-container">
      <h1>Workout History</h1>
      
      {!isAuthenticated ? (
        <p className="auth-message">Please log in to view your workout history</p>
      ) : loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchWorkoutHistory}>Retry</button>
        </div>
      ) : workoutHistory.length === 0 ? (
        <p className="no-workouts">No workouts found. Start logging your workouts!</p>
      ) : (
        <div className="workout-list">
          {workoutHistory.map((workout) => (
            <div key={workout._id} className="workout-card">
              <div className="workout-header">
                <h2>{workout.name}</h2>
                <span className="workout-date">
                  {new Date(workout.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="workout-stats">
                <span>Exercises: {workout.exercises.length}</span>
                <span>Total Volume: {calculateTotalVolume(workout).toFixed(2)} kg</span>
              </div>
              
              <div className="exercises-list">
                {workout.exercises.map((exercise) => (
                  <div key={exercise._id || exercise.name} className="exercise-item">
                    <h3>{exercise.name}</h3>
                    <ul className="sets-list">
                      {exercise.sets.map((set, index) => (
                        <li key={index}>
                          Set {index + 1}: {set.weight} {set.unit} × {set.reps} reps
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;