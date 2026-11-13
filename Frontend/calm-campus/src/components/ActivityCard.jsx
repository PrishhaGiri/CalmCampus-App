
function ActivityCard({ activity, selected, onSelect, onExplore }) {
  return (
    <div
      className={`hobby-card hobby-${activity.color} ${
        selected ? "hobby-card-selected" : ""
      }`}
    >
      <button
        type="button"
        className="hobby-card-main"
        onClick={() => onSelect(activity.id)}
        aria-pressed={selected}
      >
        <span className="hobby-art" aria-hidden="true">
          {activity.icon}
        </span>

        <span className="hobby-card-copy">
          <strong>{activity.title}</strong>
          <span>{activity.description}</span>
        </span>

        {selected && (
          <span className="hobby-selected-mark" aria-label="Selected">
            ✓
          </span>
        )}
      </button>

      <button
        type="button"
        className="hobby-explore-arrow"
        onClick={() => onExplore(activity)}
        aria-label={`Explore ${activity.title}`}
        title={`Explore ${activity.title}`}
      >
        →
      </button>

      {activity.id === "wellness" && (
        <span className="hobby-extra-tag">
          🪷 Breathing & Meditation
        </span>
      )}
    </div>
  );
}

export default ActivityCard;
