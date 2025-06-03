import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Link to Auth0 user ID
  name: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: [
        {
          weight: { type: Number, required: true },
          reps: { type: Number, required: true },
          unit: { type: String, enum: ["kg", "lb"], default: "kg" }
        }
      ]
    }
  ],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;