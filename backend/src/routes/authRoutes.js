import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", (req, res) => {
  // Handle user signup logic here
  try {
    const {fullName, email, password } = req.body;
    // Add your signup logic here
    res.status(201).json({ message: "User signed up successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while signing up user" });
  }
});