import mongoose from "mongoose";
const { Schema } = mongoose;

const Tasks = new Schema({
  task: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, default: "pending" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  completed: { type: Boolean, default: false },
  createdAt : { type: Date, default: Date.now },
});

export default mongoose.model("Task", Tasks);
