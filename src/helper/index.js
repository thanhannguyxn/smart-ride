import { fetchRoute } from "../service";

export function haversineDistance(start_lat, start_long, end_lat, end_long) {
  const lat1 = (Math.PI / 180) * start_lat;
  const lon1 = (Math.PI / 180) * start_long;
  const lat2 = (Math.PI / 180) * end_lat;
  const lon2 = (Math.PI / 180) * end_long;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));

  const r = 6371;
  return c * r;
}

export const calculateFare = (distance) => {
  const baseFare = 2;
  const perKmRate = 1;
  return baseFare + distance * perKmRate;
};

export const handleSeePrices = async (
  pickupLat,
  pickupLon,
  dropoffLat,
  dropoffLon,
  setRouteDistance,
  setFare,
  mapInstance,
  datasourceRef
) => {
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
  const distance = route.summary.lengthInMeters / 1000;
  setRouteDistance(distance);
  setFare(calculateFare(distance));

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


export const getUserLocation = (setPickupLat, setPickupLon, mapInstance) => {
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
