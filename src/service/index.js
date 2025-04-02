const API_URL = "https://localhost:7122/api"; // Adjust as needed

// Function to fetch Azure Maps API key
export async function fetchMapKey() {
  try {
    const response = await fetch(API_URL + "/map/key");
    if (!response.ok) throw new Error("Failed to fetch map key");
    const data = await response.json();
    return data.subscriptionKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}

export async function fetchRoute(startLat, startLon, endLat, endLong) {
  try {
    const response = await fetch(
      `${API_URL}/route?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLong}`
    );

    if (!response.ok) throw new Error("Failed to fetch route");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

export async function createRideRequest(
    start_lat,
    start_long,
    end_lat,
    end_long,
    fare
  ) {
    try {
      const requestBody = {
        passengerId: 1,
        driverId: 5,
        pickupLat: start_lat,
        pickupLong: start_long,
        dropoffLat: end_lat,
        dropoffLong: end_long,
        fareAmount: fare,
        requestedAt: new Date().toISOString(),
        status: "PENDING",
      };
  
      const response = await fetch(`${API_URL}/RideRequest/CreateRideRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error("Failed to create ride request");
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating ride request:", error);
      return null;
    }
  }
  

  export async function updateRideRequest(rideId, status) {
    try {
      const requestBody = {
        status: status,
        driverId: 5,
        actualDropoffTime: new Date().toISOString(),
      };
  
      const response = await fetch(`${API_URL}/RideRequest/UpdateRideRequest/${rideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error("Failed to update ride request");
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating ride request:", error);
      return null;
    }
  }
  