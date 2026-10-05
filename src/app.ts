import express from "express";
import authRoutes from "./features/auth/auth.routes.js";
import {
  authMiddleware,
  AuthRequest
} from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Recipe App API is running!"
  });
});

app.use("/api/auth", authRoutes);

app.get(
  "/api/protected",
  authMiddleware,
  (req: AuthRequest, res) => {
    res.json({
      message: "You are authenticated!",
      userId: req.userId
    });
  }
);

export default app;