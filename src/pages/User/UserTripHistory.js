import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const UserTripHistory = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Giả sử user_id được lấy từ localStorage hoặc context
    const userId = localStorage.getItem("user_id");
    
    axios.get(`http://localhost:5000/api/trips?user_id=${userId}`)
      .then(response => {
        setTrips(response.data);
      })
      .catch(error => {
        console.error("Error fetching trip history:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Trip History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Ride ID</TableCell>
              <TableCell>Amount ($)</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Issued At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip, index) => (
              <TableRow key={trip.invoice_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{trip.ride_id}</TableCell>
                <TableCell>{trip.amount}</TableCell>
                <TableCell>{trip.payment_method || "N/A"}</TableCell>
                <TableCell>{trip.payment_status}</TableCell>
                <TableCell>{new Date(trip.issued_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserTripHistory;