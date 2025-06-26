// src/pages/HomePage.js (updated)
import React, { useEffect, useState } from 'react';
import Header from '../components/shared/Header';
import HeroSection from '../components/home/HeroSection';
import SearchBox from '../components/home/SearchBox';
import FeaturedListings from '../components/home/FeaturedListing';
import WhyInvest from '../components/home/WhyInvest';
import Localities from '../components/home/Localities';
import TrustedPartners from '../components/home/TrustedPartners';
import Services from '../components/home/Services';
import Testimonials from '../components/home/Testimonials';
import NewsSection from '../components/home/NewsSection';
import FaqSection from '../components/home/FaqSection';
import ContactForm from '../components/home/ContactForm';
import Footer from '../components/shared/Footer';
import StickyContact from '../components/shared/StickyContact';
import { getProperties, getLocalities } from '../services/api';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, localitiesData] = await Promise.all([
          getProperties(),
          getLocalities()
        ]);
        setProperties(propertiesData);
        setLocalities(localitiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <Header />
      <HeroSection />
      <SearchBox />
      <FeaturedListings  />
      <WhyInvest />
      <Localities localities={localities} />
      <TrustedPartners />
      <Services />
      <Testimonials />
      <NewsSection />
      <FaqSection />
      <ContactForm />
      <Footer />
      <StickyContact />
    </div>
  );
};

export default HomePage;