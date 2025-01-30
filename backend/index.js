import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";

import UserRoutes from "./routes/userRoutes.js";
import AuthRoutes from "./routes/authRoutes.js";
import TaskRoutes from "./routes/taskRoutes.js";

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/tasks", TaskRoutes);

// Start the server after DB connection is established
const PORT = process.env.PORT || 8080;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
