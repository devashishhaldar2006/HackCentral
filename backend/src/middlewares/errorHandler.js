import mongoose from "mongoose";
import { ValidationError } from "../lib/validate.js";

export const handleError = (res, error, fallbackMessage = "Internal server error") => {
  if (!error || typeof error !== 'object') {
    return res.status(500).json({ success: false, message: fallbackMessage, error: String(error) });
  }

  // Custom validation errors thrown by our validate.js
  if (error instanceof ValidationError || error.isValidationError) {
    return res.status(400).json({ success: false, message: error.message });
  }

  // Mongoose schema validation errors
  if (
    error.name === "ValidationError" ||
    error instanceof mongoose.Error.ValidationError
  ) {
    return res.status(400).json({ success: false, message: error.message });
  }

  // Mongoose cast errors (invalid ObjectId, etc.)
  if (
    error.name === "CastError" ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({ success: false, message: "Invalid data format" });
  }

  // String-based validation detection (for controllers that throw plain Errors)
  const msg = error?.message || "";
  const isValidation =
    msg.includes("required") ||
    msg.includes("Password must") ||
    msg.includes("Invalid");

  if (isValidation) {
    return res.status(400).json({ success: false, message: msg });
  }

  // Everything else → 500
  console.error(`[${fallbackMessage}]:`, error);
  res.status(500).json({ success: false, message: fallbackMessage });
};
