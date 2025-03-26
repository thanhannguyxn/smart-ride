import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Container, Link } from "@mui/material";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!phone) tempErrors.phone = "Phone number is required.";
    if (!/^\d{10}$/.test(phone)) tempErrors.phone = "Invalid phone number.";
    if (!password) tempErrors.password = "Password is required.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      const fakeRole = "user"; 
      login(fakeRole);
      navigate(`/ride`); 
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to SmartRide
        </Typography>

        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold", backgroundColor: "black", color: "white" }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link href="/signup" underline="default" color="black">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
