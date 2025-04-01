import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const DriverTripHistory = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const driverId = localStorage.getItem("driver_id");
    
    axios.get(`http://localhost:5000/api/driver-trips?driver_id=${driverId}`)
      .then(response => {
        setTrips(response.data);
      })
      .catch(error => {
        console.error("Error fetching driver trip history:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center", fontWeight: "bold" }}>
        Driver Trip History
      </Typography>
      <TableContainer component={Paper} style={{ backgroundColor: "#f5f5f5" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#000" }}>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>#</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Trip ID</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Passenger</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Pickup</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Dropoff</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Fare ($)</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Completed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip, index) => (
              <TableRow key={trip.trip_id} style={{ backgroundColor: index % 2 === 0 ? "#e0e0e0" : "white" }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{trip.trip_id}</TableCell>
                <TableCell>{trip.passenger_name}</TableCell>
                <TableCell>{trip.pickup_location}</TableCell>
                <TableCell>{trip.dropoff_location}</TableCell>
                <TableCell>{trip.fare}</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>{trip.status}</TableCell>
                <TableCell>{new Date(trip.completed_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DriverTripHistory;

