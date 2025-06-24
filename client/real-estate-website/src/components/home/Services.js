// src/components/home/Services.js
import React from 'react';
import { FaHome, FaHandshake, FaChartLine, FaSearchDollar } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: <FaHome />,
      title: 'Property Buying',
      description: 'Expert guidance to find your dream home with the best deals.'
    },
    {
      id: 2,
      icon: <FaHandshake />,
      title: 'Property Selling',
      description: 'Maximize your returns with our strategic selling approach.'
    },
    {
      id: 3,
      icon: <FaChartLine />,
      title: 'Investment Advisory',
      description: 'Data-driven insights for profitable real estate investments.'
    },
    {
      id: 4,
      icon: <FaSearchDollar />,
      title: 'Property Valuation',
      description: 'Accurate market valuation for your property.'
    }
  ];

  return (
    <section className="services-section">
      <h2>Our Comprehensive Real Estate Services</h2>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button className="learn-more">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;