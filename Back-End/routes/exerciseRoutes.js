import express from "express";
import Exercise from "../models/ExerciseModel.js";

const router = express.Router();

// Get all exercises
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
