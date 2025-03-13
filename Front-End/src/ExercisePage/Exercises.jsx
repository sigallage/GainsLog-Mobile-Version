import { useEffect, useState } from "react";
import "./Exercises.css";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/exercises");
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  return (
    <div className="exercise-container">
      <h1 className="title">Exercise Library</h1>
      <div className="exercise-grid">
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <img src={exercise.image} alt={exercise.name} />
              <h2>{exercise.name}</h2>
              <p>{exercise.description}</p>
              <h3>Instructions:</h3>
              <ul>
                {exercise.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Loading exercises...</p>
        )}
      </div>
    </div>
  );
};

export default Exercises;
