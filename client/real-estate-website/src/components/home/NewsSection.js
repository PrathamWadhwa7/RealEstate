import React, { useState, useEffect } from 'react';
import noidaImage from '../../assets/images/noida.png';
import axios from 'axios';

const NewsSection = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4); 

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

  const loadMore = () => {
    setVisibleCount(prev => prev + 4); 
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
      
      <div className="news-grid">
        {newsArticles.slice(0, visibleCount).map(article => (
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
              <p className="snippet">{article.content}</p>
              <button className="read-more">Read More</button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < newsArticles.length && (
        <button className="view-all" onClick={loadMore}>
          Load More
        </button>
      )}
    </section>
  );
};

export default NewsSection;