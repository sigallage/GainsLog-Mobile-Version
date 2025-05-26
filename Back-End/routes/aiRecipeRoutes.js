import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const router = express.Router();

// Recipe Model
const recipeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dietType: { type: String, required: true },
  country: { type: String, required: true },
  prompt: { type: String, required: true },
  generatedRecipe: { type: String, required: true },
  modelUsed: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL;

// Country Ingredient Database (fallback)
const COUNTRY_INGREDIENTS = {
  italy: ["tomatoes", "olive oil", "pasta", "basil", "garlic"],
  japan: ["rice", "soy sauce", "fish", "seaweed", "ginger"],
  mexico: ["corn", "beans", "chili peppers", "avocado", "lime"],
};

// Fallback recipes database
const FALLBACK_RECIPES = {
  vegetarian: {
    italy: "Caprese Salad...",
    japan: "Vegetable Tempura...",
    default: "Vegetable Stir Fry..."
  },
  vegan: {
    mexico: "Vegan Tacos...",
    default: "Chickpea Curry..."
  }
};

// Get country ingredients
const getCountryIngredients = (country) => {
  const normalizedCountry = country.toLowerCase();
  return COUNTRY_INGREDIENTS[normalizedCountry] || ["local vegetables", "spices", "staple grains"];
};

// Generate using OpenRouter
const generateWithOpenRouter = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );
    return {
      content: response.data.choices[0].message.content,
      model: "mistralai/mistral-7b-instruct"
    };
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    return null;
  }
};

// Recipe Generator Route
router.post("/generate", async (req, res) => {
  const { dietType = "vegetarian", country = "italy", userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const ingredients = getCountryIngredients(country).join(", ");
  const prompt = `Create a detailed ${dietType} recipe from ${country} using mainly: ${ingredients}.
  Format:
  - Dish Name: [name]
  - Ingredients: [list with measurements]
  - Instructions: [numbered steps]
  - Nutrition: [calories, macros]`;

  let generatedRecipe;
  let modelUsed = "fallback";

  try {
    // Try OpenRouter first
    const openRouterResult = await generateWithOpenRouter(prompt);
    if (openRouterResult) {
      generatedRecipe = openRouterResult.content;
      modelUsed = openRouterResult.model;
    } else {
      // Fallback to local LLM if configured
      if (LOCAL_LLM_URL) {
        const response = await axios.post(
          LOCAL_LLM_URL,
          { prompt },
          { timeout: 5000 }
        );
        if (response.data?.result) {
          generatedRecipe = response.data.result;
          modelUsed = "local_llm";
        }
      }
    }

    // Ultimate fallback
    if (!generatedRecipe) {
      generatedRecipe = 
        FALLBACK_RECIPES[dietType]?.[country.toLowerCase()] || 
        FALLBACK_RECIPES[dietType]?.default || 
        "Recipe generation unavailable. Please try different parameters.";
    }

    // Save to MongoDB
    const savedRecipe = await Recipe.create({
      userId,
      dietType,
      country,
      prompt,
      generatedRecipe,
      modelUsed
    });

    res.json({
      source: modelUsed,
      recipe: generatedRecipe,
      recipeId: savedRecipe._id
    });

  } catch (error) {
    console.error("Recipe generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate and save recipe",
      details: error.message 
    });
  }
});

// Get user's saved recipes
router.get("/user/:userId", async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch recipes",
      details: error.message 
    });
  }
});

export default router;