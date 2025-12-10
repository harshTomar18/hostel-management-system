import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const result = await registerUser(name, email, password);
    setLoading(false);

    if (result.status === "success") {
      setMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMsg("Error: " + (result.message || "Unknown error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Animated Side Panel */}
        <div className="auth-side-panel">
          <div className="side-panel-content">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            <h1 className="side-panel-title">Join Our Community</h1>
            <p className="side-panel-subtitle">Create your account and start managing your hostel efficiently</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Quick Setup</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {msg && (
                <div className={msg.includes("successful") ? "success-message" : "error-message"}>
                  {msg}
                </div>
              )}

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
