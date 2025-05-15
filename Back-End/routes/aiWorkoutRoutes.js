import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

router.post("/generate", async (req, res) => {
  const { level, experience, workoutType } = req.body;

  const prompt = `
You are an expert personal trainer. Create a professional ${level} workout plan for someone with ${experience} weeks of gym experience, focused on ${workoutType}.
The workout must include:
- A warm-up section (2-3 exercises)
- A main workout section (at least 5 strength exercises, with sets, reps, and rest times)
- A cooldown section (2-3 stretching exercises)

Follow this strict format:
---
🏋️ Warm-up:
1. [Exercise] - [Duration or Reps]

🔥 Main Workout:
1. [Exercise] - [Sets] x [Reps] - [Rest Time]
2. [Exercise] - [Sets] x [Reps] - [Rest Time]
3. [Exercise] - [Sets] x [Reps] - [Rest Time]
4. [Exercise] - [Sets] x [Reps] - [Rest Time]
5. [Exercise] - [Sets] x [Reps] - [Rest Time]

🧘 Cooldown:
1. [Stretch] - [Duration]
2. [Stretch] - [Duration]

Only return the structured workout plan. Do NOT return this prompt. Do NOT add extra explanations.
`;

  try {
    const response = await axios.post(
      HF_MODEL_URL,
      {
        inputs: prompt,
        parameters: { max_new_tokens: 500 } // Ensures full response length
      },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    console.log("AI Response:", response.data); // Log response for debugging

    // Extract the generated workout from response
    const workoutPlan = response.data.generated_text || (response.data[0] && response.data[0].generated_text);

    if (!workoutPlan) {
      throw new Error("Workout generation failed.");
    }

    res.json({ workout: workoutPlan }); // Send only the workout to frontend
  } catch (error) {
    console.error("Hugging Face AI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate workout plan." });
  }
});

export default router;
