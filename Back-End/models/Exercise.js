import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // Example: Chest, Back, Legs
  equipment: { type: String },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);
export default Exercise;
