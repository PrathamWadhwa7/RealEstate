// src/pages/PropertyDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  if (loading) {
    return <div>Loading property details...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="property-details-page">
      <div className="property-images">
        {/* Image gallery would go here */}
        <img src={property.mainImage} alt={property.title} />
      </div>
      
      <div className="property-info">
        <h1>{property.title}</h1>
        <p className="price">₹{property.price.toLocaleString()}</p>
        <p className="location">{property.location}</p>
        
        <div className="details-grid">
          <div>
            <span>Type</span>
            <span>{property.type}</span>
          </div>
          <div>
            <span>BHK</span>
            <span>{property.bhk}</span>
          </div>
          <div>
            <span>Area</span>
            <span>{property.area} sq.ft.</span>
          </div>
          <div>
            <span>Status</span>
            <span>{property.status}</span>
          </div>
        </div>
        
        <h2>Description</h2>
        <p>{property.description}</p>
        
        <h2>Amenities</h2>
        <div className="amenities">
          {property.amenities.map((amenity, index) => (
            <span key={index}>{amenity}</span>
          ))}
        </div>
        
        <button className="contact-button">Contact Agent</button>
      </div>
    </div>
  );
};

export default PropertyDetails;