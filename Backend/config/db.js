
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected successfully!");

    // Show which database is actually connected
    console.log("Database name:", mongoose.connection.name);

    // Show which cluster/server is connected
    console.log("Database host:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;

