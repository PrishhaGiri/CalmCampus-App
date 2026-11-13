
import express from "express";
import auth from "../middleware/auth.js";

import {
  createMood,
  getMyMoods,
} from "../controllers/mood.js";

const router = express.Router();

// Both endpoints require a valid JWT
router.post("/", auth, createMood);
router.get("/mine", auth, getMyMoods);

export default router;
