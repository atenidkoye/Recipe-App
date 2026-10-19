
import type { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../utils/http-status.js";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
};
