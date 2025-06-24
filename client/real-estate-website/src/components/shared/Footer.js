// src/components/shared/Footer.js
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>SKB Properties</h2>
          <p>Your trusted real estate partner in Greater Noida & Yamuna Expressway</p>
        </div>
        
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Properties</h3>
            <ul>
              <li><a href="/properties/residential">Flats in Greater Noida</a></li>
              <li><a href="/properties/commercial">Commercial Properties</a></li>
              <li><a href="/properties/plots">Plots on Yamuna Exp.</a></li>
              <li><a href="/properties/all">All Properties</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Localities</h3>
            <ul>
              <li><a href="/localities/greater-noida">Greater Noida</a></li>
              <li><a href="/localities/yamuna-expressway">Yamuna Expressway</a></li>
              <li><a href="/localities/jewar">Jewar</a></li>
              <li><a href="/localities/all">All Localities</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/rera">RERA</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="social-icons">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedin /></a>
          <a href="#"><FaYoutube /></a>
        </div>
        
        <div className="copyright">
          <p>© 2025 SKB Properties. All Rights Reserved | RERA Registered</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;