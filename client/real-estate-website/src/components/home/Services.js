// // src/components/home/Services.js
// import React from 'react';
// import { FaHome, FaHandshake, FaChartLine, FaSearchDollar } from 'react-icons/fa';

// const Services = () => {
//   const services = [
//     {
//       id: 1,
//       icon: <FaHome />,
//       title: 'Property Buying',
//       description: 'Expert guidance to find your dream home with the best deals.'
//     },
//     {
//       id: 2,
//       icon: <FaHandshake />,
//       title: 'Property Selling',
//       description: 'Maximize your returns with our strategic selling approach.'
//     },
//     {
//       id: 3,
//       icon: <FaChartLine />,
//       title: 'Investment Advisory',
//       description: 'Data-driven insights for profitable real estate investments.'
//     },
//     {
//       id: 4,
//       icon: <FaSearchDollar />,
//       title: 'Property Valuation',
//       description: 'Accurate market valuation for your property.'
//     }
//   ];

//   return (
//     <section className="services-section">
//       <h2>Our Comprehensive Real Estate Services</h2>
//       <div className="services-grid">
//         {services.map(service => (
//           <div key={service.id} className="service-card">
//             <div className="service-icon">{service.icon}</div>
//             <h3>{service.title}</h3>
//             <p>{service.description}</p>
//             <button className="learn-more">Learn More</button>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Services;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="services-section">
      <h2>Our Comprehensive Real Estate Services</h2>
      <div className="services-grid">
        {services.map(service => (
          <div key={service._id} className="service-card">
            <img src={service.image?.url} alt={service.name} className="service-image" />
            <h3>{service.name}</h3>
            <p>{service.description}</p>

            <ul className="feature-list">
              {service.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <p className="price">Starting at ₹{service.price}</p>
            <button className="learn-more">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
