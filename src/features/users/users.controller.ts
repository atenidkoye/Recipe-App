import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import { usersService } from "./users.services.js";
import { HTTP_STATUS } from "../../utils/http-status.js";

// Retrieves the authenticated user's profile.
export const getMyProfile = (req: AuthRequest, res: Response) => {
  const user = usersService.getProfile(req.userId!);

  return res.status(HTTP_STATUS.OK).json({
    message: "Profile retrieved successfully",
    data: user,
  });
};

// Updates the authenticated user's profile details.
export const updateMyProfile = (req: AuthRequest, res: Response) => {
  const user = usersService.updateProfile(
    req.userId!,
    req.body
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Profile updated successfully",
    data: user,
  });
};