// // src/components/home/HeroSection.js
// import React from 'react';
// import property from '../../assets/images/property.png';

// const HeroSection = () => {
//   return (
//     <section className="hero-section"
//     style={{
//       backgroundImage: `url(${property})`,
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center center',
//       backgroundSize: 'cover'
//     }}>
//       <div className="hero-content">
//         <h1>Unlock Your Future: Properties in Greater Noida & Yamuna Exp. 2025</h1>
//         <p>Your Trusted Partner for Premier Real Estate Opportunities.</p>
//         <button className="cta-button">Search Your Dream Property Now</button>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


// src/components/home/HeroSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import property from '../../assets/images/property.png';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    // Navigate to the properties page
    navigate('/properties');
  };

  return (
    <section className="hero-section"
      style={{
        backgroundImage: `url(${property})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }}>
      <div className="hero-content">
        <h1>Unlock Your Future: Properties in Greater Noida & Yamuna Exp. 2025</h1>
        <p>Your Trusted Partner for Premier Real Estate Opportunities.</p>
        <button className="cta-button" onClick={handleCTAClick}>
          Search Your Dream Property Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;