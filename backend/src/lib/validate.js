import validator from "validator";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.isValidationError = true;
  }
}

const isValidHttpUrl = (value) =>
  validator.isURL(value, {
    protocols: ["http", "https"],
    require_protocol: true,
  });

const validateSocialUrl = (value, hostname) => {
  if (!isValidHttpUrl(value)) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.hostname === hostname || url.hostname.endsWith("." + hostname);
  } catch {
    return false;
  }
};

const validateOptionalTextField = (fieldName, value, min, max) => {
  if (value === undefined) return;
  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max} characters long`,
    );
  }
};

const validateOptionalStringArray = (fieldName, value, maxItems = 20) => {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`);
  }
  if (value.length > maxItems) {
    throw new ValidationError(
      `${fieldName} array must not exceed ${maxItems} items`,
    );
  }

  for (const item of value) {
    if (typeof item !== "string") {
      throw new ValidationError(`${fieldName} entries must be strings`);
    }
    const trimmed = item.trim();
    if (!trimmed || trimmed.length > 50) {
      throw new ValidationError(
        `${fieldName} entries must be 1 to 50 characters long`,
      );
    }
  }
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ValidationError(
      "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters",
    );
  }
};
export const validateEmail = (email) => {
  if (!email) {
    throw new ValidationError("Email is required");
  }
  if (!validator.isEmail(email)) {
    throw new ValidationError("Invalid email format");
  }
};
export const validateSignUpData = (req) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new ValidationError("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new ValidationError("Invalid credentials");
  }
  if (role && !["user", "organizer"].includes(role)) {
    throw new ValidationError("Invalid credentials");
  }
  validatePassword(password);
  return true;
};

export const validateSignInData = (req) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    throw new ValidationError("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new ValidationError("Invalid credentials");
  }
  if (role && !["user", "organizer"].includes(role)) {
    throw new ValidationError("Invalid credentials");
  }
  return true;
};

export const validateSendOTPData = (req) => {
  const { email } = req.body;
  validateEmail(email);
  return true;
};

export const validateVerifyOTPData = (req) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ValidationError("Email, OTP, and new password are required");
  }
  validateEmail(email);
  if (String(otp).length < 4 || String(otp).length > 6 || !/^\d+$/.test(otp)) {
    throw new ValidationError("Invalid OTP format");
  }
  validatePassword(newPassword);
  return true;
};

export const validateProfileUpdateData = (req) => {
  const {
    fullName,
    gender,
    college,
    location,
    skills,
    interests,
    github,
    linkedin,
    website,
  } = req.body;

  const allowedFields = [
    "fullName",
    "gender",
    "college",
    "location",
    "skills",
    "interests",
    "github",
    "linkedin",
    "website",
  ];

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key),
  );
  if (invalidFields.length > 0) {
    throw new ValidationError(
      `Invalid profile fields: ${invalidFields.join(", ")}`,
    );
  }

  if (fullName !== undefined) {
    validateOptionalTextField("Full name", fullName, 2, 50);
  }
  if (gender !== undefined && !["male", "female", "other"].includes(gender)) {
    throw new ValidationError("Invalid gender");
  }
  if (college !== undefined && college !== "") {
    validateOptionalTextField("College name", college, 2, 50);
  }
  if (location !== undefined && location !== "") {
    validateOptionalTextField("Location", location, 2, 50);
  }
  validateOptionalStringArray("Skills", skills);
  validateOptionalStringArray("Interests", interests);

  if (github !== undefined && github !== "") {
    if (!validateSocialUrl(github, "github.com")) {
      throw new ValidationError(
        "Invalid GitHub URL (must be https://github.com/...",
      );
    }
  }
  if (linkedin !== undefined && linkedin !== "") {
    if (!validateSocialUrl(linkedin, "linkedin.com")) {
      throw new ValidationError(
        "Invalid LinkedIn URL (must be https://linkedin.com/...",
      );
    }
  }

  if (website !== undefined) {
    if (req.user.role !== "organizer") {
      throw new ValidationError("Website can only be updated by organizers");
    }
    if (website !== "" && !isValidHttpUrl(website)) {
      throw new ValidationError("Invalid website URL");
    }
  }
  return true;
};

export const validatePasswordChangeData = (req) => {
  const { currentPassword, newPassword } = req.body;

  const allowedFields = ["currentPassword", "newPassword"];
  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key),
  );
  if (invalidFields.length > 0) {
    throw new ValidationError(
      `Invalid password fields: ${invalidFields.join(", ")}`,
    );
  }

  if (!currentPassword || !newPassword) {
    throw new ValidationError("Current and new passwords are required");
  }

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    throw new ValidationError("Current and new passwords must be strings");
  }

  if (
    currentPassword.trim() !== currentPassword ||
    newPassword.trim() !== newPassword
  ) {
    throw new ValidationError(
      "Passwords must not contain leading or trailing spaces",
    );
  }

  if (currentPassword === newPassword) {
    throw new ValidationError(
      "New password must be different from current password",
    );
  }

  validatePassword(newPassword);
  return true;
};

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB

export const validateAvatarUpload = (req) => {
  // Multer error handling (file too large, unexpected field, etc.)
  if (req.multerError) {
    if (req.multerError.code === "LIMIT_FILE_SIZE") {
      throw new ValidationError("Avatar file must be smaller than 5 MB");
    }
    if (req.multerError.code === "LIMIT_UNEXPECTED_FILE") {
      throw new ValidationError(
        "Only JPG, PNG, and WebP images are allowed for avatars",
      );
    }
    throw new ValidationError("File upload error: " + req.multerError.message);
  }

  if (!req.file) {
    throw new ValidationError("Avatar image file is required");
  }

  // Double-check mime type (defense-in-depth; multer fileFilter already checks)
  if (!ALLOWED_AVATAR_TYPES.includes(req.file.mimetype)) {
    throw new ValidationError(
      "Invalid file type. Only JPG, PNG, and WebP images are allowed",
    );
  }

  // Double-check size (defense-in-depth; multer limits already checks)
  if (req.file.size && req.file.size > MAX_AVATAR_SIZE) {
    throw new ValidationError("Avatar file must be smaller than 5 MB");
  }

  return true;
};
