import { Box, Button, Input, Typography, MenuItem, Select, TextField } from "@mui/material";
import { CalendarMonth, AccessTime, LocationOn } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { fetchMapKey, fetchRoute } from "../../service";
 
export default function RideDashboard() {
  const [selectedTime, setSelectedTime] = useState("Now");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [subscriptionKey, setSubscriptionKey] = useState(null);
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLon, setPickupLon] = useState("");
  const [dropoffLat, setDropoffLat] = useState("");
  const [dropoffLon, setDropoffLon] = useState("");
 
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const datasourceRef = useRef(null);
 
  useEffect(() => {
    async function getKey() {
      const key = await fetchMapKey();
      if (key) setSubscriptionKey(key);
    }
    getKey();
  }, []);
 
  useEffect(() => {
    if (subscriptionKey && mapRef.current && !mapInstance.current) {
      const script = document.createElement("script");
      script.src = "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js";
      script.async = true;
      script.onload = () => {
        mapInstance.current = new window.atlas.Map(mapRef.current, {
          center: [105.91715, 21.043769],
          zoom: 10,
          view: "Auto",
          authOptions: {
            authType: "subscriptionKey",
            subscriptionKey: subscriptionKey,
          },
        });
        mapInstance.current.events.add("ready", () => {
          datasourceRef.current = new window.atlas.source.DataSource();
          mapInstance.current.sources.add(datasourceRef.current);
          mapInstance.current.layers.add(new window.atlas.layer.LineLayer(datasourceRef.current));
          mapInstance.current.events.add("click", (event) => {
            const position = event.position;
            const coordinates = mapInstance.current.pixelsToPositions([position])[0];
            setDropoffLat(coordinates[1].toFixed(6));
            setDropoffLon(coordinates[0].toFixed(6));
          });
        });
      };
      document.body.appendChild(script);
    }
  }, [subscriptionKey]);
 
  const handleSeePrices = async () => {
    if (!pickupLat || !pickupLon || !dropoffLat || !dropoffLon) {
      alert("Please enter valid pickup and dropoff locations.");
      return;
    }
 
    const startPosition = [parseFloat(pickupLon), parseFloat(pickupLat)];
    const endPosition = [parseFloat(dropoffLon), parseFloat(dropoffLat)];
 
    const routeData = await fetchRoute(pickupLat, pickupLon, dropoffLat, dropoffLon);
    if (!routeData) {
      console.error("Failed to fetch route data");
      return;
    }
 
    const route = routeData.routes[0];
    const routeCoordinates = route.legs.flatMap((leg) =>
      leg.points.map((point) => [point.longitude, point.latitude])
    );
 
    if (mapInstance.current && datasourceRef.current) {
      mapInstance.current.setCamera({
        bounds: window.atlas.data.BoundingBox.fromPositions([startPosition, endPosition]),
        padding: 50,
      });
 
      const routeLine = new window.atlas.data.LineString(routeCoordinates);
      datasourceRef.current.clear();
      datasourceRef.current.add(new window.atlas.data.Feature(routeLine));
    }
  };
 
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPickupLat(latitude.toFixed(6));
          setPickupLon(longitude.toFixed(6));
          if (mapInstance.current) {
            mapInstance.current.setCamera({
              center: [longitude, latitude],
              zoom: 12
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
          alert("Unable to get your location. Please check your browser permissions.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
 
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" height="80vh" bgcolor="#fff" p={5}>
      {/* Left Side - Ride Booking Form */}
      <Box flex={1} maxWidth={400} p={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Go anywhere with SmartRide
        </Typography>
 
        <Box display="flex" alignItems="center" bgcolor="#f3f3f3" borderRadius={2} p={1} mb={1}>
          <LocationOn color="action" sx={{ mr: 1 }} />
          <Input
            placeholder="Pickup latitude"
            disableUnderline
            fullWidth
            value={pickupLat}
            onChange={(e) => setPickupLat(e.target.value)}
          />
          <Input
            placeholder="Pickup longitude"
            disableUnderline
            fullWidth
            value={pickupLon}
            onChange={(e) => setPickupLon(e.target.value)}
          />
        </Box>
        <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={getUserLocation}
              sx={{ ml: 1, minWidth: 'auto', whiteSpace: 'nowrap' }}
            >
              Use My Location
            </Button>
        <Box display="flex" alignItems="center" bgcolor="#f3f3f3" borderRadius={2} p={1} mt={1} mb={2}>
          <LocationOn color="action" sx={{ mr: 1 }} />
          <Input
            placeholder="Dropoff latitude"
            disableUnderline
            fullWidth
            value={dropoffLat}
            onChange={(e) => setDropoffLat(e.target.value)}
          />
          <Input
            placeholder="Dropoff longitude"
            disableUnderline
            fullWidth
            value={dropoffLon}
            onChange={(e) => setDropoffLon(e.target.value)}
          />
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
              value={selectedDate === "Today" ? new Date().toISOString().split("T")[0] : selectedDate}
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
              {["Now", "15 min", "30 min", "45 min", "60 min"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
 
        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "black", color: "white", fontWeight: "bold", borderRadius: 1, textAlign: "center" }}
          onClick={handleSeePrices}
        >
          See Prices
        </Button>
      </Box>
 
      {/* Right Side - Azure Map */}
      <Box flex={0.8} height={"60vh"} bgcolor="#e0e0e0" display="flex" justifyContent="center" alignItems="center" borderRadius={2}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </Box>
    </Box>
  );
}