// src/components/home/WhyInvest.js
import React from 'react';
import { FaRoad, FaChartLine, FaBuilding } from 'react-icons/fa';

const WhyInvest = () => {
  return (
    <section className="why-invest">
      <h2>Why Invest in Greater Noida & Yamuna Expressway?</h2>
      
      <div className="benefits-grid">
        <div className="benefit-card">
          <FaRoad className="benefit-icon" />
          <h3>Excellent Connectivity</h3>
          <p>Proximity to Jewar Airport, Yamuna Expressway, and major highways.</p>
        </div>
        
        <div className="benefit-card">
          <FaChartLine className="benefit-icon" />
          <h3>High Growth Potential</h3>
          <p>One of the fastest growing real estate markets in NCR.</p>
        </div>
        
        <div className="benefit-card">
          <FaBuilding className="benefit-icon" />
          <h3>World-Class Infrastructure</h3>
          <p>Developed by GNIDA and YEIDA with modern amenities.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyInvest;