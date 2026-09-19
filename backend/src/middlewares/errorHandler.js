import mongoose from "mongoose";
import { ValidationError } from "../lib/validate.js";
import { ENV } from "../lib/env.js";

export const handleError = (res, error, fallbackMessage = "Internal server error") => {
  if (!error || typeof error !== "object") {
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: fallbackMessage,
      },
      message: fallbackMessage,
    });
  }

  // Custom validation errors thrown by our validate.js
  if (error instanceof ValidationError || error.isValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
      },
      message: error.message,
    });
  }

  // Mongoose schema validation errors
  if (
    error.name === "ValidationError" ||
    error instanceof mongoose.Error.ValidationError
  ) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
      },
      message: error.message,
    });
  }

  // Mongoose cast errors (invalid ObjectId, etc.)
  if (
    error.name === "CastError" ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_FORMAT",
        message: "Invalid data format",
      },
      message: "Invalid data format",
    });
  }

  // String-based validation detection
  const msg = error?.message || "";
  const isValidation =
    msg.includes("required") ||
    msg.includes("Password must") ||
    msg.includes("Invalid");

  if (isValidation) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: msg,
      },
      message: msg,
    });
  }

  // Everything else -> 500
  console.error(`[${fallbackMessage}]:`, error);
  const isProd = ENV.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProd ? fallbackMessage : (error.message || fallbackMessage),
    },
    message: isProd ? fallbackMessage : (error.message || fallbackMessage),
  });
};

/**
 * Global 4-argument Express error-handling middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  return handleError(res, err, "An unexpected server error occurred");
};

