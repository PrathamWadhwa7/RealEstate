import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const BasicMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setMapError(null);

        if (map.current) {
          map.current.remove();
          map.current = null;
        }

        if (!MAPBOX_TOKEN) {
          throw new Error('Mapbox access token is missing');
        }

        const workerUrl = URL.createObjectURL(
          new Blob([
            `importScripts('https://unpkg.com/mapbox-gl@${mapboxgl.version}/dist/mapbox-gl-csp-worker.js');`
          ], { type: 'application/javascript' })
        );
        
        // Set worker class before map initialization
        mapboxgl.workerClass = new Worker(workerUrl);
        mapboxgl.accessToken = MAPBOX_TOKEN;

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [78.4867, 17.3850],
          zoom: 12,
          antialias: true
        });

        // Add controls
        map.current.addControl(new mapboxgl.NavigationControl());
        map.current.addControl(new mapboxgl.FullscreenControl());

        map.current.on('load', () => {
          setIsLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e.error);
          setMapError('Map loading error. Please check your connection and refresh.');
          setIsLoading(false);
        });

      } catch (error) {
        console.error('Map initialization failed:', error);
        setMapError(error.message || 'Failed to initialize map. Please try again.');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      height: '60vh', 
      width: '100%',
      minHeight: '400px'
    }}>
      {/* Empty map container - must remain empty */}
      <div
        ref={mapContainer}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
      
      {/* Loading state */}
      {isLoading && !mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.8)',
          zIndex: 10
        }}>
          <div>Loading map...</div>
        </div>
      )}
      
      {/* Error state */}
      {mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.9)',
          zIndex: 10,
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#d32f2f', marginBottom: '16px' }}>
            {mapError}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Map
          </button>
        </div>
      )}
    </div>
  );
};

export default BasicMap;