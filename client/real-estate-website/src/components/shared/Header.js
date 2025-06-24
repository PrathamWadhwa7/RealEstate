// src/components/shared/Header.js
import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="logo">Your Logo</div>
        <div className="contact-icons">
          <a href="tel:+1234567890"><FaPhone /></a>
          <a href="https://wa.me/1234567890"><FaWhatsapp /></a>
        </div>
        {/* <div className="language-selector">
          <select>
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
        </div> */}
      </div>
      
      <nav className="main-nav">
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </button>
        
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a href="/localities">Localities</a>
          <a href="/projects">Projects</a>
          <a href="/blog">News & Blog</a>
          <a href="/services">Services</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;