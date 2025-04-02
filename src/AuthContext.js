import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null, // null | "user" | "driver" | "manager"
    user_id: null, // Store the user_id
  });

  // Login function to set user data
  const login = (role, user_id) => {
    setAuth({ isAuthenticated: true, role, user_id });
  };

  // Logout function
  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, user_id: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

