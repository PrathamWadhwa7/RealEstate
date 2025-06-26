import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './localities.css';

const Localities = () => {
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Areas');
        setLocalities(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocalities();
  }, []);

  if (loading) {
    return <div className="loading">Loading localities...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <section className="featured-listing">
      <h2>Explore Top Localities in Greater Noida & Yamuna Expressway</h2>
      
      {localities.length > 0 ? (
        <Slider {...settings}>
          {localities.map(locality => (
            <div key={locality._id} className="property-card">
              <img 
                src={locality.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Locality+Image'} 
                alt={locality.name} 
              />
              <div className="property-details">
                <h3>{locality.name}</h3>
                <p>
                  {locality.highlights?.majorAttractions?.join(' • ') || 'Prime location'}
                  {locality.highlights?.hasMetroConnectivity && ' • Metro Connectivity'}
                </p>
                <p>
                  Avg. Price: ₹{locality.highlights?.averagePricePerSqft?.toLocaleString() || 'NA'} per sqft
                </p>
                <button className="view-guide">View Guide</button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No localities available at the moment.</p>
      )}
      
      <button className="view-all">View All Interactive Maps</button>
    </section>
  );
};

export default Localities;