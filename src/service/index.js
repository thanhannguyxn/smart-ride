const API_URL = "https://localhost:7156/api"; // Adjust as needed
 
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