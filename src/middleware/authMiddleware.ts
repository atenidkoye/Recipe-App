
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Access denied. No token provided.",
    });
    return;
  }

  const [scheme, token, ...extraParts] = authHeader.split(" ");

  if (
    scheme !== "Bearer" ||
    !token ||
    extraParts.length > 0
  ) {
    res.status(401).json({
      message: "Invalid authorization header format. Use Bearer <token>.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !Number.isSafeInteger(decoded.userId) ||
      decoded.userId <= 0
    ) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
