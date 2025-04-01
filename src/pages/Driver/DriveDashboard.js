import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Grid, Avatar, Box } from "@mui/material";
const DriveDashboard = () => {
  const [rideRequests, setRideRequests] = useState([]);

  const handleAccept = (requestId) => {
    console.log("Accepted request:", requestId);
    // Call API to update request status to 'ACCEPTED'
  };

  const handleDecline = (requestId) => {
    console.log("Declined request:", requestId);
    // Call API to update request status to 'CANCELLED'
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Ride Requests
      </Typography>
      <Grid container spacing={3}>
        {rideRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.request_id}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>{request.passenger_name.charAt(0)}</Avatar>
                  <Typography variant="h6">{request.passenger_name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Pickup: {request.pickup_location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dropoff: {request.dropoff_location}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                  Fare: ${request.fare}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button variant="contained" color="success" onClick={() => handleAccept(request.request_id)}>
                    Accept
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDecline(request.request_id)}>
                    Decline
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DriveDashboard;