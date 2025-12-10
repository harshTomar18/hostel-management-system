import React from "react";
import "./Contact.css";

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-wrapper">
                <h1 className="contact-title">Contact Us</h1>

                <form className="contact-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="your@email.com" />
                    </div>

                    <div className="form-group">
                        <label>Your Message</label>
                        <textarea rows="5" placeholder="How can we help?"></textarea>
                    </div>

                    <button className="contact-btn">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
