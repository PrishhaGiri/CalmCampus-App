
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { apiRequest } from "../services/api";
import { saveSession } from "../services/auth";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/api/users/signup", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (!data.token || !data.user) {
        throw new Error("Invalid signup response from server.");
      }

      saveSession(data.token, data.user);

      navigate("/checkin", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>

        <p className="auth-subtitle">
          Create your account and begin your journey to calm.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="signup-name">Full Name</label>
          <input
            type="text"
            id="signup-name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="signup-email">Email Address</label>
          <input
            type="email"
            id="signup-email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Log In</Link>
        </p>

        <p className="auth-footer">
          Breathe · Refocus · Belong
        </p>
      </div>
    </div>
  );
}

export default Signup;


