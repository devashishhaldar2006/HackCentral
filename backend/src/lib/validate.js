import validator from "validator";

export const validateSignUpData = (req) => {
  const { fullName, email, password } = req.body;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!fullName || !email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
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
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  return true;
};
