import { Box, Button, Input, Typography, MenuItem, Select, TextField } from "@mui/material";
import { CalendarMonth, AccessTime, LocationOn } from "@mui/icons-material";
import { useState } from "react";

export default function RideDashboard() {
  const [selectedTime, setSelectedTime] = useState("Now");
  const [selectedDate, setSelectedDate] = useState("Today");

  const generateTimeOptions = () => {
    let options = ["Now"];
    let now = new Date();
    for (let i = 1; i < 5; i++) {
      let futureTime = new Date(now.getTime() + i * 15 * 60000);
      options.push(futureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return options;
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" height="80vh" bgcolor="#fff" p={5}>
      {/* Left Side - Ride Booking Form */}
      <Box flex={1} maxWidth={400} p={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Go anywhere with SmartRide
        </Typography>
        
        <Box display="flex" alignItems="center" bgcolor="#f3f3f3" borderRadius={2} p={1} mb={2}>
          <LocationOn color="action" sx={{ mr: 1 }} />
          <Input placeholder="Pickup location" disableUnderline fullWidth />
        </Box>

        <Box display="flex" alignItems="center" bgcolor="#f3f3f3" borderRadius={2} p={1} mb={2}>
          <LocationOn color="action" sx={{ mr: 1 }} />
          <Input placeholder="Dropoff location" disableUnderline fullWidth />
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <Box display="flex" alignItems="center" bgcolor="black" borderRadius={1} p={1} flex={1} justifyContent="center">
            <CalendarMonth sx={{ color: "white", mr: 1 }} />
            <TextField
              type="date"
              fullWidth
              variant="outlined"
              sx={{ input: { color: "white", textAlign: "center" }, border: "none" }}
              InputLabelProps={{ shrink: true }}
              value={selectedDate === "Today" ? new Date().toISOString().split('T')[0] : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Box>
          <Box display="flex" alignItems="center" bgcolor="black" borderRadius={1} p={1} flex={1} justifyContent="center">
            <AccessTime sx={{ color: "white", mr: 1 }} />
            <Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              fullWidth
              displayEmpty
              variant="outlined"
              sx={{ color: "white", border: "none", textAlign: "center" }}
            >
              {generateTimeOptions().map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Button variant="contained" fullWidth sx={{ backgroundColor: "black", color: "white", fontWeight: "bold", borderRadius: 1, textAlign: "center" }}>
          See Prices
        </Button>
      </Box>

      {/* Right Side - Map Placeholder */}
      <Box flex={0.8} height={"60vh"} bgcolor="#e0e0e0" display="flex" justifyContent="center" alignItems="center" borderRadius={2}>
        <Typography variant="h6" color="textSecondary">
          Map will be displayed here
        </Typography>
      </Box>
    </Box>
  );
}


