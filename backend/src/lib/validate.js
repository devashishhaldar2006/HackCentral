import validator from "validator";

export const validateSignUpData = (req) => {
  const { fullName, email, password, role } = req.body;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!fullName || !email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
  if (role && !["user", "organizer"].includes(role)) {
    throw new Error("Invalid role selection");
  }
  passwordRegex.test(password) ||
    (() => {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters",
      );
    })();
  return true;
};

export const validateSignInData = (req) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (role && !["user", "organizer"].includes(role)) {
    throw new Error("Invalid role selection");
  }
  return true;
};
