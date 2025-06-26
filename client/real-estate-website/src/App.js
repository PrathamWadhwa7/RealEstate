// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import PropertyDetails from './pages/PropertyDetails';
import NotFound from './pages/NotFound'; 
import './App.css';
import MapTestPage from './pages/MapTestPage';
import ServicesPage from './pages/Service'
import BlogPage from './pages/blogs';
import ContactUsPage from './pages/contact';

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
          <Route path="/services" element={<ServicesPage/>}/>
          <Route path="/Blogs" element={<BlogPage/>}/>
          <Route path="/contact" element={<ContactUsPage/>}/>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;