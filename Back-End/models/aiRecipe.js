// models/Recipe.js
const recipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietType: { type: String, required: true },
  country: { type: String, required: true },
  generatedRecipe: { type: String, required: true },
  modelUsed: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Recipe', recipeSchema);