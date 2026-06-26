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

// ai validators
export const validateProjectEvaluationData = (req) => {
  const { title, description, techStack } = req.body;

  const allowedFields = [
    "title",
    "description",
    "techStack",
  ];

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key),
  );

  if (invalidFields.length > 0) {
    throw new ValidationError(
      `Invalid fields: ${invalidFields.join(", ")}`,
    );
  }

  if (!title || !description) {
    throw new ValidationError(
      "Project title and description are required",
    );
  }

  if (typeof title !== "string") {
    throw new ValidationError(
      "Project title must be a string",
    );
  }

  if (typeof description !== "string") {
    throw new ValidationError(
      "Project description must be a string",
    );
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (
    trimmedTitle.length < 3 ||
    trimmedTitle.length > 100
  ) {
    throw new ValidationError(
      "Project title must be between 3 and 100 characters",
    );
  }

  if (
    trimmedDescription.length < 20 ||
    trimmedDescription.length > 5000
  ) {
    throw new ValidationError(
      "Project description must be between 20 and 5000 characters",
    );
  }

  if (techStack !== undefined) {
    if (typeof techStack !== "string") {
      throw new ValidationError(
        "Tech stack must be a string",
      );
    }

    if (techStack.trim().length > 500) {
      throw new ValidationError(
        "Tech stack cannot exceed 500 characters",
      );
    }
  }

  return true;
};

export const validatePitchDeckData = (req) => {
  const {
    title,
    problem,
    solution,
    targetAudience,
    techStack,
  } = req.body;

  const allowedFields = [
    "title",
    "problem",
    "solution",
    "targetAudience",
    "techStack",
  ];

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key),
  );

  if (invalidFields.length > 0) {
    throw new ValidationError(
      `Invalid fields: ${invalidFields.join(", ")}`,
    );
  }

  if (!title || !problem || !solution) {
    throw new ValidationError(
      "Title, problem and solution are required",
    );
  }

  validateOptionalTextField(
    "Project title",
    title,
    3,
    100,
  );

  validateOptionalTextField(
    "Problem statement",
    problem,
    20,
    3000,
  );

  validateOptionalTextField(
    "Solution",
    solution,
    20,
    3000,
  );

  if (
    targetAudience !== undefined &&
    targetAudience !== ""
  ) {
    validateOptionalTextField(
      "Target audience",
      targetAudience,
      2,
      500,
    );
  }

  if (
    techStack !== undefined &&
    techStack !== ""
  ) {
    validateOptionalTextField(
      "Tech stack",
      techStack,
      2,
      500,
    );
  }

  return true;
};

//organizer areas

export const validateEventSubmissionData = (req) => {
  const {
    title,
    description,
    startDate,
    endDate,
    category,
    mode,
    price,
    location,
    venue,
    registrationLink,
    image,
    organizer,
    tags,
  } = req.body;

  const allowedFields = [
    "title",
    "description",
    "startDate",
    "endDate",
    "location",
    "venue",
    "image",
    "category",
    "mode",
    "price",
    "registrationLink",
    "organizer",
    "tags",
  ];

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length) {
    throw new ValidationError(
      `Invalid fields: ${invalidFields.join(", ")}`
    );
  }

  // 1. Required Fields Check
  if (!title || !startDate || !category || !mode) {
    throw new ValidationError(
      "Title, start date, category and mode are required"
    );
  }

  // 2. Title & Description
  validateOptionalTextField("Event title", title, 3, 100);
  if (description) {
    validateOptionalTextField("Event description", description, 10, 5000);
    req.body.description = description.trim();
  }
  req.body.title = title.trim();

  // 3. Dates
  const parsedStart = new Date(startDate);
  if (isNaN(parsedStart.getTime())) {
    throw new ValidationError("Invalid start date format");
  }
  req.body.startDate = parsedStart;

  if (endDate) {
    const parsedEnd = new Date(endDate);
    if (isNaN(parsedEnd.getTime())) {
      throw new ValidationError("Invalid end date format");
    }
    if (parsedEnd < parsedStart) {
      throw new ValidationError("End date must be greater than or equal to start date");
    }
    req.body.endDate = parsedEnd;
  }

  // 4. Enums
  const allowedCategories = ["Conference", "Hackathon", "Workshop", "Expo", "Meetup", "Entertainment", "Competition"];
  if (!allowedCategories.includes(category)) {
    throw new ValidationError(`Invalid category. Allowed: ${allowedCategories.join(", ")}`);
  }

  const allowedModes = ["Online", "Offline", "Hybrid"];
  if (!allowedModes.includes(mode)) {
    throw new ValidationError(`Invalid mode. Allowed: ${allowedModes.join(", ")}`);
  }

  if (price && !["Free", "Paid"].includes(price)) {
    throw new ValidationError("Price must be either Free or Paid");
  }

  // 5. URLs
  if (registrationLink) {
    if (!isValidHttpUrl(registrationLink)) {
      throw new ValidationError("Invalid registration link URL");
    }
  }

  if (image) {
    if (!isValidHttpUrl(image)) {
      throw new ValidationError("Invalid promotional image URL");
    }
  }

  // 6. Text Fields
  if (location) {
    validateOptionalTextField("Location", location, 2, 200);
    req.body.location = location.trim();
  }
  if (venue) {
    validateOptionalTextField("Venue", venue, 2, 200);
    req.body.venue = venue.trim();
  }
  if (organizer) {
    validateOptionalTextField("Organizer", organizer, 2, 100);
    req.body.organizer = organizer.trim();
  }

  // 7. Tags
  if (tags) {
    validateOptionalStringArray("Tags", tags, 10);
    req.body.tags = tags.map(tag => tag.trim());
  }

  return true;
};

