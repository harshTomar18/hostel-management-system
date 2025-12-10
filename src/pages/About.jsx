import React, { useState, useEffect } from "react";
import "./About.css";

const sliderImages = [
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", // team working together
  "https://images.unsplash.com/photo-1557682250-4c0f0b1b7b1e?auto=format&fit=crop&w=800&q=80", // collaboration
  "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif", // animated coding GIF
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4000); // 4s per slide

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-container">
      {/* IMAGE SLIDER */}
      <div className="about-slider">
        {sliderImages.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            alt={`about-slider-${index}`}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="about-content glass">
        <h1>About Us</h1>
        <p>
          We are a creative and passionate development team focused on building
          high-performance, user-friendly, and modern web applications.
          Our vision is to help businesses grow with technology that works.
        </p>

        <p>
          Our team leverages the latest tools, best practices, and innovative
          designs to deliver digital solutions that exceed expectations and
          drive results for our clients worldwide.
        </p>

        <button className="learn-btn">Learn More</button>
      </div>
    </div>
  );
};

export default About;
