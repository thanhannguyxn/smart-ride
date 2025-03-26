import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { AuthProvider, useAuth } from "./AuthContext";

// Import pages
import Home from "./pages/Home";  
import Ride from "./pages/RideDashboard";
import Drive from "./pages/DriveDashboard";
import Manager from "./pages/ManagerDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useAuth();
  return auth.isAuthenticated && auth.role === role ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ride" element={<ProtectedRoute role="user"><Ride /></ProtectedRoute>} />
          <Route path="/drive" element={<ProtectedRoute role="driver"><Drive /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute role="manager"><Manager /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
      <Footer />
    </AuthProvider>
  );
};

export default App;



