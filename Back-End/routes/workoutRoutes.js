import express from "express";
import { checkJwt } from "../middleware/middleware.js"; // Import your JWT middleware
import Workout from "../models/Workout.js";
import mongoose from "mongoose";

const router = express.Router();

// Apply JWT middleware to all workout routes
router.use(checkJwt);

/**
 * @route   POST /api/workout
 * @desc    Save a new workout for authenticated user
 */
router.post("/", async (req, res) => {
  try {
    const { name, exercises } = req.body;
    
    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Workout name and at least one exercise are required" 
      });
    }

    // Validate each exercise has at least one set
    const invalidExercises = exercises.filter(ex => 
      !ex.name || !ex.sets || ex.sets.length === 0
    );
    
    if (invalidExercises.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Each exercise must have at least one set"
      });
    }

    const newWorkout = new Workout({
      userId: req.auth.sub, // From Auth0 JWT
      name,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.map(set => ({
          weight: parseFloat(set.weight),
          reps: parseInt(set.reps),
          unit: set.unit || 'kg'
        }))
      }))
    });

    await newWorkout.save();
    
    res.status(201).json({
      success: true,
      message: "Workout saved successfully",
      workout: newWorkout
    });

  } catch (error) {
    console.error("[Workout Save Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to save workout",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/workout
 * @desc    Get all workouts for authenticated user
 */
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.auth.sub })
      .sort({ date: -1 })
      .lean();

    if (!workouts.length) {
      return res.status(200).json({
        success: true,
        message: "No workouts found",
        workouts: []
      });
    }

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts
    });

  } catch (error) {
    console.error("[Workout Fetch Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workouts"
    });
  }
});

/**
 * @route   GET /api/workout/recent
 * @desc    Get 5 most recent workouts for authenticated user
 */
router.get("/recent", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.auth.sub })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      workouts
    });

  } catch (error) {
    console.error("[Recent Workouts Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent workouts"
    });
  }
});

/**
 * @route   GET /api/workouts/:id
 * @desc    Get single workout by ID
 */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workout ID"
      });
    }

    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.auth.sub
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.status(200).json({
      success: true,
      workout
    });

  } catch (error) {
    console.error("[Single Workout Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout"
    });
  }
});

/**
 * @route   PUT /api/workouts/:id
 * @desc    Update a workout
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name || !exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Workout name and exercises are required"
      });
    }

    const updatedWorkout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.auth.sub // Ensure user owns the workout
      },
      {
        name,
        exercises,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      workout: updatedWorkout
    });

  } catch (error) {
    console.error("[Workout Update Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to update workout"
    });
  }
});

/**
 * @route   DELETE /api/workouts/:id
 * @desc    Delete a workout
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedWorkout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.sub // Ensure user owns the workout
    });

    if (!deletedWorkout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully"
    });

  } catch (error) {
    console.error("[Workout Delete Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workout"
    });
  }
});

/**
 * @route   GET /api/workouts/progress
 * @desc    Get workout progress data for charts
 */
router.get("/progress", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.auth.sub })
      .sort({ date: 1 })
      .lean();

    const progressData = workouts.map(workout => {
      const totalVolume = workout.exercises.reduce((acc, exercise) => {
        return acc + exercise.sets.reduce((setAcc, set) => {
          const weight = set.unit === 'lb' ? set.weight * 0.453592 : set.weight;
          return setAcc + (weight * set.reps);
        }, 0);
      }, 0);

      return {
        date: workout.date,
        totalVolume,
        workoutId: workout._id,
        name: workout.name
      };
    });

    res.status(200).json({
      success: true,
      progressData
    });

  } catch (error) {
    console.error("[Progress Data Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress data"
    });
  }
});

export default router;