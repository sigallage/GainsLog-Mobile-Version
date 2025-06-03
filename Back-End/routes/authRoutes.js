import express from "express";
import dotenv from "dotenv";
import { checkJwt } from "../middleware/middleware.js";
import User from "../models/User.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { body, validationResult } from "express-validator";

dotenv.config();
const router = express.Router();

// ======================
// SECURITY MIDDLEWARE
// ======================
router.use(helmet());
router.use(express.json({ limit: "10kb" })); // Body size limit

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later."
    });
  }
});



// ======================
// WEBHOOK VALIDATION
// ======================
const validateWebhook = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const expectedToken = `Bearer ${process.env.AUTH0_WEBHOOK_SECRET}`;
  
  if (!authHeader || authHeader !== expectedToken) {
    return res.status(403).json({ 
      success: false,
      message: "Unauthorized: Invalid webhook token" 
    });
  }
  next();
};

// ======================
// ROUTES
// ======================

/**
 * @route POST /save-user
 * @desc Create or update user from Auth0 (webhook)
 */
router.post(
  "/users",
  authLimiter,
  validateWebhook,
  [
    body("userId").isString().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("name").optional().trim().escape(),
    body("picture").optional().isURL()
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { userID, email, name, picture } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        { userID },
        { 
          name: name || email.split('@')[0],
          email,
          profilePic: picture,
          lastActive: new Date() 
        },
        { 
          new: true,
          upsert: true,
          setDefaultsOnInsert: true 
        }
      );

      // Sanitize output
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      };

      res.status(200).json({ 
        success: true,
        user: userResponse 
      });

    } catch (error) {
      console.error("[User Save Error]", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to process user data",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /profile
 * @desc Get authenticated user's profile
 */
router.get(
  "/profile",
  authLimiter,
  checkJwt,
  async (req, res) => {
    try {
      const user = await User.findOne({ userID: req.auth.sub })
        .select("-_id -__v -createdAt -updatedAt");

      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User profile not found" 
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error("[Profile Fetch Error]", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch profile" 
      });
    }
  }
);

/**
 * @route GET /check-user/:userID
 * @desc Check if user exists in database
 */
router.get(
  "/check-user/:userID",
  authLimiter,
  async (req, res) => {
    try {
      const exists = await User.exists({ 
        userID: req.params.userID 
      });
      
      res.json({ 
        success: true,
        exists: Boolean(exists) 
      });

    } catch (error) {
      console.error("[User Check Error]", error);
      res.status(500).json({ 
        success: false,
        message: "Server error during user check" 
      });
    }
  }
);

export { validateWebhook };

export default router;