import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";
import { useAuth } from "../AuthContext"; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Function to validate user input
  const validate = () => {
    let tempErrors = {};
    if (!form.email) tempErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = "Invalid email format.";
    if (!form.password) tempErrors.password = "Password is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login process
  const handleLogin = async () => {
    if (!validate()) return;
    setServerError("");

    try {
      const response = await fetch("https://localhost:7122/api/Login/DriverLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (!data.user_id) throw new Error("User ID not found.");

      // Log the user in by setting the role in AuthContext
      login(data.isDriver ? "driver" : data.isManager ? "manager" : "user", data.user_id);

      // Redirect based on user role
      if (data.isManager) {
        navigate("/manager"); // Navigate to the Manager dashboard
      } else {
        navigate(data.isDriver ? "/drive" : "/ride"); // Navigate to the appropriate dashboard
      }
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to SmartRide
        </Typography>
        {serverError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {serverError}
          </Typography>
        )}
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold", backgroundColor: "black" }}
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
