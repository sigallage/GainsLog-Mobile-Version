import React from "react";
import { useNavigate } from "react-router-dom";
import "../HomePage/home.css";

// Import images
import workoutImg from "../assets/workout-log.jpg";
import nutritionImg from "../assets/nutrition-log.jpg";
import exercisesImg from "../assets/exercises.jpg";
import generateWorkoutImg from "../assets/generateWorkout.jpg";
import WorkoutHistoryImg from "../assets/WorkoutHistory.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const tiles = [
    { id: 1, title: "Workout Log", image: workoutImg, route: "/workout-log" },
    { id: 2, title: "Generate a Workout", image: generateWorkoutImg, route: "/workout-generator" },
    { id: 3, title: "Nutrition Log", image: nutritionImg, route: "/nutrition-log" },
    { id: 4, title: "Exercises", image: exercisesImg, route: "/exercises" },
    { id: 5, title: "Workout History", image: WorkoutHistoryImg, route: "/workout-history" }
    
  ];

  return (
    <div className="homepage">
      {tiles.map((tile) => (
        <div key={tile.id} className="tile" onClick={() => navigate(tile.route)}>
          <img src={tile.image} alt={tile.title} />
          <h2>{tile.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
