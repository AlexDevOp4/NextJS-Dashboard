import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.model("User", userSchema);
