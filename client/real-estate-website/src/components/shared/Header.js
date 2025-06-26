// import React, { useState } from 'react';
// import { FaPhone, FaWhatsapp, FaBars } from 'react-icons/fa';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="header">
//       <div className="top-bar">
//         <div className="logo">Your Logo</div>
//         <div className="contact-icons">
//           <a href="tel:+1234567890"><FaPhone /></a>
//           <a href="https://wa.me/1234567890"><FaWhatsapp /></a>
//         </div>
//         {/* <div className="language-selector">
//           <select>
//             <option value="en">EN</option>
//             <option value="hi">HI</option>
//           </select>
//         </div> */}
//       </div>
      
//       <nav className="main-nav">
//         <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//           <FaBars />
//         </button>
        
//         <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
//           <a href="/">Home</a>
//           <a href="/properties">Properties</a>
//           <a href="/Areas">Areas</a>
//           <a href="/services">Services</a>
//           <a href="/blogs">News & Blog</a>
//           <a href="/about">About Us</a>
//           <a href="/contact">Contact Us</a>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="top-bar">
        {/* Left: Logo */}
        <div className="logo">Your Logo</div>

        {/* Center: Contact info */}
        <div className="center-contact">
          <FaPhone className="icon" />
          <span>+1 234 567 890</span>
          <FaEnvelope className="icon" style={{ marginLeft: '20px' }} />
          <span>info@example.com</span>
        </div>

        {/* Right: Language Selector */}
        <div className="language-selector">
          <select>
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
        </div>
      </div>

      <nav className="main-nav">
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="/">Home</a>
          <div className="dropdown">
    <a href="/properties" className="dropdown-toggle">Properties</a>
    <div className="dropdown-menu">
      <a href="/properties/residential">Residential</a>
      <a href="/properties/commercial">Commercial</a>
    </div>
  </div>

  <div className="dropdown">
    <a href="/areas" className="dropdown-toggle">Areas</a>
    <div className="dropdown-menu">
      <a href="/areas/downtown">Project1</a>
      <a href="/areas/suburban">Project2</a>
    </div>
  </div>
          <a href="/services">Services</a>
          <a href="/blogs">News & Blog</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
