import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import { usersService } from "./users.services.js";

// Retrieves the authenticated user's profile.
export const getMyProfile = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = usersService.getProfile(req.userId!);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error
        ? error.message
        : "Could not retrieve profile"
    });
  }
};

// Updates the authenticated user's profile details.
export const updateMyProfile = (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = usersService.updateProfile(
      req.userId!,
      req.body
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Could not update profile"
    });
  }
};