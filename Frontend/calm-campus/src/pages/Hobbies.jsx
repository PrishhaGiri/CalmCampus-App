
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";

// All available hobbies
const activities = [
  {
    id: "art",
    title: "Art & Painting",
    description: "Express yourself through colors.",
    icon: "🎨",
    category: "Creative",
    color: "creative",
  },
  {
    id: "sports",
    title: "Sports & Fitness",
    description: "Move, play, and recharge your energy.",
    icon: "👟",
    category: "Sports",
    color: "sports",
  },
  {
    id: "music",
    title: "Music & Singing",
    description: "Find your rhythm and unwind.",
    icon: "🎧",
    category: "Music",
    color: "music",
  },
  {
    id: "social",
    title: "Meet New Friends",
    description: "Connect through shared interests.",
    icon: "☕",
    category: "Social",
    color: "social",
  },
  {
    id: "wellness",
    title: "Yoga & Mindfulness",
    description: "Relax your mind and body.",
    icon: "🧘‍♀️",
    category: "Wellness",
    color: "wellness",
  },
  {
    id: "journal",
    title: "Journaling",
    description: "Put your thoughts into words.",
    icon: "📖",
    category: "Creative",
    color: "journal",
  },
];

// Filter categories
const categories = [
  { name: "All", icon: "▦" },
  { name: "Creative", icon: "🎨" },
  { name: "Sports", icon: "🏃" },
  { name: "Music", icon: "♫" },
  { name: "Social", icon: "♧" },
  { name: "Wellness", icon: "🪷" },
];

// Recommendations based on the selected emotion
const moodRecommendations = {
  Angry: {
    emoji: "😠",
    title: "Feeling Angry?",
    message: "Move your body.",
    category: "Sports",
    activityId: "sports",
  },
  Lonely: {
    emoji: "🥺",
    title: "Feeling Lonely?",
    message: "Connect with others.",
    category: "Social",
    activityId: "social",
  },
  Sad: {
    emoji: "😔",
    title: "Feeling Sad?",
    message: "Try something creative.",
    category: "Creative",
    activityId: "art",
  },
  Happy: {
    emoji: "😊",
    title: "Feeling Happy?",
    message: "Enjoy what you love.",
    category: "All",
    activityId: null,
  },
  "Not Sure": {
    emoji: "🤷‍♀️",
    title: "Not Sure?",
    message: "Explore at your own pace.",
    category: "All",
    activityId: null,
  },
  "Exam Stress": {
    emoji: "📚",
    title: "Feeling Stressed?",
    message: "Take a mindful break.",
    category: "Wellness",
    activityId: "wellness",
  },
};

