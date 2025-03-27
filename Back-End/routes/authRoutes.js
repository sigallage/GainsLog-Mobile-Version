import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { expressjwt as jwtMiddleware } from "express-jwt";
import jwks from "jwks-rsa";

dotenv.config();
const router = express.Router();

// Middleware to Protect Routes
const checkJwt = jwtMiddleware({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Auth0 Login (Handled on Frontend)
router.post("/login", async (req, res) => {
  res.status(200).json({ message: "Login via Auth0" });
});

// Get User Profile (Protected)
router.get("/profile", checkJwt, async (req, res) => {
  res.json({ user: req.auth });
});

export default router;
