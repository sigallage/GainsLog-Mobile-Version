import mongoose from 'mongoose';

const airecipeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dietType: { type: String, required: true },
  country: { type: String, required: true },
  prompt: { type: String, required: true },
  generateRecipe: { type: String, required: true },
  modelUsed: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('aiRecipe', airecipeSchema);
