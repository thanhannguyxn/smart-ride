function haversineDistance(loc1, loc2) {
  // Convert decimal degrees to radians
  const lat1 = (Math.PI / 180) * loc1.latitude;
  const lon1 = (Math.PI / 180) * loc1.longitude;
  const lat2 = (Math.PI / 180) * loc2.latitude;
  const lon2 = (Math.PI / 180) * loc2.longitude;

  // Haversine formula
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of Earth in kilometers
  const r = 6371;
  return c * r; // Distance in kilometers
}

// Find nearby drivers
function findNearbyDrivers(pickupLocation, drivers, maxDistanceKm = 5.0) {
  const nearbyDrivers = [];

  drivers.forEach((driver) => {
    if (!driver.isAvailable) return;

    const distance = haversineDistance(pickupLocation, driver.location);
    if (distance <= maxDistanceKm) {
      nearbyDrivers.push({ driver, distance });
    }
  });

  // Sort by distance
  nearbyDrivers.sort((a, b) => a.distance - b.distance);
  return nearbyDrivers;
}

// Match ride request to the nearest driver
function matchRideRequest(rideRequest, drivers, maxDistanceKm = 5.0) {
  const nearbyDrivers = findNearbyDrivers(rideRequest.pickup, drivers, maxDistanceKm);

  if (nearbyDrivers.length === 0) {
    return null; // No drivers found within the distance
  }

  // Return the closest driver
  return nearbyDrivers[0].driver;
}

// Example usage
// const [matchedDriver, setMatchedDriver] = useState(null);

//   const drivers = [
//     { id: 1, location: { latitude: 40.7128, longitude: -74.0060 }, isAvailable: true },
//     { id: 2, location: { latitude: 40.7306, longitude: -73.9352 }, isAvailable: true },
//     { id: 3, location: { latitude: 40.7851, longitude: -73.9683 }, isAvailable: false },
//   ];

//   const rideRequest = { pickup: { latitude: 40.7306, longitude: -73.9352 } };

//   const handleMatchRequest = () => {
//     const driver = matchRideRequest(rideRequest, drivers);
//     setMatchedDriver(driver);
//   };

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