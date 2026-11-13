
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { clearSession } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleExit = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit CalmCampus?"
    );

    if (confirmExit) {
      clearSession();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="cc-navbar">
      <div className="cc-navbar-inner">
        {/* Logo on far left */}
        <button
          type="button"
          className="cc-navbar-logo"
          onClick={() => navigate("/checkin")}
          aria-label="Go to Emotion Check-In"
        >
          <Logo />
        </button>

        {/* Vertical divider */}
        <div className="cc-navbar-divider" />

        {/* Navigation aligned left */}
        <nav
          className="cc-navbar-links"
          aria-label="Main navigation"
        >
          <NavLink
            to="/checkin"
            className={({ isActive }) =>
              `cc-nav-link ${isActive ? "cc-nav-active" : ""}`
            }
          >
            <span className="cc-nav-icon">♡</span>
            <span>Check-In</span>
          </NavLink>

          <NavLink
            to="/stress-relief"
            className={({ isActive }) =>
              `cc-nav-link ${isActive ? "cc-nav-active" : ""}`
            }
          >
            <span className="cc-nav-icon">◌</span>
            <span>Breathe</span>
          </NavLink>

          <NavLink
            to="/hobbies"
            className={({ isActive }) =>
              `cc-nav-link ${isActive ? "cc-nav-active" : ""}`
            }
          >
            <span className="cc-nav-icon">✿</span>
            <span>Hobbies</span>
          </NavLink>
        </nav>

        {/* Exit stays on far right */}
        <button
          type="button"
          className="cc-navbar-exit"
          onClick={handleExit}
        >
          Exit ↗
        </button>
      </div>
    </header>
  );
}

export default Navbar;


