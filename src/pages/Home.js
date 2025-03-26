import React from "react";
import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Home = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "black",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center">
            {/* Text Section */}
            <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
              <Typography variant="h3" fontWeight="bold">
                SmartRide - Book a Ride
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Fast. Safe. Affordable. Your ride, your way!
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/signup"
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    borderRadius: "30px",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                >
                  Get started
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <Link to="/login" style={{ color: "white", textDecoration: "underline" }}>
                    Already have an account? Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Image Section */}
            <Box flex={0.9} display={{ xs: "none", md: "block" }} textAlign="center">
              <img
                src="/banner-pic.jpeg"
                alt="Book ride"
                style={{ width: "100%", maxWidth: "600px", height: "auto", borderRadius: "10px" }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Info Section */}
      <Box sx={{ backgroundColor: "white", color: "black", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center"  gutterBottom sx={{ mb: 10 }}>
            Why Choose SmartRide?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { Icon: SecurityIcon, title: "Safe & Secure", desc: "Our drivers are verified, and our rides are insured." },
              { Icon: DirectionsCarIcon, title: "Convenient & Fast", desc: "Book a ride anytime, anywhere with just a few taps." },
              { Icon: AttachMoneyIcon, title: "Affordable Pricing", desc: "Enjoy competitive rates with no hidden fees." }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: "15px",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      transform: "scale(1.03)"
                    }
                  }}
                >
                  <CardContent>
                    <item.Icon sx={{ fontSize: 50, color: "#000" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;


