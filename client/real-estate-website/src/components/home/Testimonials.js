// src/components/home/Testimonials.js
import React from 'react';
import Slider from 'react-slick';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: 'Excellent service! Found my dream home in Greater Noida with their help.',
      name: 'Rahul Sharma',
      property: '3 BHK Apartment in Gaur City',
      rating: 5
    },
    {
      id: 2,
      quote: 'Transparent and professional. Highly recommend for property investments.',
      name: 'Priya Singh',
      property: 'Plot in Yamuna Expressway',
      rating: 5
    },
    {
      id: 3,
      quote: 'Best real estate advisors in NCR. Got a great deal on my commercial property.',
      name: 'Vikram Mehta',
      property: 'Office Space in Tech Zone',
      rating: 4
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-content">
        <h2>What Our Clients Say About Us</h2>
        <Slider {...settings}>
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="quote">"{testimonial.quote}"</p>
              <p className="client-name">{testimonial.name}</p>
              <p className="client-property">{testimonial.property}</p>
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      <div className="metrics-section">
        <h2>Our Impact in Numbers</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>500+</h3>
            <p>Satisfied Clients</p>
          </div>
          <div className="metric-card">
            <h3>200+</h3>
            <p>Positive Reviews</p>
          </div>
          <div className="metric-card">
            <h3>20+</h3>
            <p>Years of Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;