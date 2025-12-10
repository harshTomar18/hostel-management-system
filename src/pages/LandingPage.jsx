import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    // Hero slider state
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: "Modern Hostel Management",
            subtitle: "Streamline your hostel operations with our comprehensive management system",
            image: "/hero1.jpg"
        },
        {
            title: "Efficient Room Management",
            subtitle: "Track occupancy, manage bookings, and optimize space utilization",
            image: "/hero2.jpg"
        },
        {
            title: "Student-Centric Solutions",
            subtitle: "Enhance student experience with digital services and quick complaint resolution",
            image: "/hero3.jpg"
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const features = [
        {
            icon: "🏠",
            title: "Room Management",
            description: "Efficiently manage room allocations, track occupancy, and optimize space utilization in real-time."
        },
        {
            icon: "👥",
            title: "Student Portal",
            description: "Provide students with a dedicated portal to view their details, submit complaints, and access notices."
        },
        {
            icon: "📊",
            title: "Analytics Dashboard",
            description: "Get comprehensive insights with visual charts and statistics for informed decision-making."
        },
        {
            icon: "🔔",
            title: "Notice Board",
            description: "Instantly communicate important announcements and updates to all residents."
        },
        {
            icon: "🛠️",
            title: "Complaint Management",
            description: "Track and resolve student complaints efficiently with priority-based workflow."
        },
        {
            icon: "👨‍💼",
            title: "Staff Management",
            description: "Manage hostel staff information, roles, and contact details in one centralized system."
        }
    ];

    const testimonials = [
        {
            name: "Dr. Rajesh Kumar",
            role: "Hostel Warden",
            text: "This system has transformed how we manage our hostel. Everything is organized and accessible at our fingertips.",
            avatar: "👨‍🏫"
        },
        {
            name: "Priya Sharma",
            role: "Student Representative",
            text: "Finally, a platform where we can easily submit complaints and get quick responses. The interface is so intuitive!",
            avatar: "👩‍🎓"
        },
        {
            name: "Prof. Amit Patel",
            role: "Dean of Student Affairs",
            text: "The analytics and reporting features have made administrative decisions much more data-driven and efficient.",
            avatar: "👨‍💼"
        }
    ];

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-brand">
                        <h2>🏨 HostelHub</h2>
                    </div>
                    <div className="nav-links">
                        <a href="#about">About</a>
                        <a href="#features">Features</a>
                        <a href="#testimonials">Testimonials</a>
                        <Link to="/login" className="btn-primary">Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Slider */}
            <section className="hero-section">
                <div className="hero-slider">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <div className="hero-overlay"></div>
                            <div className="hero-content container">
                                <h1 className="hero-title">{slide.title}</h1>
                                <p className="hero-subtitle">{slide.subtitle}</p>
                                <div className="hero-buttons">
                                    <Link to="/register" className="btn-hero-primary">Get Started</Link>
                                    <a href="#features" className="btn-hero-secondary">Learn More</a>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Slider Controls */}
                    <button className="slider-btn prev" onClick={prevSlide}>
                        ‹
                    </button>
                    <button className="slider-btn next" onClick={nextSlide}>
                        ›
                    </button>

                    {/* Slider Indicators */}
                    <div className="slider-indicators">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            ></button>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">About HostelHub</h2>
                        <p className="section-subtitle">Your Complete Hostel Management Solution</p>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <p>
                                HostelHub is a comprehensive digital platform designed to streamline hostel operations
                                and enhance the living experience for students. Our system brings together room management,
                                student services, and administrative tools in one intuitive interface.
                            </p>
                            <p>
                                Built with modern technology and user-centric design, HostelHub helps hostel administrators
                                make data-driven decisions while providing students with easy access to essential services.
                            </p>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>500+</h3>
                                    <p>Students Managed</p>
                                </div>
                                <div className="stat-card">
                                    <h3>98%</h3>
                                    <p>Satisfaction Rate</p>
                                </div>
                                <div className="stat-card">
                                    <h3>24/7</h3>
                                    <p>System Availability</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Powerful Features</h2>
                        <p className="section-subtitle">Everything you need to manage your hostel efficiently</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">What People Say</h2>
                        <p className="section-subtitle">Trusted by hostel administrators and students</p>
                    </div>
                    <div className="testimonials-slider">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
                            >
                                <div className="testimonial-avatar">{testimonial.avatar}</div>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <h4 className="testimonial-name">{testimonial.name}</h4>
                                <p className="testimonial-role">{testimonial.role}</p>
                            </div>
                        ))}
                    </div>
                    <div className="testimonial-indicators">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                                onClick={() => setCurrentTestimonial(index)}
                            ></button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Hostel Management?</h2>
                        <p className="cta-subtitle">Join hundreds of hostels already using HostelHub</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn-cta-primary">Start Free Trial</Link>
                            <a href="#about" className="btn-cta-secondary">Schedule Demo</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3>HostelHub</h3>
                            <p>Modern hostel management made simple and efficient.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#about">About</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#testimonials">Testimonials</a></li>
                                <li><Link to="/login">Login</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#help">Help Center</a></li>
                                <li><a href="#contact">Contact Us</a></li>
                                <li><a href="#privacy">Privacy Policy</a></li>
                                <li><a href="#terms">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Connect</h4>
                            <div className="social-links">
                                <a href="#facebook">Facebook</a>
                                <a href="#twitter">Twitter</a>
                                <a href="#linkedin">LinkedIn</a>
                                <a href="#instagram">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 HostelHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
