
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import moodRoutes from "./routes/mood.js";

dotenv.config();

const app = express();

// Allow both local development and deployed frontend

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://calmcampus-app.netlify.app",
    "https://nimble-kangaroo-ab5807.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CalmCampus API 🌿",
  });
});


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CalmCampus backend is running!",
  });
});

// Authentication routes
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 CalmCampus API running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();

