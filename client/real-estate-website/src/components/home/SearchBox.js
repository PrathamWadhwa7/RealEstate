
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './search.css';
const SearchBox = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    budget: [0, 10000000],
    bhk: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e, index) => {
    const newBudget = [...searchParams.budget];
    newBudget[index] = parseInt(e.target.value);
    setSearchParams(prev => ({ ...prev, budget: newBudget }));
  };

  const handleSearch = () => {
    // Create query string from searchParams
    const queryParams = new URLSearchParams();
    
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.propertyType) queryParams.append('propertyType', searchParams.propertyType);
    if (searchParams.bhk) queryParams.append('bhk', searchParams.bhk);
    
    // Add budget range if it's not the default
    if (searchParams.budget[0] !== 0 || searchParams.budget[1] !== 10000000) {
      queryParams.append('minPrice', searchParams.budget[0]);
      queryParams.append('maxPrice', searchParams.budget[1]);
    }
    
    // Navigate to results page with query params
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <div className="search-box">
      <div className="search-fields">
        <select name="location" value={searchParams.location} onChange={handleChange}>
          <option value="">Select Location</option>
          <option value="greater-noida">Greater Noida</option>
          <option value="yamuna-exp">Yamuna Expressway</option>
          {/* Add more locations */}
        </select>
        
        <select name="propertyType" value={searchParams.propertyType} onChange={handleChange}>
          <option value="">Property Type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>
        
        <div className="budget-range">
          <label>Budget Range (₹)</label>
          <div className="range-inputs">
            <input 
              type="range" 
              min="0" 
              max="10000000" 
              value={searchParams.budget[0]} 
              onChange={(e) => handleBudgetChange(e, 0)}
            />
            <input 
              type="range" 
              min="0" 
              max="10000000" 
              value={searchParams.budget[1]} 
              onChange={(e) => handleBudgetChange(e, 1)}
            />
          </div>
          <div className="range-values">
            <span>₹{searchParams.budget[0].toLocaleString()}</span>
            <span>₹{searchParams.budget[1].toLocaleString()}</span>
          </div>
        </div>
        
        <select name="bhk" value={searchParams.bhk} onChange={handleChange}>
          <option value="">BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="4+">4+ BHK</option>
        </select>
      </div>
      
      <button className="search-button" onClick={handleSearch}>Search Properties</button>
    </div>
  );
};

export default SearchBox;