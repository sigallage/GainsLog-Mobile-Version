import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hooks
import axios from "axios";
import "./Exercises.css";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [targets, setTargets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const apiHeaders = {
        headers: {
          "X-RapidAPI-Key": "a71310f755msh650bc5d6b8af25fp14f693jsn1d59407bf951",  // Replace with your actual API key
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
        }
      };

      // Fetch exercises
      const exerciseResponse = await axios.get("https://exercisedb.p.rapidapi.com/exercises", apiHeaders);
      setExercises(exerciseResponse.data);

      // Fetch filter options
      const bodyPartResponse = await axios.get("https://exercisedb.p.rapidapi.com/exercises/bodyPartList", apiHeaders);
      setBodyParts(bodyPartResponse.data);

      const equipmentResponse = await axios.get("https://exercisedb.p.rapidapi.com/exercises/equipmentList", apiHeaders);
      setEquipment(equipmentResponse.data);

      const targetResponse = await axios.get("https://exercisedb.p.rapidapi.com/exercises/targetList", apiHeaders);
      setTargets(targetResponse.data);

    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleFilter = async () => {
    try {
      let url = "https://exercisedb.p.rapidapi.com/exercises";

      if (searchTerm) {
        url = `https://exercisedb.p.rapidapi.com/exercises/name/${searchTerm}`;
      } else if (selectedBodyPart) {
        url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedBodyPart}`;
      } else if (selectedEquipment) {
        url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${selectedEquipment}`;
      } else if (selectedTarget) {
        url = `https://exercisedb.p.rapidapi.com/exercises/target/${selectedTarget}`;
      }

      const response = await axios.get(url, {
        headers: {
          "X-RapidAPI-Key": "a71310f755msh650bc5d6b8af25fp14f693jsn1d59407bf951",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
        }
      });

      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching filtered exercises:", error);
    }
  };

  // Select an exercise & go back to Workout Log
  const handleSelectExercise = (exercise) => {
    navigate("/workout-log", { state: { selectedExercise: exercise } });
  };

  return (
    <div className="exercise-container">
      <h1 className="title">Exercise Library</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedBodyPart} onChange={(e) => setSelectedBodyPart(e.target.value)}>
          <option value="">Filter by Body Part</option>
          {bodyParts.map((part, index) => (
            <option key={index} value={part}>{part}</option>
          ))}
        </select>

        <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}>
          <option value="">Filter by Equipment</option>
          {equipment.map((equip, index) => (
            <option key={index} value={equip}>{equip}</option>
          ))}
        </select>

        <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
          <option value="">Filter by Target Muscle</option>
          {targets.map((target, index) => (
            <option key={index} value={target}>{target}</option>
          ))}
        </select>

        <button className="filter-btn" onClick={handleFilter}>Apply Filters</button>
      </div>

      {/* Exercise List */}
      <div className="exercise-grid">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card" onClick={() => handleSelectExercise(exercise)}>
              <img src={exercise.gifUrl} alt={exercise.name} />
              <h3>{exercise.name}</h3>
              <p><strong>Body Part:</strong> {exercise.bodyPart}</p>
              <p><strong>Equipment:</strong> {exercise.equipment}</p>
              <p><strong>Target:</strong> {exercise.target}</p>
            </div>
          ))
        ) : (
          <p>No exercises found.</p>
        )}
      </div>
    </div>
  );
};

export default Exercises;
