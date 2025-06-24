// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import PropertyDetails from './pages/PropertyDetails';
import NotFound from './pages/NotFound';  // This should now work
import './App.css';

import MapTestPage from './pages/MapTestPage';

// Add this to your Routes:
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/map-test" element={<MapTestPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;