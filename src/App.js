// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { AuthProvider, useAuth } from "./AuthContext";
import signalRService from "./service/signalR";

// Import pages
import Home from "./pages/Home";
import Ride from "./pages/User/RideDashboard";
import Drive from "./pages/Driver/DriveDashboard";
import Manager from "./pages/Manager/ManagerDashboard";
import UserTripHistory from "./pages/User/UserTripHistory";
import DriverTripHistory from "./pages/Driver/DriverTripHistory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useAuth();
  return auth.isAuthenticated && auth.role === role ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { auth } = useAuth();
  
  // Initialize the SignalR connection when the app loads
  useEffect(() => {
    if (auth.isAuthenticated) {
      signalRService.initialize();
    }
  }, [auth.isAuthenticated]);
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ride" element={<ProtectedRoute role="user"><Ride /></ProtectedRoute>} />
        <Route path="/trip-history" element={<ProtectedRoute role="user"><UserTripHistory /></ProtectedRoute>} />
        <Route path="/drive" element={<ProtectedRoute role="driver"><Drive /></ProtectedRoute>} />
        <Route path="/driver-trip-history" element={<ProtectedRoute role="driver"><DriverTripHistory /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute role="manager"><Manager /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;