import React, { useState } from "react";
import { Container, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, Alert, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    licenseNumber: "",
    vehicleDetails: ""
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const validate = () => {
    let tempErrors = {};
    if (!form.firstName) tempErrors.firstName = "First Name is required.";
    if (!form.lastName) tempErrors.lastName = "Last Name is required.";
    if (!form.email) tempErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = "Invalid email format.";
    if (!form.password) tempErrors.password = "Password is required.";
    if (form.password.length < 6) tempErrors.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) tempErrors.confirmPassword = "Please confirm your password.";
    if (form.password !== form.confirmPassword) tempErrors.confirmPassword = "Passwords do not match.";
    if (form.role === "driver" && !form.licenseNumber) tempErrors.licenseNumber = "License Number is required for drivers.";
    if (form.role === "driver" && !form.vehicleDetails) tempErrors.vehicleDetails = "Vehicle Details are required for drivers.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    const userData = {
      username: form.firstName + " " + form.lastName,
      password: form.password,
      email: form.email,
    };

    try {
      const response = await fetch("https://localhost:7122/api/Registration/UserRegistration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("User registration failed");

      if (form.role === "driver") {
        const driverData = {
          email: form.email,
          license_number: form.licenseNumber,
          vehicle_details: form.vehicleDetails,
          active_status: true,
        };

        const driverResponse = await fetch("https://localhost:7122/api/Registration/DriverRegistration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driverData),
        });

        if (!driverResponse.ok) throw new Error("Driver registration failed");
      }

      setServerMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: "40px" }} >
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign={"center"}>
          Create an Account
      </Typography>

      {serverMessage && (
        <Alert severity={serverMessage.includes("failed") ? "error" : "success"}>{serverMessage}</Alert>
      )}

      <form noValidate>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          margin="normal"
        />

        {/* Role Selection */}
        <FormControl component="fieldset" margin="normal">
          <label>Sign Up As</label>
          <RadioGroup row name="role" value={form.role} onChange={handleChange}>
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="driver" control={<Radio />} label="Driver" />
          </RadioGroup>
        </FormControl>

        {/* Driver Fields */}
        {form.role === "driver" && (
          <>
            <TextField
              fullWidth
              label="License Number"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              error={!!errors.licenseNumber}
              helperText={errors.licenseNumber}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Vehicle Details"
              name="vehicleDetails"
              value={form.vehicleDetails}
              onChange={handleChange}
              error={!!errors.vehicleDetails}
              helperText={errors.vehicleDetails}
              margin="normal"
            />
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignUp}
          style={{
            marginTop: "20px",
            backgroundColor: "black",
            fontWeight: "bold",
            padding: "12px",
          }}
        >
          Sign Up
        </Button>

        <p className="text-center mt-3">
          Already have an account? <Link href="/login" underline="default" color="black">Login</Link>
        </p>
      </form>
    </Container>
  );
};

export default SignUp;


