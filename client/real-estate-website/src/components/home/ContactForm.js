// // src/components/home/ContactForm.js
// import React, { useState } from 'react';

// const ContactForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission (API call or other logic)
//     console.log('Form submitted:', formData);
//     alert('Thank you for your query. We will contact you soon!');
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       message: ''
//     });
//   };

//   return (
//     <section className="contact-form-section">
//       <div className="contact-form-container">
//         <div className="form-content">
//           <h2>Ready to Find Your Perfect Property? Get Expert Advice.</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <textarea
//                 name="message"
//                 placeholder="Your Message/Query"
//                 value={formData.message}
//                 onChange={handleChange}
//               ></textarea>
//             </div>
//             <button type="submit" className="submit-button">Submit Query</button>
//           </form>
//         </div>
        
//         <div className="contact-info">
//           <h3>Contact Information</h3>
//           <div className="info-item">
//             <strong>Phone:</strong>
//             <a href="tel:+911234567890">+91 12345 67890</a>
//           </div>
//           <div className="info-item">
//             <strong>Email:</strong>
//             <a href="mailto:info@yourcompany.com">info@yourcompany.com</a>
//           </div>
//           <div className="info-item">
//             <strong>Office Address:</strong>
//             <p>123 Real Estate Tower, Sector Alpha, Greater Noida, UP 201310</p>
//           </div>
//           <div className="map-container">
//   <iframe 
//     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.715847987493!2d77.4921233150782!3d28.47444498248997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzI4LjAiTiA3N8KwMjknMzYuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
//     allowFullScreen 
//     loading="lazy"
//     title="Google Maps Location"
//     aria-label="Google Maps embed showing our office location at 123 Real Estate Tower, Sector Alpha, Greater Noida"
//   ></iframe>
// </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactForm;
import React, { useState } from 'react';
import axios from 'axios'; // Import axios

const ContactForm = () => {
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property: null, // Optional field; sending as null
        Area: null       // Optional field; sending as null
      });

      if (response.status === 200 || response.status === 201) {
        alert('Thank you for your query. We will contact you soon!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form-container">
        <div className="form-content">
          <h2>Ready to Find Your Perfect Property? Get Expert Advice.</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message/Query"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Submit Query</button>
          </form>
        </div>
        
        <div className="contact-info">
          <h3>Contact Information</h3>
          <div className="info-item">
            <strong>Phone:</strong>
            <a href="tel:+911234567890">+91 12345 67890</a>
          </div>
          <div className="info-item">
            <strong>Email:</strong>
            <a href="mailto:info@yourcompany.com">info@yourcompany.com</a>
          </div>
          <div className="info-item">
            <strong>Office Address:</strong>
            <p>123 Real Estate Tower, Sector Alpha, Greater Noida, UP 201310</p>
          </div>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.715847987493!2d77.4921233150782!3d28.47444498248997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzI4LjAiTiA3N8KwMjknMzYuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              allowFullScreen 
              loading="lazy"
              title="Google Maps Location"
              aria-label="Google Maps embed showing our office location at 123 Real Estate Tower, Sector Alpha, Greater Noida"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
