import React from 'react';
import BasicMap from '../components/BasicMap';

const MapTestPage = () => {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>Real Estate Map</h1>
      <div style={{ 
        marginBottom: '20px',
        height: '60vh',
        width: '100%',
        position: 'relative'
      }}>
        <BasicMap />
      </div>
      <p>Basic map integration working successfully.</p>
    </div>
  );
};

export default MapTestPage;