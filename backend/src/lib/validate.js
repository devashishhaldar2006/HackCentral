import validator from "validator";

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
