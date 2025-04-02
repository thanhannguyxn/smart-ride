import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography, Button, Grid, Avatar, Box } from "@mui/material";
import { haversineDistance } from "../../helper";
import { fetchMapKey, fetchRoute } from "../../service";

const fakeRideRequests = [
  {
    request_id: 1,
    pickup_lat: "21.041495",
    pickup_long: "105.808494",
    dropoff_lat: "21.032784",
    dropoff_long: "105.681964",
    fare: 15.75,
  },
  {
    request_id: 2,
    pickup_lat: "21.032784",
    pickup_long: "105.681964",
    dropoff_lat: "21.025452",
    dropoff_long: "105.826726",
    fare: 12.50,
  },
  {
    request_id: 3,
    pickup_lat: "21.025452",
    pickup_long: "105.826726",
    dropoff_lat: "21.045599",
    dropoff_long: "105.912635",
    fare: 18.00,
  },
];

const DriveDashboard = () => {
  const [rideRequests, setRideRequests] = useState(fakeRideRequests);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, long: null });
  const [activeRide, setActiveRide] = useState(null);
  const [subscriptionKey, setSubscriptionKey] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const datasourceRef = useRef(null);

  // Get current location
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
  }, []);

  useEffect(() => {
    async function fetchKey() {
      try {
        const key = await fetchMapKey();
        if (key) {
          setSubscriptionKey(key);
          loadMapScript();
        } else {
          console.error("Failed to get map key");
        }
      } catch (error) {
        console.error("Error fetching map key:", error);
      }
    }
    fetchKey();
  }, []);

  const loadMapScript = () => {
    if (document.querySelector('script[src*="atlas.min.js"]')) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js";
    script.async = true;
    script.onload = initializeMap;
    script.onerror = () => console.error("Failed to load Azure Maps script");
    document.body.appendChild(script);
  };

  const initializeMap = () => {
    if (!window.atlas) {
      console.error("Azure Maps SDK not loaded");
      return;
    }
    setIsMapLoaded(true);
  };

  useEffect(() => {
    if (subscriptionKey && isMapLoaded && mapRef.current && activeRide && !mapInstance.current) {
      try {
        mapInstance.current = new window.atlas.Map(mapRef.current, {
          center: [parseFloat(activeRide.pickup_long), parseFloat(activeRide.pickup_lat)],
          zoom: 12,
          view: "Auto",
          authOptions: {
            authType: "subscriptionKey",
            subscriptionKey: subscriptionKey,
          },
        });

        mapInstance.current.events.add("ready", () => {
          datasourceRef.current = new window.atlas.source.DataSource();
          mapInstance.current.sources.add(datasourceRef.current);
          loadRoutes();
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
  }, [subscriptionKey, isMapLoaded, activeRide]);

  const loadRoutes = async () => {
    const driverLat = currentLocation.lat;
    const driverLong = currentLocation.long;
    const pickup_lat = activeRide.pickup_lat;
    const pickup_long = activeRide.pickup_long;
    const dropoff_lat = activeRide.dropoff_lat;
    const dropoff_long = activeRide.dropoff_long;

    const routeData1 = await fetchRoute(
      driverLat,
      driverLong,
      pickup_lat,
      pickup_long
    );

    const routeData2 = await fetchRoute(
      pickup_lat,
      pickup_long,
      dropoff_lat,
      dropoff_long
    );

    if (!routeData1 || !routeData2) {
      console.error("Failed to fetch route data");
      return;
    }

    const route1 = routeData1.routes[0];
    const route2 = routeData2.routes[0];

    const routeCoordinates1 = route1.legs.flatMap((leg) =>
      leg.points.map((point) => [point.longitude, point.latitude])
    );

    const routeCoordinates2 = route2.legs.flatMap((leg) =>
      leg.points.map((point) => [point.longitude, point.latitude])
    );

    if (mapInstance.current && datasourceRef.current) {
      const routeLine1 = new window.atlas.data.LineString(routeCoordinates1);
      const routeLine2 = new window.atlas.data.LineString(routeCoordinates2);
      datasourceRef.current.clear();
      datasourceRef.current.add(new window.atlas.data.Feature(routeLine1));
      datasourceRef.current.add(new window.atlas.data.Feature(routeLine2));

      if (!mapInstance.current.layers.getLayerById('routeLayer')) {
        mapInstance.current.layers.add(
          new window.atlas.layer.LineLayer(
            datasourceRef.current,
            'routeLayer',
            {
              strokeColor: ['get', 'color'],
              strokeWidth: 2
            }
          )
        );
      }

      datasourceRef.current.add(new window.atlas.data.Feature(
        new window.atlas.data.Point([parseFloat(driverLong), parseFloat(driverLat)]),
        {
          title: 'Driver Location',
          iconImage: "pin-blue",
        }
      ));

      datasourceRef.current.add(new window.atlas.data.Feature(
        new window.atlas.data.Point([parseFloat(pickup_long), parseFloat(pickup_lat)]),
        {
          title: 'Pickup Location',
          iconImage: "pin-red",
        }
      ));

      datasourceRef.current.add(new window.atlas.data.Feature(
        new window.atlas.data.Point([parseFloat(dropoff_long), parseFloat(dropoff_lat)]),
        {
          title: 'Dropoff Location',
          iconImage: "pin-red",
        }
      ));

      if (!mapInstance.current.layers.getLayerById('symbolLayer')) {
        mapInstance.current.layers.add(
          new window.atlas.layer.SymbolLayer(datasourceRef.current, null, {
            iconOptions: {
              image: ["get", "iconImage"],
              allowOverlap: true,
              ignorePlacement: true,
            },
            textOptions: {
              textField: ["get", "title"],
              offset: [0, 1],
            },
            filter: [
              "any",
              ["==", ["geometry-type"], "Point"],
              ["==", ["geometry-type"], "MultiPoint"],
            ],
          })
        );
      }
    }
  }

  const handleAccept = (request) => {
    if (!activeRide) {
      setActiveRide(request);
      setRideRequests((prev) => prev.filter((r) => r.request_id !== request.request_id));

      mapInstance.current = null;
    }
  };

  const handleComplete = () => {
    if (mapInstance.current) {
      mapInstance.current.markers.clear();
      mapInstance.current = null;
    }
    setActiveRide(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Ride Requests
      </Typography>
      <Grid container spacing={3}>
        {rideRequests.map((request) => {
          const distance = haversineDistance(
            currentLocation.lat,
            currentLocation.long,
            request.pickup_lat,
            request.pickup_long
          );
          const canAccept = distance < 5 && !activeRide;

          return (
            <Grid item xs={12} sm={6} md={4} key={request.request_id}>
              <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{request.request_id}</Avatar>
                    <Typography variant="h6">Request {request.request_id}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Lat: {request.pickup_lat}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Long: {request.pickup_long}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                    Fare: ${request.fare.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Distance: {distance.toFixed(2)} km
                  </Typography>
                  {!canAccept && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {activeRide ? "Complete your current ride first." : "Too far to accept this ride."}
                    </Typography>
                  )}
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(request)}
                      disabled={!canAccept}
                    >
                      Accept
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {activeRide && (
        <Box sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Active Ride
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Request ID: {activeRide.request_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pickup: {activeRide.pickup_lat}, {activeRide.pickup_long}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dropoff: {activeRide.dropoff_lat}, {activeRide.dropoff_long}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
            Fare: ${activeRide.fare.toFixed(2)}
          </Typography>

          {/* Map container */}
          <Box
            sx={{
              mt: 2,
              height: "60vh",
              width: "100%",
              bgcolor: "#e0e0e0",
              borderRadius: 2,
              position: "relative"
            }}
          >
            <div
              ref={mapRef}
              style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            />
            {!isMapLoaded && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.7)"
                }}
              >
                <Typography>Loading map...</Typography>
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleComplete}
          >
            Complete Ride
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DriveDashboard;