
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { apiRequest } from "../services/api";
import {
  saveSession,
  startGuestSession,
} from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!data.token || !data.user) {
        throw new Error("Invalid login response from server.");
      }

      saveSession(data.token, data.user);

      navigate("/checkin", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    startGuestSession();
    navigate("/checkin", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>

        <h1>Welcome Back!</h1>
        <p className="auth-subtitle">
          Your peaceful space starts here.
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          New to CalmCampus?{" "}
          <Link to="/signup">Create an account</Link>
        </p>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="auth-guest-btn"
          onClick={handleGuest}
        >
          Continue as Guest
        </button>

        <p className="auth-footer">
          Breathe · Refocus · Belong
        </p>
      </div>
    </div>
  );
}

export default Login;

