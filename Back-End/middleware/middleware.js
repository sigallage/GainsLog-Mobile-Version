import { expressjwt as jwtMiddleware } from "express-jwt";
import jwks from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

export const checkJwt = jwtMiddleware({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// You can export other middleware here too
export { validateWebhook } from '../routes/authRoutes.js';