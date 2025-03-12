import express from "express";
import authMiddleware from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

// Save custom workout plan
router.post("/custom", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.workouts.push(req.body);
    await user.save();
    res.json({ message: "Workout plan saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all workout plans for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.workouts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
