import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

// Create a router to group the authentication-related API endpoints.
const router = Router();

// Register a new user account.
// This route is public because users do not have a token yet.
router.post("/register", authController.register);

// Authenticate an existing user and return their login credentials/token.
router.post("/login", authController.login);

// Validate the user's access token.
// The authentication middleware checks the token before the controller runs.
router.get("/validation", authMiddleware, authController.validate);

// Export the router so it can be mounted in the main Express application.
export default router;