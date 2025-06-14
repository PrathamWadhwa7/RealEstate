import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import BlogsAdminPanel from "./pages/Blogs";
import Navbar from "./components/Navbar";
import PropertiesAdminPanel from "./pages/Properties";
import AreasAdminPanel from "./pages/Areas";
import LeadsAdminPanel from "./pages/Leads";
import Dashboard from "./pages/Dashboard";
import ServicesAdminPanel from "./pages/Services";
import './App.css';

// ✅ Protected Route
const ProtectedRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// ✅ Public Route
const PublicRoute = ({ children, isLoggedIn }) => {
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div id="loader" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
          />
          <Route
            path="/login"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Login setIsLoggedIn={setIsLoggedIn} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Register />
              </PublicRoute>
            }
          />
          <Route
  path="/dashboard"
  element={
    <ProtectedRoute isLoggedIn={isLoggedIn}>
      <Dashboard/>
    </ProtectedRoute>
  }
/>

          <Route
            path="/properties"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <PropertiesAdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/area"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AreasAdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <LeadsAdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <BlogsAdminPanel />
              </ProtectedRoute>
            }
          />
           <Route
            path="/services"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ServicesAdminPanel/>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </Router>
  );
};

export default App;
