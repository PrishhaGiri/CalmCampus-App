
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const feelings = [
  { id: "better", icon: "😊", label: "Much Better" },
  { id: "calm", icon: "😌", label: "Calmer" },
  { id: "same", icon: "😐", label: "About the Same" },
  { id: "unsure", icon: "🤔", label: "Not Sure" },
];

const invitations = [
  {
    id: "coffee",
    icon: "☕",
    title: "Let's Grab Coffee!",
    message:
      "Hey! Would you like to grab a coffee sometime this week? It would be nice to catch up! ☕",
  },
  {
    id: "walk",
    icon: "🌿",
    title: "Let's Go for a Walk!",
    message:
      "Hey! Want to take a little break and go for a walk together? 🌿",
  },
  {
    id: "study",
    icon: "📚",
    title: "Let's Study Together!",
    message:
      "Hey! Want to have a study session together? We can keep each other motivated! 📚",
  },
  {
    id: "music",
    icon: "🎶",
    title: "Let's Enjoy Some Music!",
    message:
      "Hey! Want to hang out and listen to some music together? 🎶",
  },
  {
    id: "checkin",
    icon: "💚",
    title: "Just Checking In",
    message:
      "Hey! Just wanted to check in. How have you been doing lately? 💚",
  },
];

function Reflection() {
  const navigate = useNavigate();
  const location = useLocation();

  const mood = location.state?.mood || "";
  const activities = location.state?.activities || [];

  const [feeling, setFeeling] = useState("");
  const [reflection, setReflection] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState("coffee");
  const [customMessage, setCustomMessage] = useState(
    invitations[0].message
  );
  const [copyStatus, setCopyStatus] = useState("");

  const chosenInvitation = invitations.find(
    (invitation) => invitation.id === selectedInvitation
  );

  const handleInvitationSelect = (invitation) => {
    setSelectedInvitation(invitation.id);
    setCustomMessage(invitation.message);
    setCopyStatus("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopyStatus("Invitation copied!");
    } catch {
      setCopyStatus(
        "Unable to copy automatically. Please select and copy the message."
      );
    }
  };

  const handleShare = async () => {
    if (!customMessage.trim()) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share the Calm",
          text: customMessage,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setCopyStatus("Sharing unavailable. Try copying the message.");
        }
      }
    } else {
      await handleCopy();
    }
  };

  const handleFinish = () => {
    // Reflection is currently kept in local component state.
    // We can save it to the database when the backend is ready.
    navigate("/checkin", { replace: true });
  };

  return (
    <main className="reflection-page">
      <div className="reflection-decoration reflection-deco-left" />
      <div className="reflection-decoration reflection-deco-right" />

      <div className="reflection-container">
        <button
          type="button"
          className="reflection-back"
          onClick={() =>
            navigate("/hobbies", {
              state: { mood },
            })
          }
        >
          ← Back
        </button>

        <div className="reflection-heading">
          <span className="reflection-heading-icon">🌸</span>
          <h1>Take a Moment to Reflect</h1>
          <p>
            Every small step toward feeling better matters.
          </p>
        </div>

        {activities.length > 0 && (
          <div className="reflection-activity-summary">
            <span>Activities you explored:</span>
            <strong>{activities.join(", ")}</strong>
          </div>
        )}

        <section className="reflection-panel">
          <h2>How do you feel now?</h2>
          <p className="reflection-section-subtitle">
            There's no right or wrong answer. Just check in with yourself.
          </p>

          <div className="reflection-feelings">
            {feelings.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`reflection-feeling-card ${
                  feeling === item.id
                    ? "reflection-feeling-selected"
                    : ""
                }`}
                onClick={() => setFeeling(item.id)}
                aria-pressed={feeling === item.id}
              >
                <span className="reflection-feeling-icon">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="reflection-journal">
            <label htmlFor="reflection-notes">
              A moment of reflection
              <span> (optional)</span>
            </label>

            <textarea
              id="reflection-notes"
              rows="3"
              maxLength={1000}
              placeholder="What helped you today? How are you feeling?"
              value={reflection}
              onChange={(event) =>
                setReflection(event.target.value)
              }
            />

            <span className="reflection-character-count">
              {reflection.length}/1000
            </span>
          </div>
        </section>

        <section className="reflection-ripple">
          <div className="reflection-ripple-icon">💚</div>

          <div className="reflection-ripple-content">
            <h2>A little kindness can create a ripple.</h2>
            <p>
              Invite someone to share a moment of calm and
              spread positivity together.
            </p>
          </div>

          <button
            type="button"
            className="reflection-share-button"
            onClick={() => setShowShareModal(true)}
          >
            Share the Calm <span>→</span>
          </button>
        </section>

        <button
          type="button"
          className="reflection-finish-button"
          onClick={handleFinish}
        >
          Finish <span>✓</span>
        </button>

        <p className="reflection-footer-message">
          Thank you for taking a moment for yourself today. 🌿
        </p>
      </div>

      {/* Share the Calm popup */}
      {showShareModal && (
        <div
          className="reflection-modal-overlay"
          onClick={() => setShowShareModal(false)}
        >
          <section
            className="reflection-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-calm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="reflection-modal-close"
              onClick={() => setShowShareModal(false)}
              aria-label="Close Share the Calm"
            >
              ×
            </button>

            <div className="reflection-modal-heading">
              <span>💚</span>
              <h2 id="share-calm-title">Share the Calm</h2>
              <p>
                Choose an activity to invite someone to enjoy
                and spread positivity.
              </p>
            </div>

            <div className="reflection-invitation-grid">
              {invitations.map((invitation) => (
                <button
                  key={invitation.id}
                  type="button"
                  className={`reflection-invitation-card ${
                    selectedInvitation === invitation.id
                      ? "reflection-invitation-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleInvitationSelect(invitation)
                  }
                  aria-pressed={
                    selectedInvitation === invitation.id
                  }
                >
                  <span className="reflection-invitation-icon">
                    {invitation.icon}
                  </span>

                  <span>{invitation.title}</span>
                </button>
              ))}
            </div>

            <div className="reflection-message-area">
              <label htmlFor="reflection-invitation-message">
                Personalize your invitation
              </label>

              <textarea
                id="reflection-invitation-message"
                rows="3"
                maxLength={500}
                value={customMessage}
                onChange={(event) => {
                  setCustomMessage(event.target.value);
                  setCopyStatus("");
                }}
              />
            </div>

            <div className="reflection-share-actions">
              <button
                type="button"
                className="reflection-copy-button"
                onClick={handleCopy}
                disabled={!customMessage.trim()}
              >
                Copy Invitation
              </button>

              <button
                type="button"
                className="reflection-send-button"
                onClick={handleShare}
                disabled={!customMessage.trim()}
              >
                Share Invitation →
              </button>
            </div>

            {copyStatus && (
              <p className="reflection-copy-status" role="status">
                {copyStatus}
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default Reflection;
