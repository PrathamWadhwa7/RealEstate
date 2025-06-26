import React, { useState, useEffect } from 'react';
import Header from '../components/shared/Header';
import StickyContact from '../components/shared/StickyContact';
import { useNavigate } from 'react-router-dom';
import './service.css';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services/');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading services: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
    <div className="services-page">
      <h1>Our Services</h1>
      
      {services.map((service, index) => (
        <div key={service._id} className="service-item">
          <div className="service-image">
            <img src={service.image.url} alt={service.name} />
          </div>
          <div className="service-content">
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            
            <div className="service-features">
              <h3>Key Features</h3>
              <ul>
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="service-price">
              Starting from: ₹{service.price.toLocaleString()}
              <span> (price may vary based on requirements)</span>
            </div>
            
            <button onClick={() => navigate('/contact')} className="enquire-button">Enquire Now</button>
          </div>
        </div>
      ))}
    </div>
   < StickyContact/>
    </>
  );
};

export default ServicesPage;