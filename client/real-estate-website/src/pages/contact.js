// src/pages/ContactUsPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './contact.css'; // Link CSS file
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import StickyContact from '../components/shared/StickyContact';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/leads', {
        ...formData,
        property: null,
        Area: null
      });
      if (response.status === 200 || response.status === 201) {
        alert('Thank you for your query. We will contact you soon!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <>
    <Header/>
    <section className="contact-us">
      <div className="contact-container">
        <div className="contact-form-box">
          <h2>Get in Touch With Us</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange}></textarea>
            <button type="submit">Submit Query</button>
          </form>
        </div>

        <div className="contact-info-box">
          <h3>Contact Information</h3>
          <p><strong>Phone:</strong> <a href="tel:+911234567890">+91 12345 67890</a></p>
          <p><strong>Email:</strong> <a href="mailto:info@yourcompany.com">info@yourcompany.com</a></p>
          <p><strong>Address:</strong> 123 Real Estate Tower, Sector Alpha, Greater Noida, UP 201310</p>
          <div className="map-box">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.715847987493!2d77.4921233150782!3d28.47444498248997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzI4LjAiTiA3N8KwMjknMzYuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              title="Map Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
    <StickyContact/>
    <Footer/>
    </>
  );
};

export default ContactUsPage;
