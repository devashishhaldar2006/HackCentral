import validator from "validator";

const isValidHttpUrl = (value) =>
  validator.isURL(value, {
    protocols: ["http", "https"],
    require_protocol: true,
  });

const validateOptionalTextField = (fieldName, value, min, max) => {
  if (value === undefined) return;
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max} characters long`,
    );
  }
};

const validateOptionalStringArray = (fieldName, value, maxItems = 20) => {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  if (value.length > maxItems) {
    throw new Error(`${fieldName} array must not exceed ${maxItems} items`);
  }

  for (const item of value) {
    if (typeof item !== "string") {
      throw new Error(`${fieldName} entries must be strings`);
    }
    const trimmed = item.trim();
    if (!trimmed || trimmed.length > 50) {
      throw new Error(`${fieldName} entries must be 1 to 50 characters long`);
    }
  }
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters",
    );
  }
};
export const validateEmail = (email) => {
  if (!email) {
    throw new Error("Email is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }
};
export const validateSignUpData = (req) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid credentials");
  }
  if (role && !["user", "organizer"].includes(role)) {
    throw new Error("Invalid credentials");
  }
  validatePassword(password);
  return true;
};

export const validateSignInData = (req) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid credentials");
  }
  if (role && !["user", "organizer"].includes(role)) {
    throw new Error("Invalid credentials");
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
    throw new Error("Email, OTP, and new password are required");
  }
  validateEmail(email);
  if (String(otp).length < 4 || String(otp).length > 6 || !/^\d+$/.test(otp)) {
    throw new Error("Invalid OTP format");
  }
  validatePassword(newPassword);
  return true;
};

export const validateProfileUpdateData = (req) => {
  const {
    fullName,
    gender,
    avatar,
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
    "avatar",
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
    throw new Error(`Invalid profile fields: ${invalidFields.join(", ")}`);
  }

  if (fullName !== undefined) {
    validateOptionalTextField("Full name", fullName, 2, 50);
  }
  if (gender !== undefined && !["male", "female", "other"].includes(gender)) {
    throw new Error("Invalid gender");
  }
  if (avatar !== undefined && avatar !== "" && !isValidHttpUrl(avatar)) {
    throw new Error("Invalid avatar URL");
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
    if (!isValidHttpUrl(github) || !github.includes("github.com")) {
      throw new Error("Invalid GitHub URL");
    }
  }
  if (linkedin !== undefined && linkedin !== "") {
    if (!isValidHttpUrl(linkedin) || !linkedin.includes("linkedin.com")) {
      throw new Error("Invalid LinkedIn URL");
    }
  }

  if (website !== undefined) {
    if (req.user.role !== "organizer") {
      throw new Error("Website can only be updated by organizers");
    }
    if (website !== "" && !isValidHttpUrl(website)) {
      throw new Error("Invalid website URL");
    }
  }
  return true;
};
