import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import context

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth(); 

  return (
    <AppBar position="static" sx={{ bgcolor: "black", color: "white", px: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Logo + Ride & Drive */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/")}>
            SmartRide
          </Typography>
          <Button
            onClick={() => auth.isAuthenticated && auth.role === "user" ? navigate("/ride") : navigate("/login")}
            sx={{
              color: "white",
              textTransform: "none",
              borderRadius: "50px",
              px: 0.25,
              bgcolor: "transparent",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            Ride
          </Button>
          <Button
            onClick={() => auth.isAuthenticated && auth.role === "driver" ? navigate("/drive") : navigate("/login")}
            sx={{
              color: "white",
              textTransform: "none",
              borderRadius: "50px",
              px: 0.25,
              bgcolor: "transparent",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            Drive
          </Button>
        </Box>

        {/* Right Section: Authentication Buttons */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {auth.isAuthenticated ? (
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: "50px",
                px: 3,
                textTransform: "none",
                "&:hover": { bgcolor: "white", color: "black" },
              }}
            >
              Logout
            </Button>
          ) : (
            <>
            <Button
                onClick={() => navigate("/login")}
                variant="outlined"
                sx={{
                    borderColor: "white",
                    color: "white",
                    borderRadius: "50px",
                    px: 3,
                    textTransform: "none",
                    "&:hover": { bgcolor: "white", color: "black"}
                }}
            >
                Login
            </Button>
            <Button
                onClick={() => navigate("/signup")}
                variant="contained"
                sx={{
                    bgcolor: "white",
                    color: "black",
                    borderRadius: "50px",
                    px: 3,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#ccc" },
                }}
            >
                Sign Up
            </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;





