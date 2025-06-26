// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import property from '../../assets/images/property.png';

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const handleCTAClick = () => {
//     // Navigate to the properties page
//     navigate('/properties');
//   };

//   return (
//     <section className="hero-section"
//       style={{
//         backgroundImage: `url(${property})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'center center',
//         backgroundSize: 'cover'
//       }}>
//       <div className="hero-content">
//         <h1>Unlock Your Future: Properties in Greater Noida & Yamuna Exp. 2025</h1>
//         <p>Your Trusted Partner for Premier Real Estate Opportunities.</p>
//         <button className="cta-button" onClick={handleCTAClick}>
//           Search Your Dream Property Now
//         </button>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import property1 from '../../assets/images/property.png';
import property2 from '../../assets/images/property.png';
import property3 from '../../assets/images/property.png';

const images = [property1, property2, property3];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = () => {
    navigate('/properties');
  };

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <div className="hero-overlay" />
      <div className="hero-content no-box">
        <h1>Unlock Your Future in Greater Noida & Yamuna Expressway</h1>
        <p>Your Trusted Partner for Premier Real Estate Opportunities.</p>
        <button className="cta-button" onClick={handleCTAClick}>
          Search Your Dream Property Now
        </button>
      </div>
    </section>
  );
};
export default HeroSection;
