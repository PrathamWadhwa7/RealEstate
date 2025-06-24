// // src/components/home/NewsSection.js
// import React from 'react';
// import Slider from 'react-slick';
// import noidaImage from '../../assets/images/noida.png';

// const NewsSection = () => {
//   const newsArticles = [
//     {
//       id: 1,
//       title: 'Jewar Airport Development Boosts Yamuna Expressway Real Estate',
//       date: 'June 15, 2025',
//       snippet: 'The upcoming Jewar International Airport is driving unprecedented growth in the Yamuna Expressway real estate market...',
//       image: noidaImage
//     },
//     {
//       id: 2,
//       title: 'Greater Noida West Emerges as Top Residential Destination',
//       date: 'May 28, 2025',
//       snippet: 'With improved connectivity and infrastructure, Greater Noida West is attracting homebuyers from across NCR...',
//       image: noidaImage
//     },
//     {
//       id: 3,
//       title: 'New Metro Line to Connect Greater Noida with Delhi',
//       date: 'April 10, 2025',
//       snippet: 'The proposed metro extension is expected to reduce travel time and further boost property values in the region...',
//       image: noidaImage
//     }
//   ];

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1
//         }
//       }
//     ]
//   };

//   return (
//     <section className="news-section">
//       <h2>Real Estate News & Insights from Greater Noida & Yamuna Exp. 2025</h2>
//       <Slider {...settings}>
//         {newsArticles.map(article => (
//           <div key={article.id} className="news-card">
//             <img src={article.image} alt={article.title} />
//             {/* <img src={`/assets/images/${article.image}`} alt={article.title} /> */}
//             <div className="news-content">
//               <h3>{article.title}</h3>
//               <p className="date">{article.date}</p>
//               <p className="snippet">{article.snippet}</p>
//               <button className="read-more">Read More</button>
//             </div>
//           </div>
//         ))}
//       </Slider>
//       <button className="view-all">View All Blogs</button>
//     </section>
//   );
// };

// export default NewsSection;

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
        const response = await axios.get('http://localhost:5050/api/blogs');
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
            <img src={article.images?.[0] || noidaImage} alt={article.title} />
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