
import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mood: {
      type: String,
      required: true,
      enum: [
        "Exam Stress",
        "Lonely",
        "Sad",
        "Happy",
        "Angry",
        "Not Sure",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Mood = mongoose.model("Mood", moodSchema);

export default Mood;
