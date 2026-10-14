import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

export const authController = {
  // Register a new user by passing the request body to the authentication service.
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);

      // Return HTTP 201 to indicate that the account was created successfully.
      res.status(201).json({
        message: "Account created successfully",
        data: result
      });
    } catch (error) {
      // Extract the error message when available, otherwise use a fallback message.
      const message =
        error instanceof Error ? error.message : "Registration failed";

      // Use 409 for an email that is already registered; use 400 for other registration errors.
      const statusCode =
        message === "Email is already registered" ? 409 : 400;

      res.status(statusCode).json({ message });
    }
  },

  // Authenticate an existing user using the credentials in the request body.
  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);

      // Return HTTP 200 with the authentication result, typically including the user and token.
      res.status(200).json({
        message: "Login successful",
        data: result
      });
    } catch {
      // Use a generic message so the response does not reveal whether the email exists.
      res.status(401).json({
        message: "Invalid email or password"
      });
    }
  },

  // Respond when the authentication middleware has accepted the user's access token.
  async validate(req: Request, res: Response): Promise<void> {
    // HTTP 200 confirms that the validation request succeeded.
    res.status(200).send();
  }
};