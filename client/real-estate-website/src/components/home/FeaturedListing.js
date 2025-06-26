import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './features.css';
import axios from 'axios';

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <section className="featured-listings">
      <h2>Featured Properties in Greater Noida & Yamuna Expressway (2025)</h2>
      
      {properties.length > 0 ? (
        <Slider {...settings}>
          {properties.map(property => (
            <div key={property._id} className="property-card">
              {/* Placeholder image - replace with actual property image from API if available */}
              <img 
                src={property.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Property+Image'} 
                alt={property.title} 
              />
              <div className="property-details">
                <h3>{property.title}</h3>
                <p className="price">
                  ₹{property.price?.amount?.toLocaleString() || 'Price not available'} {property.type}
                </p>
                <p className="location">
                  {property.highlights?.locality}, {property.highlights?.subLocality}
                </p>
                <p className="specs">
                  {property.highlights?.bedrooms} BHK • {property.highlights?.bathrooms} Bath • {property.highlights?.area}
                </p>
                <div className="features">
                  {property.highlights?.otherFeatures?.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <button className="view-details">View Details</button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No properties available at the moment.</p>
      )}
    </section>
  );
};

export default FeaturedListings;