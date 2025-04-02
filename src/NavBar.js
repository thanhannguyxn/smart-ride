import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();

  const isRidePage = location.pathname === "/ride";
  const isDrivePage = location.pathname === "/drive";
  const isTripHistoryPage = location.pathname === "/trip-history";
  const isDriverTripHistoryPage = location.pathname === "/driver-trip-history";

  return (
    <AppBar position="static" sx={{ bgcolor: "black", color: "white", px: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            SmartRide
          </Typography>

          {/* Conditional Navigation Buttons */}
          {isRidePage || isTripHistoryPage ? (
            <>
              <Button onClick={() => navigate("/ride")} sx={navButtonStyle}>
                Book a Ride
              </Button>
              <Button onClick={() => navigate("/trip-history")} sx={navButtonStyle}>
                Trip History
              </Button>
            </>
          ) : isDrivePage || isDriverTripHistoryPage ? (
            <>
              <Button onClick={() => navigate("/drive")} sx={navButtonStyle}>
                Ride Request
              </Button>
              <Button onClick={() => navigate("/driver-trip-history")} sx={navButtonStyle}>
                Trip History
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/ride")} sx={navButtonStyle}>
                Ride
              </Button>
              <Button onClick={() => navigate("/drive")} sx={navButtonStyle}>
                Drive
              </Button>
            </>
          )}
        </Box>

        {/* Right Section: Authentication Buttons */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {auth.isAuthenticated ? (
            <>
              {/* Profile Button */}
              {auth.role === "driver" ? (
                <Button onClick={() => navigate("/driver-profile")} sx={profileButtonStyle}>
                  Profile
                </Button>
              ) : (
                <Button onClick={() => navigate("/user-profile")} sx={profileButtonStyle}>
                  Profile
                </Button>
              )}

              {/* Logout Button */}
              <Button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                variant="outlined"
                sx={logoutButtonStyle}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} variant="outlined" sx={authButtonStyle}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} variant="contained" sx={signUpButtonStyle}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const navButtonStyle = {
  color: "white",
  textTransform: "none",
  borderRadius: "50px",
  px: 2,
  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
};

const logoutButtonStyle = {
  borderColor: "white",
  color: "white",
  borderRadius: "50px",
  px: 3,
  textTransform: "none",
  "&:hover": { bgcolor: "white", color: "black" },
};

const profileButtonStyle = {
  borderColor: "white",
  color: "white",
  borderRadius: "50px",
  px: 3,
  textTransform: "none",
  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
};

const authButtonStyle = {
  borderColor: "white",
  color: "white",
  borderRadius: "50px",
  px: 3,
  textTransform: "none",
  "&:hover": { bgcolor: "white", color: "black" },
};

const signUpButtonStyle = {
  bgcolor: "white",
  color: "black",
  borderRadius: "50px",
  px: 3,
  textTransform: "none",
  "&:hover": { bgcolor: "#ccc" },
};

export default Navbar;









