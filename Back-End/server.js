import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import aiWorkoutRoutes from "./routes/aiWorkoutRoutes.js"; // AI workout generation
import { rateLimit } from "express-rate-limit"; // Prevent API abuse
import aiRecipeRoutes from "./routes/aiRecipeRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173", // Development server
    "http://localhost", // Mobile app HTTP
    "https://localhost", // Mobile app HTTPS
    "http://10.0.2.2:5173", // Android emulator
    "capacitor://localhost", // Capacitor iOS
    "http://capacitor.localhost", // Capacitor Android
    "ionic://localhost", // Ionic
    "*" // Allow all origins for development (remove in production)
  ],
  credentials: true
}));

// Rate Limiting (prevents excessive API requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/users", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/aiworkouts", aiWorkoutRoutes); //AI workout endpoint
app.use("/api/airecipes", aiRecipeRoutes); 

const PORT = process.env.PORT || 5000;

// MongoDB Connection with Better Error Handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} and accessible from all interfaces`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit on failure
  });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});