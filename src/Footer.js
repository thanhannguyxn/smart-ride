import React from "react";
import { Container, Typography, Box, Grid, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "black", color: "white", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">SmartRide</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your go-to ride-sharing service for safe and affordable travel.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">Quick Access</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
              <Link href="/ride" color="inherit" underline="hover">Book a Ride</Link>
              <Link href="/drive" color="inherit" underline="hover">Become a Driver</Link>
              <Link href="/manager" color="inherit" underline="hover">Management Department</Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">Contact Us</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Email: support@smartride.com</Typography>
            <Typography variant="body2">Address: 80 Duy Tan, Cau Giay, Hanoi</Typography>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box sx={{ textAlign: "center", mt: 4, borderTop: "1px solid gray", pt: 2 }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} SmartRide. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;