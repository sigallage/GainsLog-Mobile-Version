// models/Workout.js
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  name: String,
  exercises: [
    {
      name: String,
      sets: [
        {
          weight: Number,
          reps: Number,
          unit: String,
        },
      ],
    },
  ],
  date: { type: Date, default: Date.now },
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;