import express from "express";
import Exercise from "../models/Exercise.js";

const router = express.Router();

//Get all exercises
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercises" });
  }
});

// Search exercises by name or category
router.get("/search", async (req, res) => {
  try {
    const { name, category } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const exercises = await Exercise.find(query).limit(10);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Error searching exercises" });
  }
});

export default router;
