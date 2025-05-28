import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Alternative free AI providers
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL; // Optional: For self-hosted models

router.post('/generate', async (req, res) => {
  const { level = 'beginner', experience = '4', workoutType = 'strength' } = req.body;

  // 1. First try Hugging Face with correct endpoint format
  try {
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/pipeline/text-generation/mistralai/Mistral-7B-Instruct-v0.1',
      {
        inputs: `[INST] Create a ${level} ${workoutType} workout for ${experience} weeks experience [/INST]`,
        parameters: { max_new_tokens: 500 }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    if (hfResponse.data?.generated_text) {
      return res.json({
        source: 'huggingface',
        workout: hfResponse.data.generated_text
      });
    }
  } catch (hfError) {
    console.log('Hugging Face failed:', hfError.message);
  }

  // 2. Fallback to OpenRouter.ai
  try {
    const orResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'user',
            content: `Generate a ${level} ${workoutType} workout for ${experience} weeks experience`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (orResponse.data?.choices?.[0]?.message?.content) {
      return res.json({
        source: 'openrouter',
        workout: orResponse.data.choices[0].message.content
      });
    }
  } catch (orError) {
    console.log('OpenRouter failed:', orError.message);
  }

  // 3. Final fallback - Local LLM or hardcoded response
  try {
    if (LOCAL_LLM_URL) {
      const localResponse = await axios.post(
        LOCAL_LLM_URL,
        {
          prompt: `WORKOUT PROMPT: ${level} ${workoutType} ${experience} weeks`
        },
        { timeout: 5000 }
      );
      return res.json({
        source: 'local_llm',
        workout: localResponse.data?.result || 'Local model response empty'
      });
    }
  } catch (localError) {
    console.log('Local LLM failed:', localError.message);
  }

  // Ultimate fallback - Hardcoded workouts
  const fallbackWorkouts = {
    beginner: {
      strength: `🏋️ Warm-up:
1. Bodyweight squats - 2x10
2. Arm circles - 1min

🔥 Main Workout:
1. Push-ups - 3x8
2. Dumbbell rows - 3x10
3. Bodyweight lunges - 3x8 per leg

🧘 Cooldown:
1. Hamstring stretch - 30sec
2. Chest stretch - 30sec`
    },
    intermediate: {
      hiit: `🔥 HIIT Workout (40s work/20s rest):
1. Jump squats
2. Burpees
3. Mountain climbers
4. Plank shoulder taps
5. Jumping lunges`
    }
  };

  res.json({
    source: 'fallback',
    workout: fallbackWorkouts[level]?.[workoutType] || fallbackWorkouts.beginner.strength
  });
});

export default router;