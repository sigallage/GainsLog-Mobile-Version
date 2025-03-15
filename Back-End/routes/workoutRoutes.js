import express from "express";
import Workout from "../models/Workout.js"; // Ensure you have a Workout model

const router = express.Router();

/**
 * @route   POST /api/workout
 * @desc    Save a new workout
 */
router.post("/", async (req, res) => {
  try {
    console.log("Received workout data:", req.body); // Debugging Log

    const { name, exercises } = req.body;

    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Workout name and exercises are required" });
    }

    const newWorkout = new Workout({
      userId: "YOUR_USER_ID", // Replace with actual user ID (from authentication)
      name,
      exercises,
    });

    await newWorkout.save();
    res.status(201).json({ message: "Workout saved!", workout: newWorkout });
  } catch (error) {
    console.error("Error saving workout:", error);
    res.status(500).json({ message: "Error saving workout" });
  }
});

/**
 * @route   GET /api/workout/recent
 * @desc    Get the 5 most recent workouts
 */
router.get("/recent", async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 }).limit(5);
    res.json(workouts);
  } catch (error) {
    console.error("Error fetching recent workouts:", error);
    res.status(500).json({ message: "Error fetching recent workouts" });
  }
});

/**
 * @route   GET /api/workout/progress
 * @desc    Get workout progress data for graphs
 */
router.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const workouts = await Workout.find({ userId }).sort({ date: 1 });

    const progressData = workouts.map((workout) => ({
      date: workout.date,
      totalWeight: workout.exercises.reduce((acc, exercise) => {
        return acc + exercise.sets.reduce((setAcc, set) => {
          // Convert lb to kg for consistency (1 lb = 0.453592 kg)
          const weightInKg = set.unit === "lb" ? set.weight * 0.453592 : set.weight;
          return setAcc + weightInKg;
        }, 0);
      }, 0),
    }));

    res.json(progressData);
  } catch (error) {
    console.error("Error fetching workout progress:", error);
    res.status(500).json({ message: "Error fetching workout progress" });
  }
});

/**
 * @route   DELETE /api/workout/:id
 * @desc    Delete a workout by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWorkout = await Workout.findByIdAndDelete(id);
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully!" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ message: "Error deleting workout" });
  }
});

/**
 * @route   PUT /api/workout/:id
 * @desc    Update a workout by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, exercises } = req.body;

    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Workout name and exercises are required" });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { name, exercises },
      { new: true } // Return the updated document
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout updated successfully!", workout: updatedWorkout });
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json({ message: "Error updating workout" });
  }
});

export default router;
