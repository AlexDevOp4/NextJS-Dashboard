import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket inactivity
      useNewUrlParser: true, // Safe defaults (though not needed in modern versions)
      useUnifiedTopology: true, // Safe defaults
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit the app if the database connection fails
  }
};

// Attach listeners to monitor connection status
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Export the connection function
export default connectDB;