function Hobbies() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive the mood selected on the Emotion Check-In page
  const mood = location.state?.mood || "";

  const recommendation = moodRecommendations[mood];

  // State management
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [activeActivity, setActiveActivity] = useState(null);

  // Filter activities by category
  const visibleActivities = activities.filter(
    (activity) =>
      activeCategory === "All" ||
      activity.category === activeCategory
  );

  // Select or deselect a hobby
  const toggleActivity = (id) => {
    setSelectedActivities((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  // Open an activity
  const handleExplore = (activity) => {
    if (activity.id === "wellness") {
      // Reuse the existing Breathing & Meditation page
      navigate("/stress-relief", {
        state: {
          mood,
          from: "/hobbies",
        },
      });
      return;
    }

    // Show the details popup for other hobbies
    setActiveActivity(activity);
  };

  // Select an activity from the popup
  const handleChooseActivity = () => {
    if (!activeActivity) return;

    setSelectedActivities((previous) =>
      previous.includes(activeActivity.id)
        ? previous
        : [...previous, activeActivity.id]
    );

    setActiveActivity(null);
  };

  // Apply a personalized recommendation
  const handleRecommendation = () => {
    if (!recommendation) return;

    setActiveCategory(recommendation.category);

    if (recommendation.activityId) {
      setSelectedActivities((previous) =>
        previous.includes(recommendation.activityId)
          ? previous
          : [...previous, recommendation.activityId]
      );
    }
  };

  // Continue to Reflection
  const handleDone = () => {
    const chosenActivities = selectedActivities
      .map((id) => activities.find((activity) => activity.id === id))
      .filter(Boolean)
      .map((activity) => activity.title);

    navigate("/reflection", {
      state: {
        mood,
        activities: chosenActivities,
      },
    });
  };

  return (
    <main className="hobbies-page">
      {/* Decorative background */}
      <div className="hobbies-background-shape hobbies-shape-one" />
      <div className="hobbies-background-shape hobbies-shape-two" />

      {/* Back button: Logo is now in the shared Navbar */}
      <header className="hobbies-header">
        <button
          type="button"
          className="hobbies-back-btn"
          onClick={() =>
            navigate("/checkin", {
              state: { mood },
            })
          }
        >
          ← Back
        </button>
      </header>

      {/* Personalized mood recommendation */}
      {recommendation && showRecommendation && (
        <aside className="hobbies-recommendation">
          <span
            className="recommendation-emoji"
            aria-hidden="true"
          >
            {recommendation.emoji}
          </span>

          <div className="recommendation-copy">
            <strong>{recommendation.title}</strong>

            <span>Recommendation:</span>

            <button
              type="button"
              className="recommendation-action"
              onClick={handleRecommendation}
            >
              {recommendation.message}
            </button>
          </div>

          <button
            type="button"
            className="recommendation-close"
            onClick={() => setShowRecommendation(false)}
            aria-label="Dismiss recommendation"
          >
            ×
          </button>
        </aside>
      )}

      {/* Main content */}
      <section className="hobbies-content">
        <div className="hobbies-title">
          <h1>Explore Hobbies</h1>

          <p>
            Find activities that match your mood and help you feel better.
          </p>
        </div>

        {/* Category filters */}
        <div
          className="hobbies-filters"
          aria-label="Activity categories"
        >
          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              className={`hobbies-filter ${
                activeCategory === category.name ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category.name)}
              aria-pressed={activeCategory === category.name}
            >
              <span aria-hidden="true">
                {category.icon}
              </span>

              {category.name}
            </button>
          ))}
        </div>

        {/* Hobby cards */}
        <div className="hobbies-grid">
          {visibleActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              selected={selectedActivities.includes(activity.id)}
              onSelect={toggleActivity}
              onExplore={handleExplore}
            />
          ))}
        </div>

        {/* Done button */}
        <button
          type="button"
          className="hobbies-done-btn"
          onClick={handleDone}
        >
          Done <span aria-hidden="true">→</span>
        </button>
      </section>

      {/* Activity details popup */}
      {activeActivity && (
        <div
          className="hobby-modal-overlay"
          onClick={() => setActiveActivity(null)}
        >
          <section
            className="hobby-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hobby-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hobby-modal-close"
              onClick={() => setActiveActivity(null)}
              aria-label="Close activity details"
            >
              ×
            </button>

            <div
              className="hobby-modal-icon"
              aria-hidden="true"
            >
              {activeActivity.icon}
            </div>

            <h2 id="hobby-modal-title">
              {activeActivity.title}
            </h2>

            <p>{activeActivity.description}</p>

            <p className="hobby-modal-tip">
              {activeActivity.id === "art" &&
                "Try sketching something around you or painting for 10 minutes."}

              {activeActivity.id === "sports" &&
                "Try a short walk, gentle stretching, or a game you enjoy."}

              {activeActivity.id === "music" &&
                "Listen to a favorite song, sing, or try a simple rhythm."}

              {activeActivity.id === "social" &&
                "Message a friend, invite someone for coffee, or join a student activity."}

              {activeActivity.id === "journal" &&
                "Write three sentences about your day or something you're grateful for."}
            </p>

            <button
              type="button"
              className="hobby-modal-select"
              onClick={handleChooseActivity}
            >
              Choose This Activity
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Hobbies;

