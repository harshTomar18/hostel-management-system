import React from "react";
import "./Home.css";
import Portfolio from "./Portfolio";

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-image-box">
          <div className="glass-card">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Team Work"
              className="hero-img"
            />
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Build Amazing Web Experiences with Us
          </h1>

          <p className="hero-text">
            We craft modern, fast & high-quality digital products with
            pixel-perfect UI and smooth functionality, helping your business
            stand out.
          </p>

          <button className="hero-btn">Explore More</button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <h2 className="section-title">Our Key Features</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>High Performance</h3>
            <p>
              Optimized solutions delivering fast loading, seamless navigation
              & high responsiveness.
            </p>
          </div>

          <div className="feature-card">
            <h3>Modern Design</h3>
            <p>
              Clean UI with professional layouts, animations, and enhanced user
              experience.
            </p>
          </div>

          <div className="feature-card">
            <h3>Secure & Reliable</h3>
            <p>
              Fully secure systems with proper encryption, authentication &
              backend optimization.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PORTFOLIO ================= */}
      <section className="portfolio-section">
        <Portfolio />
      </section>
    </div>
  );
};

export default Home;
