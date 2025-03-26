import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container, Link, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!form.firstName) tempErrors.firstName = "First Name is required.";
    if (!form.lastName) tempErrors.lastName = "Last Name is required.";
    if (!form.phone) tempErrors.phone = "Phone Number is required.";
    if (!/^\d{10}$/.test(form.phone)) tempErrors.phone = "Invalid phone number.";
    if (!form.email) tempErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = "Invalid email format.";
    if (!form.password) tempErrors.password = "Password is required.";
    if (form.password.length < 6) tempErrors.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) tempErrors.confirmPassword = "Please confirm your password.";
    if (form.password !== form.confirmPassword) tempErrors.confirmPassword = "Passwords do not match.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    if (validate()) {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="sm"> 
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100%"
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Create an Account
      </Typography>
  
      <Box width="100%">
        <Grid container spacing={13.2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              name="firstName"
              variant="outlined"
              fullWidth
              value={form.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              name="lastName"
              variant="outlined"
              fullWidth
              value={form.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
        </Grid>
      </Box>
  
      <TextField
        label="Phone Number"
        name="phone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={form.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
      />
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
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={form.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
  
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold", backgroundColor: "black" }}
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
  
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="/login" underline="default" color="black">
          Login
        </Link>
      </Typography>
    </Box>
  </Container>
  );
};

export default SignUp;
