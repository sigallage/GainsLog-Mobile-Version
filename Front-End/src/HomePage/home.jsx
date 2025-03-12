import React from "react";
import { useNavigate } from "react-router-dom";
import "../HomePage/home.css";

// Import images
import workoutImg from "../assets/workout-log.jpg";
import nutritionImg from "../assets/nutrition-log.jpg";
import exercisesImg from "../assets/exercises.jpg";
import pastWorkoutsImg from "../assets/past-workouts.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const tiles = [
    { id: 1, title: "Workout Log", image: workoutImg, route: "/workout-log" },
    { id: 2, title: "Nutrition Log", image: nutritionImg, route: "/nutrition-log" },
    { id: 3, title: "Exercises", image: exercisesImg, route: "/exercises" },
    { id: 4, title: "Workout History", image: pastWorkoutsImg, route: "/past-workouts" }
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
