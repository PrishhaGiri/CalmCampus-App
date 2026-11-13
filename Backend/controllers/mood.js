
import Mood from "../models/mood.js";

// Save a student's mood check-in
export const createMood = async (req, res) => {
  try {
    const { mood } = req.body;

    const allowedMoods = [
      "Exam Stress",
      "Lonely",
      "Sad",
      "Happy",
      "Angry",
      "Not Sure",
    ];

    if (!allowedMoods.includes(mood)) {
      return res.status(400).json({
        message: "Please select a valid mood.",
      });
    }

    const savedMood = await Mood.create({
      user: req.user._id,
      mood,
    });

    return res.status(201).json({
      message: "Mood check-in saved successfully!",
      mood: savedMood,
    });
  } catch (error) {
    console.error("Create mood error:", error.message);

    return res.status(500).json({
      message: "Unable to save mood check-in.",
    });
  }
};

// Retrieve the logged-in student's mood history
export const getMyMoods = async (req, res) => {
  try {
    const moods = await Mood.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("mood createdAt");

    return res.status(200).json({
      moods,
    });
  } catch (error) {
    console.error("Get moods error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve mood history.",
    });
  }
};
