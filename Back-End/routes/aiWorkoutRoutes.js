import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

router.post("/generate", async (req, res) => {
  const { level, experience, workoutType } = req.body; // Include workout type

  const prompt = `
You are a professional fitness coach. Create a structured ${level} workout plan for someone with ${experience} weeks of gym experience. Focus on a ${workoutType} routine.
Return the workout in this format:
Warm-up:
- [Exercise 1]
- [Exercise 2]

Workout:
- [Exercise 1]: [Sets] x [Reps]
- [Exercise 2]: [Sets] x [Reps]

Cooldown:
- [Stretch 1]
- [Stretch 2]

Do not add explanations. Just output the structured workout.
`;

  try {
    const response = await axios.post(
      HF_MODEL_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    console.log("AI Response:", response.data);
    res.json({ workout: response.data[0].generated_text });
  } catch (error) {
    console.error("Hugging Face AI Error:", error);
    res.status(500).json({ error: "Failed to generate workout plan." });
  }
});

export default router;
