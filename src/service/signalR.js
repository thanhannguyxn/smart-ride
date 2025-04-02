import * as signalR from "@microsoft/signalr";



const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(" https://localhost:7122/Hubs/RideRequestHub") // Replace with your actual backend URL
  .withAutomaticReconnect()
  .build();

export const startConnection = async () => {
  try {
    await hubConnection.start();
    console.log("Connected to SignalR Hub");
  } catch (err) {
    console.error("Error connecting to SignalR Hub", err);
    setTimeout(startConnection, 5000); // Retry connection after 5 seconds
  }
};

// Listening for "NewRideRequest" event
export const listenForRideRequests = (callback) => {
  hubConnection.on("NewRideRequest", (rideRequest) => {
    console.log("New ride request received:", rideRequest);
    if (callback) {
      callback(rideRequest);
    }
  });
};


export default { hubConnection, startConnection };