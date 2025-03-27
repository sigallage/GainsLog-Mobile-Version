import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify Auth0 tokens
const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // Get public keys from Auth0
  }),
  audience: process.env.AUTH0_AUDIENCE, // Your Auth0 API identifier
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"], // Auth0 uses RS256 algorithm
});

export default authMiddleware;
