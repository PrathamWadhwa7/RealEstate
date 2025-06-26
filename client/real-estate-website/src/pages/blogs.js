import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiX } from 'react-icons/fi';
import Header from '../components/shared/Header';
import StickyContact from '../components/shared/StickyContact';
import Footer from '../components/shared/Footer';
import './blogs.css';


const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [defaultImage] = useState('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs/');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const extractKeywords = (metaKeywords) => {
    if (!metaKeywords || metaKeywords.length === 0) return 'Real Estate';
    return metaKeywords[0].split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const loadMore = () => {
    setVisibleBlogs(prev => prev + 3);
  };

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading insights: {error}</p>
      </div>
    );
  }

  return (
    <>
    <Header/>
    <div className="blog-page">
      <div className="blog-page-header">
        <h1>Property Insights</h1>
        <p>Expert knowledge and market trends to guide your real estate decisions</p>
      </div>

      <div className="blog-container">
        {blogs.slice(0, visibleBlogs).map((blog) => (
          <article key={blog._id} className="blog-card">
            <div className="blog-image-wrapper">
              <img
                className="blog-image"
                src={blog.image?.url ? blog.image?.url|| defaultImage  : defaultImage}
                alt={blog.title}
              />
              <span className="blog-date">{formatDate(blog.createdAt)}</span>
            </div>
            <div className="blog-content">
              <span className="category-tag">
                {extractKeywords(blog.meta?.keywords)}
              </span>
              <h2>{blog.title}</h2>
              <p className="blog-excerpt">{blog.content}</p>
              <button 
                className="read-more" 
                onClick={() => handleReadMore(blog)}
              >
                Read More <FiArrowRight />
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedBlog && (
        <div className={`blog-modal ${selectedBlog ? 'active' : ''}`}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              <FiX />
            </button>
            <img 
              className="modal-image" 
              src={selectedBlog.image?.url ? selectedBlog.image?.url:defaultImage} 
              alt={selectedBlog.title} 
            />
            <div className="modal-body">
              <span className="modal-date">{formatDate(selectedBlog.createdAt)}</span>
              <h2 className="modal-title">{selectedBlog.title}</h2>
              <div className="modal-text">
                {selectedBlog.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {visibleBlogs < blogs.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMore}>
            Load More Insights
          </button>
        </div>
      )}
    </div>
    <StickyContact/>
    <Footer/>
    </>
  );
};

export default BlogPage;