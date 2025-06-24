// src/components/home/FaqSection.js
import React, { useState } from 'react';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What are the benefits of investing in Greater Noida?',
      answer: 'Greater Noida offers excellent connectivity, planned infrastructure, and is home to several upcoming projects like the Jewar Airport and Film City, making it a prime location for real estate investment with high growth potential.'
    },
    {
      question: 'How is the Yamuna Expressway for property investment?',
      answer: 'Yamuna Expressway is one of the fastest growing real estate corridors in NCR, with world-class infrastructure, proximity to the upcoming Jewar Airport, and several industrial and commercial developments driving demand.'
    },
    {
      question: 'What is the price range for properties in these areas?',
      answer: 'Property prices vary based on location, type, and amenities. Generally, residential properties in Greater Noida start from ₹30 lakhs, while Yamuna Expressway properties start from ₹40 lakhs. Commercial and industrial properties have different pricing structures.'
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-accordion">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              {faq.question}
            </button>
            <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <button className="view-all-faqs">View All FAQs</button> */}
    </section>
  );
};

export default FaqSection;