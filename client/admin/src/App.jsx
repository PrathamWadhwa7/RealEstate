// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Register from "./components/Register";
// // import Dashboard from "./components/Dashboard";
// import Navbar from "./components/Navbar";
// import PropertiesAdminPanel from "./pages/Properties";
// import AreasAdminPanel from "./pages/Areas";
// import LeadsAdminPanel from "./pages/Leads";
// import MainContentWrapper from "./components/MainContentWrapper";

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const loggedIn = !!token;
//     console.log("App useEffect - token:", token, "isLoggedIn:", loggedIn); // Debug log
//     setIsLoggedIn(loggedIn);
//   }, []);

//   // Debug: Log when isLoggedIn changes
//   console.log("App render - isLoggedIn:", isLoggedIn);

//   return (
//     <Router>
//       <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
//       <MainContentWrapper>
//       <Routes>
//         <Route
//           path="/"
//           element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
//         />
//         <Route
//           path="/login"
//           element={<Login setIsLoggedIn={setIsLoggedIn} />}
//         />
//         <Route path="/register" element={<Register />} />
//         <Route path="/properties" element={<PropertiesAdminPanel/>}/>
//         <Route path="/area" element={<AreasAdminPanel/>}/>
//         <Route path="/leads" element={<LeadsAdminPanel/>}/>
//         {/* <Route
//           path="/dashboard"
//           element={
//             isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
//           }
//         /> */}
//       </Routes>
//       </MainContentWrapper>
//     </Router>
//   );
// };

// export default App;
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
// import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import PropertiesAdminPanel from "./pages/Properties";
import AreasAdminPanel from "./pages/Areas";
import LeadsAdminPanel from "./pages/Leads";
import MainContentWrapper from "./components/MainContentWrapper";

// Protected Route Component
const ProtectedRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children, isLoggedIn }) => {
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = !!token;
    console.log("App useEffect - token:", token, "isLoggedIn:", loggedIn);
    setIsLoggedIn(loggedIn);
    setIsLoading(false); // Set loading to false after checking token
  }, []);

  // Debug: Log when isLoggedIn changes
  console.log("App render - isLoggedIn:", isLoggedIn);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <MainContentWrapper>
        <Routes>
          {/* Root route - redirect based on auth status */}
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
          />
          
          {/* Public routes - redirect to dashboard if already logged in */}
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
          
          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h1>Dashboard</h1>
                  <p>Welcome to your dashboard!</p>
                  {/* Replace with your actual Dashboard component when ready */}
                </div>
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
          
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MainContentWrapper>
    </Router>
  );
};

export default App;