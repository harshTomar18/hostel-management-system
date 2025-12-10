import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3 className="footer-logo">Brand</h3>
                    <p className="footer-description">
                        Creating digital experiences that matter. We build professional, high-quality websites for businesses of all sizes.
                    </p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/portfolio">Portfolio</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <ul className="footer-contact">
                        <li>123 Innovation Drive</li>
                        <li>Tech City, TC 90210</li>
                        <li>hello@brand.com</li>
                        <li>+1 (555) 123-4567</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="#" className="social-icon">Li</a>
                        <a href="#" className="social-icon">Tw</a>
                        <a href="#" className="social-icon">In</a>
                        <a href="#" className="social-icon">Fb</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Brand. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
