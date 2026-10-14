import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Read the secret used to verify JWT access tokens from environment variables.
const JWT_SECRET = process.env.JWT_SECRET;

// Stop the application from starting if the secret is missing.
// Without it, the server cannot safely verify authentication tokens.
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

// Extend the Express request type to include the authenticated user's database ID.
// The ID is added only after a token has been successfully verified.
export interface AuthRequest extends Request {
  userId?: number;
}

// Middleware that protects routes by requiring a valid JWT access token.
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Read the Authorization header supplied by the client.
  const authHeader = req.headers.authorization;

  // Reject the request if no token was provided.
  if (!authHeader) {
    res.status(401).json({
      message: "Access denied. No token provided.",
    });
    return;
  }

  // Split the header into its authentication scheme and token.
  // The expected format is: Authorization: Bearer <token>.
  const [scheme, token, ...extraParts] = authHeader.split(" ");

  // Reject malformed headers, missing tokens, or unexpected extra parts.
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
    // Verify the token's signature and expiration using the server's secret.
    // Invalid or expired tokens cause jwt.verify() to throw an error.
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the decoded payload contains a valid, positive integer user ID.
    // This prevents an unexpected token payload from being trusted.
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

    // Attach the verified user ID to the request so downstream handlers
    // can identify which user is making the request.
    req.userId = decoded.userId;

    // Continue to the next middleware or route controller.
    next();
  } catch {
    // Return a generic error without exposing internal token verification details.
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};