
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodCard from "../components/MoodCard";

import { apiRequest } from "../services/api";
import { getSession } from "../services/auth";

function EmotionCheckIn() {
  const [selectedMood, setSelectedMood] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const moods = [
    {
      label: "Exam Stress",
      icon: "📚",
      color: "exam",
    },
    {
      label: "Lonely",
      icon: "♙",
      color: "lonely",
    },
    {
      label: "Sad",
      icon: "😢",
      color: "sad",
    },
    {
      label: "Happy",
      icon: "😊",
      color: "happy",
    },
    {
      label: "Angry",
      icon: "😠",
      color: "angry",
    },
    {
      label: "Not Sure",
      icon: "😕",
      color: "unsure",
    },
  ];

  const handleContinue = async () => {
    if (!selectedMood || saving) return;

    setError("");
    setSaving(true);

    try {
      const session = getSession();

      // Only registered students save moods to MongoDB.
      if (session?.mode === "user") {
        if (!session.token) {
          throw new Error("Please log in again.");
        }

        await apiRequest("/api/moods", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            mood: selectedMood,
          }),
        });
      }

      // Keep the original navigation behavior.
      if (selectedMood === "Exam Stress") {
        navigate("/stress-relief", {
          state: { mood: selectedMood },
        });
      } else {
        navigate("/hobbies", {
          state: { mood: selectedMood },
        });
      }
    } catch (err) {
      setError(
        err.message || "Unable to save your mood. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="checkin-page">
      {/* Decorative background */}
      <div className="checkin-blob blob-top" />
      <div className="checkin-blob blob-bottom" />

      <section className="checkin-container">
        <div className="checkin-heading">
          <div className="heading-rays">
            <span />
            <span />
            <span />
          </div>

          <h1>How are you feeling today?</h1>
          <div className="heading-underline" />
        </div>

        <div className="mood-grid">
          {moods.map((mood) => (
            <MoodCard
              key={mood.label}
              icon={mood.icon}
              label={mood.label}
              color={mood.color}
              selected={selectedMood === mood.label}
              onClick={() => {
                setSelectedMood(mood.label);
                setError("");
              }}
            />
          ))}
        </div>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="checkin-continue-btn"
          disabled={!selectedMood || saving}
          onClick={handleContinue}
        >
          {saving ? "Saving..." : "Continue"}
          {!saving && <span aria-hidden="true"> →</span>}
        </button>
      </section>
    </main>
  );
}

export default EmotionCheckIn;



