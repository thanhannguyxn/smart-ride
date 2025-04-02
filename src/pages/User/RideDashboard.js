import {
  Box,
  Button,
  Input,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { fetchMapKey, createRideRequest} from "../../service";
import { getUserLocation } from "../../helper";
import { handleSeePrices } from "../../helper";
import { handleClearRoute } from "../../service/route";
import { listenForRideCreated } from "../../service/signalR";

export default function RideDashboard() {
  const [subscriptionKey, setSubscriptionKey] = useState(null);
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLon, setPickupLon] = useState("");
  const [dropoffLat, setDropoffLat] = useState("");
  const [dropoffLon, setDropoffLon] = useState("");
  const [fare, setFare] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const [rideRequested, setRideRequested] = useState(false);
  const [rideStatus, setRideStatus] = useState("pending");
  const [currentLocation, setCurrentLocation] = useState({
      lat: null,
      long: null,
    });

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const datasourceRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location", error)
    );
    async function getKey() {
      const key = await fetchMapKey();
      if (key) setSubscriptionKey(key);
    }
    getKey();
  }, []);

  useEffect(() => {
    listenForRideCreated((newRequest) => {
      if (newRequest.status === "ACCEPTED") {
        setRideStatus("accepted");
        // handleClearRoutef();
        // load3routes(
        //   currentLocation.lat,
        //   currentLocation.long,
        //   newRequest.pickupLat,
        //   newRequest.pickupLong,
        //   newRequest.dropoffLat,
        //   newRequest.dropoffLong,
        //   mapInstance,
        //   datasourceRef
        // );
      }
      if (newRequest.status === "COMPLETED") {
        setRideStatus("completed");
      }
    });
  }, []);

  const handleConfirmRide = async () => {
    try {
      const response = await createRideRequest(
        pickupLat,
        pickupLon,
        dropoffLat,
        dropoffLon,
        fare
      );
      if (response) {
        setRideRequested(true);
      }
    } catch (error) {
      console.error("Failed to create ride request", error);
    }
  };

  const handleClearRoutef = () => {
    if (datasourceRef.current) {
      handleClearRoute(datasourceRef);
    }
  };

  useEffect(() => {
    if (subscriptionKey && mapRef.current && !mapInstance.current) {
      const script = document.createElement("script");
      script.src =
        "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js";
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
          mapInstance.current.layers.add(
            new window.atlas.layer.LineLayer(datasourceRef.current)
          );

          mapInstance.current.events.add("click", (event) => {
            if (!rideRequested) {
              const position = event.position;
              const coordinates = mapInstance.current.pixelsToPositions([
                position,
              ])[0];
              setDropoffLat(coordinates[1].toFixed(6));
              setDropoffLon(coordinates[0].toFixed(6));
            }
          });
        });
      };
      document.body.appendChild(script);
    }
  }, [subscriptionKey, rideRequested]);

  // Ride booking form component
  const RideBookingForm = () => (
    <Box flex={1} maxWidth={400} p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Go anywhere with SmartRide
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        bgcolor="#f3f3f3"
        borderRadius={2}
        p={1}
        mb={1}
      >
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
        onClick={() => getUserLocation(setPickupLat, setPickupLon, mapInstance)}
        sx={{ ml: 1, minWidth: "auto", whiteSpace: "nowrap" }}
      >
        Use My Location
      </Button>
      <Box
        display="flex"
        alignItems="center"
        bgcolor="#f3f3f3"
        borderRadius={2}
        p={1}
        mt={1}
        mb={2}
      >
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
      <Button
        onClick={() => {
          handleSeePrices(
            pickupLat,
            pickupLon,
            dropoffLat,
            dropoffLon,
            setRouteDistance,
            setFare,
            mapInstance,
            datasourceRef
          );
          setIsConfirm(true);
        }}
        variant="contained"
      >
        See Information
      </Button>
      {isConfirm && fare !== null && routeDistance !== null && (
        <Box mt={2} p={2} bgcolor="#f3f3f3" borderRadius={2}>
          <Typography variant="h6">
            Estimated Fare: ${fare.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Distance: {routeDistance.toFixed(2)} km
          </Typography>
          <Button
            onClick={handleConfirmRide}
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
          >
            Confirm Ride
          </Button>
        </Box>
      )}
    </Box>
  );

  // Ride Status component
  const RideStatusDisplay = () => {
    const getStatusContent = () => {
      switch (rideStatus) {
        case "pending":
          return (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">Finding your driver...</Typography>
              <Typography variant="body2" color="text.secondary">
                We're connecting you with a nearby driver
              </Typography>
            </Box>
          );
        case "accepted":
          return (
            <>
              <Typography variant="h6" gutterBottom>
                Enjoy your ride!
              </Typography>
              <Typography variant="body1">
                You're on your way to your destination
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Distance: {routeDistance.toFixed(2)} km
              </Typography>
            </>
          );
        case "completed":
          return (
            <>
              <Typography variant="h6" gutterBottom>
                Ride Completed
              </Typography>
              <Box p={2} bgcolor="#f5f5f5" borderRadius={2} mb={2}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Thank you for riding with us!
                </Typography>
                <Typography variant="body1">
                  Your trip cost: ${fare.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Distance traveled: {routeDistance.toFixed(2)} km
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  How was your ride?
                </Typography>
                <Box display="flex" justifyContent="center" gap={1} mb={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Typography key={star} fontSize="24px" color="orange">
                      ★
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setRideRequested(false);
                    setIsConfirm(false);
                    setFare(null);
                    setRouteDistance(null);
                    setPickupLat("");
                    setPickupLon("");
                    setDropoffLat("");
                    setDropoffLon("");
                    setRideStatus("");
                  }}
                >
                  Book Another Ride
                </Button>
              </Box>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <Box flex={1} maxWidth={400} p={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Your Ride Status
        </Typography>
        <Box
          p={3}
          bgcolor="#f8f8f8"
          borderRadius={2}
          boxShadow="0 2px 12px rgba(0,0,0,0.1)"
        >
          {getStatusContent()}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      height="80vh"
      bgcolor="#fff"
      p={5}
    >
      {rideRequested ? <RideStatusDisplay /> : <RideBookingForm />}

      <Box
        flex={0.8}
        height={"60vh"}
        bgcolor="#e0e0e0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={2}
      >
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </Box>
    </Box>
  );
}
