import UserSchema from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import sendPasswordResetEmail from "../mailers/sendPasswordResetEmail.js";

// Register User
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Save user to the db
  try {
    const user = await UserSchema.create({
      username,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ user: user, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare passwords
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  user.token = token;
  await user.save();

  res.status(200).json({
    message: "User logged in successfully",
    token,
    user: { id: user._id, email: user.email },
  });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserSchema.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save hashed token and expiration in the database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send the reset token via email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to process password reset request" });
  }
};

// Reset Password

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the user with the matching reset token
    const user = await UserSchema.findOne({
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token has not expired
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Verify the token
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid)
      return res.status(400).json({ message: "Invalid token" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
