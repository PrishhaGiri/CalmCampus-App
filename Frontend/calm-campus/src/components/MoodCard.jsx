
function MoodCard({ icon, label, color, selected, onClick }) {
  return (
    <button
      type="button"
      className={`mood-card mood-${color} ${
        selected ? "mood-card-selected" : ""
      }`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="mood-icon">{icon}</span>
      <span className="mood-label">{label}</span>
    </button>
  );
}

export default MoodCard;


