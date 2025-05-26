// models/Workout.js
import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  generatedWorkout: { type: String, required: true },
  modelUsed: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Workout', workoutSchema);

