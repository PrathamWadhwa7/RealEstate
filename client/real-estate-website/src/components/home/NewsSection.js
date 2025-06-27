import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import noidaImage from '../../assets/images/noida.png';
import axios from 'axios';
import './NewsSection.css';

const NewsSection = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setNewsArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
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
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) {
    return <div className="loading-spinner">Loading news...</div>;
  }

  if (error) {
    return <div className="error-message">Error loading news: {error}</div>;
  }

  return (
    <section className="news-section">
      <h2>Real Estate News & Insights from Greater Noida & Yamuna Exp. 2025</h2>
      
      {newsArticles.length > 0 ? (
        <Slider {...settings}>
          {newsArticles.map(article => (
            <div key={article._id} className="news-card">
              <img src={article.image?.url || noidaImage} alt={article.title} />
              <div className="news-content">
                <h3>{article.title}</h3>
                <p className="date">
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="snippet">{article.content.substring(0, 100)}...</p>
                <button className="read-more">Read More</button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No news articles available at the moment.</p>
      )}
    </section>
  );
};

export default NewsSection;