import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
const REST_COUNTRIES_API = "https://restcountries.com/v3.1/all";

// Function to get common ingredients for a country
const getCountryIngredients = async (country) => {
  try {
    const response = await axios.get(REST_COUNTRIES_API);
    const countryData = response.data.find(c => c.name.common.toLowerCase() === country.toLowerCase());

    if (countryData) {
      return countryData.demonyms.eng.m || "local ingredients";
    }
    return "local ingredients";
  } catch (error) {
    console.error("Error fetching country ingredients:", error.message);
    return "local ingredients";
  }
};

// AI Recipe Generator Route
router.post("/generate", async (req, res) => {
  const { dietType, country } = req.body;
  const ingredients = await getCountryIngredients(country);

  const prompt = `Create a ${dietType} meal using ingredients available in ${country}: ${ingredients}.
  - Include a dish name
  - List of ingredients with measurements
  - Step-by-step cooking instructions
  - Macronutrients (calories, protein, fat, carbs)
  - Keep it short and structured`;

  try {
    const response = await axios.post(
      HF_MODEL_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    res.json({ recipe: response.data[0].generated_text });
  } catch (error) {
    console.error("Hugging Face AI Error:", error);
    res.status(500).json({ error: "Failed to generate recipe." });
  }
});

export default router;
