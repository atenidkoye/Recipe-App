import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        message: "Account created successfully",
        data: result
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";

      const statusCode =
        message === "Email is already registered" ? 409 : 400;

      res.status(statusCode).json({ message });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        message: "Login successful",
        data: result
      });
    } catch {
      res.status(401).json({
        message: "Invalid email or password"
      });
    }
  },

  async validate(req: Request, res: Response): Promise<void> {
    res.status(200).send();
  }
};