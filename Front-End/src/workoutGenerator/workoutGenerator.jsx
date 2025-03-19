import { useState } from "react";
import axios from "axios";
import "./workoutGenerator.css";

const WorkoutGenerator = () => {
  const [level, setLevel] = useState("beginner");
  const [experience, setExperience] = useState(0);
  const [workoutType, setWorkoutType] = useState("full body"); // New state for workout type
  const [workout, setWorkout] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWorkout = async () => {
    setLoading(true);
    setWorkout(""); // Reset previous workout

    try {
      const response = await axios.post("http://localhost:5000/api/ai-workout/generate", {
        level,
        experience,
        workoutType, // Send workout type to backend
      });

      setWorkout(response.data.workout);
    } catch (error) {
      console.error("Error generating workout:", error);
      setWorkout("❌ Error fetching workout. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="workout-generator">
      <h2>💪 AI-Powered Workout Generator</h2>

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

      {workout && <div className="workout-output"><pre>{workout}</pre></div>}
    </div>
  );
};

export default WorkoutGenerator;
