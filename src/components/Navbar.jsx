import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Brand
                </Link>

                {/* Hamburger Icon */}
                <div className="menu-icon" onClick={toggleMenu}>
                    <div className={isOpen ? "bar bar1 active" : "bar bar1"}></div>
                    <div className={isOpen ? "bar bar2 active" : "bar bar2"}></div>
                    <div className={isOpen ? "bar bar3 active" : "bar bar3"}></div>
                </div>

                {/* Nav Menu */}
                <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/about" className="nav-link" onClick={toggleMenu}>About</Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/services" className="nav-link" onClick={toggleMenu}>Services</Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/portfolio" className="nav-link" onClick={toggleMenu}>Portfolio</Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/contact" className="nav-link" onClick={toggleMenu}>Contact</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
