import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL;

// Country Ingredient Database (fallback)
const COUNTRY_INGREDIENTS = {
  italy: ["tomatoes", "olive oil", "pasta", "basil", "garlic"],
  japan: ["rice", "soy sauce", "fish", "seaweed", "ginger"],
  mexico: ["corn", "beans", "chili peppers", "avocado", "lime"],
  // Add more countries as needed
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
  // Add more diet types
};

// Get country ingredients (improved)
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
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    return null;
  }
};

// Recipe Generator Route
router.post("/generate", async (req, res) => {
  const { dietType = "vegetarian", country = "italy" } = req.body;
  const ingredients = getCountryIngredients(country).join(", ");

  const prompt = `Create a detailed ${dietType} recipe from ${country} using mainly: ${ingredients}.
  Format:
  - Dish Name: [name]
  - Ingredients: [list with measurements]
  - Instructions: [numbered steps]
  - Nutrition: [calories, macros]`;

  // Try OpenRouter first
  try {
    const aiRecipe = await generateWithOpenRouter(prompt);
    if (aiRecipe) {
      return res.json({
        source: "openrouter",
        recipe: aiRecipe
      });
    }
  } catch (error) {
    console.log("OpenRouter failed, trying fallbacks...");
  }

  // Fallback to local LLM if configured
  if (LOCAL_LLM_URL) {
    try {
      const response = await axios.post(
        LOCAL_LLM_URL,
        { prompt },
        { timeout: 5000 }
      );
      if (response.data?.result) {
        return res.json({
          source: "local_llm",
          recipe: response.data.result
        });
      }
    } catch (error) {
      console.log("Local LLM failed:", error.message);
    }
  }

  // Ultimate fallback to hardcoded recipes
  const fallbackRecipe = 
    FALLBACK_RECIPES[dietType]?.[country.toLowerCase()] || 
    FALLBACK_RECIPES[dietType]?.default || 
    "Recipe generation unavailable. Please try different parameters.";

  res.json({
    source: "fallback",
    recipe: fallbackRecipe
  });
});

export default router;