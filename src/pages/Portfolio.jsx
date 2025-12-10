import React from "react";
import "./Portfolio.css";

const Portfolio = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      category: "Web Development",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Finance Dashboard",
      category: "UI/UX Design",
      image:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Travel App",
      category: "Mobile App",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Corporate Branding",
      category: "Branding",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>Our Portfolio</h1>
        <p>
          Some of our best work delivered across industries with creativity,
          precision, and innovation.
        </p>
      </div>

      <div className="portfolio-list">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`portfolio-item ${
              index % 2 === 1 ? "reverse-layout" : ""
            }`}
          >
            <div className="portfolio-img">
              <img src={project.image} alt={project.title} />
            </div>

            <div className="portfolio-content">
              <span className="portfolio-tag">{project.category}</span>
              <h2>{project.title}</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
                temporibus facere vitae fugiat! Aliquam, illo earum. Id neque
                magni libero!
              </p>

              <button className="portfolio-btn">View Project</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
