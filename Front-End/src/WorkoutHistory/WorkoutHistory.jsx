import { useEffect, useState } from "react";
import axios from "axios";
import "./WorkoutHistory.css";

const WorkoutHistory = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  const fetchWorkoutHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/workout");
      setWorkoutHistory(response.data);
    } catch (error) {
      console.error("Error fetching workout history:", error);
    }
    setLoading(false);
  };

  return (
    <div className="workout-history-container">
      <h1>Workout History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : workoutHistory.length > 0 ? (
        <ul className="history-list">
          {workoutHistory.map((workout, index) => (
            <li key={index} className="workout-entry">
              <h3>{new Date(workout.date).toLocaleDateString()}</h3>
              <ul>
                {workout.exercises.map((exercise, i) => (
                  <li key={i} className="exercise-entry">
                    <strong>{exercise.name}</strong>
                    <ul>
                      {exercise.sets.map((set, j) => (
                        <li key={j} className="set-entry">
                          {set.weight} kg x {set.reps} reps
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workout history available.</p>
      )}
    </div>
  );
};

export default WorkoutHistory;
