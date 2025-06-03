
import mongoose from 'mongoose';

const aiworkoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  level: { type: String, required: true },
  experience: { type: String, required: true },
  workoutType: { type: String, required: true },
  prompt: { type: String, required: true },
  generatedWorkout: { type: String, required: true },
  modelUsed: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('aiWorkout', aiworkoutSchema);

