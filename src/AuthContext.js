import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Giả lập dữ liệu đăng nhập (ban đầu chưa đăng nhập)
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null, // null | "user" | "driver" | "manager"
  });

  // Hàm login: cập nhật trạng thái đăng nhập & role
  const login = (role) => {
    setAuth({ isAuthenticated: true, role });
  };

  // Hàm logout
  const logout = () => {
    setAuth({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
