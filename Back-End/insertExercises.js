import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "./models/ExerciseModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const exercises = [
      {
        name: "Push-Up",
        description: "A bodyweight exercise targeting chest, shoulders, and triceps.",
        image: "https://example.com/pushup.jpg",
        instructions: [
          "Start in a plank position.",
          "Lower your body until chest nearly touches the floor.",
          "Push yourself back up.",
        ],
      },
      {
        name: "Squat",
        description: "A lower body exercise targeting quads, glutes, and hamstrings.",
        image: "https://example.com/squat.jpg",
        instructions: [
          "Stand with feet shoulder-width apart.",
          "Lower your hips back and down as if sitting in a chair.",
          "Push through your heels to return to standing.",
        ],
      },
    ];

    await Exercise.insertMany(exercises);
    console.log("Exercises inserted!");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));
