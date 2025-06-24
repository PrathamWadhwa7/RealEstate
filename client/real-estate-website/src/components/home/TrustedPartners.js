// src/components/home/TrustedPartners.js
import React from 'react';
import Slider from 'react-slick';
import JewarImage from '../../assets/images/jewar.png'

const TrustedPartners = () => {
  const partners = [
    { id: 1, name: 'GNIDA', logo: JewarImage },
    { id: 2, name: 'YEIDA', logo: JewarImage },
    { id: 3, name: 'Sobha', logo: JewarImage },
    { id: 4, name: 'Godrej', logo: JewarImage },
    { id: 5, name: 'Gaurs', logo: JewarImage },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <section className="trusted-partners">
      <h2>Trusted by Leading Developers & Authorities</h2>
      <Slider {...settings}>
        {partners.map(partner => (
          <div key={partner.id} className="partner-logo">
             <img src={partner.logo} alt={partner.name} />
            {/* <img src={`/assets/images/${partner.logo}`} alt={partner.name} /> */}
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TrustedPartners;