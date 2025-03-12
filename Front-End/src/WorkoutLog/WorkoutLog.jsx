import { useEffect, useState } from "react";
import "./WorkoutLog.css";

const WorkoutLog = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch("https://wger.de/api/v2/workout/");
      const data = await response.json();
      setWorkoutPlans(data.results.slice(0, 3)); // Get 3 workout plans
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };


  return (
    <div className="workout-log-container">
      <h1 className="title">WORKOUT LOG</h1>

      {/* Custom Workout Plan Section */}
      <div className="custom-plan">
        <h2>Log Your Custom Workout Plan</h2>
        <textarea placeholder="Enter your workout plan here..."></textarea>
        <button className="save-btn">Save Plan</button>
      </div>

      {/* Dynamic Pre-Made Workout Plans */}
      <div className="pre-made-plans">
        <h2>Choose a Pre-Made Workout Plan</h2>
        <div className="plans">
          {workoutPlans.length > 0 ? (
            workoutPlans.map((plan, index) => (
              <div key={index} className="plan">
                {plan.name || `Workout Plan ${index + 1}`}
              </div>
            ))
          ) : (
            <p>Loading workout plans...</p>
          )}
        </div>
      </div>

      {/* AI Workout Plan */}
      <div className="ai-plan">
        <h2>Create a Plan with AI</h2>
        <button className="ai-btn">Generate Plan</button>
      </div>

      {/* Favorite Exercises */}
      <div className="favorite-exercises">
        <h2>Your Top 3 Exercises</h2>
        <input type="text" placeholder="Exercise 1" />
        <input type="text" placeholder="Exercise 2" />
        <input type="text" placeholder="Exercise 3" />
        <button className="save-btn">Save Exercises</button>
      </div>
    </div>
  );
};
const saveWorkout = async () => {
  const response = await fetch("http://localhost:5000/api/workout/custom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ name: "My Workout", exercises: ["Squat", "Bench Press"] })
  });

  if (response.ok) {
    alert("Workout Saved!");
  } else {
    alert("Error saving workout");
  }
};


export default WorkoutLog;
