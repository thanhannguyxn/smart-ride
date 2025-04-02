import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
    this.listeners = {};
  }

  initialize() {
    if (this.connection) return;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/ridehub")
      .withAutomaticReconnect()
      .build();

    this.startConnection();
  }

  async startConnection() {
    try {
      await this.connection.start();
      console.log("SignalR connection established");
      
      Object.keys(this.listeners).forEach(event => {
        this.listeners[event].forEach(callback => {
          this.connection.on(event, callback);
        });
      });
    } catch (error) {
      console.error("Error establishing SignalR connection:", error);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    if (this.connection) {
      this.connection.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      
      if (this.connection) {
        this.connection.off(event, callback);
      }
    }
  }

  async invoke(method, ...args) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error("Cannot invoke method. Connection not established.");
      return null;
    }
    
    try {
      return await this.connection.invoke(method, ...args);
    } catch (error) {
      console.error(`Error invoking ${method}:`, error);
      return null;
    }
  }
  get state() {
    return this.connection ? this.connection.state : null;
  }
}
const signalRService = new SignalRService();
export default signalRService;