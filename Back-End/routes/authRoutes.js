import express from "express";
import dotenv from "dotenv";
import { expressjwt as jwtMiddleware } from "express-jwt";
import jwks from "jwks-rsa";
import User from "../models/User.js"; // Import User Model

dotenv.config();
const router = express.Router();

// Middleware to Protect Routes
const checkJwt = jwtMiddleware({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE, // Use API Identifier as audience
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

//  Save or Update User in MongoDB
router.post("/save-user", async (req, res) => {
  const { auth0Id, name, email, picture } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({ auth0Id, name, email, picture });
      await user.save();
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user" });
  }
});

//  Get User Profile (Protected)
router.get("/profile", checkJwt, async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.auth.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
