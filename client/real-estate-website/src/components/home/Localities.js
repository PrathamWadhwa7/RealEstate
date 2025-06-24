// src/components/home/Localities.js
import React from 'react';
import Slider from 'react-slick';

const Localities = ({ localities }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1
  };

  return (
    <section className="localities-section">
      <h2>Explore Top Localities in Greater Noida & Yamuna Expressway</h2>
      
      <Slider {...settings}>
        {localities.map(locality => (
          <div key={locality.id} className="locality-card">
            <img src={locality.image} alt={locality.name} />
            <div className="locality-details">
              <h3>{locality.name}</h3>
              <p>{locality.usp}</p>
              <button className="view-guide">View Guide</button>
            </div>
          </div>
        ))}
      </Slider>
      
      <button className="view-all">View All Interactive Maps</button>
    </section>
  );
};

export default Localities;