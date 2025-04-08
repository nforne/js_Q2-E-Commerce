//WebSocket Server

import { Server } from "ws";

const server = new Server({ port: 8080 });

const notifications = {
  "1001": ["Processing started", "Order packed"],
  "1002": ["Shipped", "Tracking number assigned"],
  "1003": ["Out for Delivery", "Driver is nearby"],
  "1004": ["Delivered", "Your package arrived"]
};

// Default notification for all users on restart
const defaultNotification = "🚀 Welcome back! Here's your latest order update.";

server.on("connection", (socket) => {
  console.log("Client connected");

  // Send the default notification to all users immediately after connecting
  socket.send(JSON.stringify({ message: defaultNotification, orderId: "general" }));

  socket.on("message", (orderId) => {
    if (notifications[orderId]) {
      notifications[orderId].forEach((message, index) => {
        setTimeout(() => {
          socket.send(JSON.stringify({ message, orderId }));
        }, index * 2000);
      });
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});



//WebSocket Client
const socket = new WebSocket("ws://localhost:8080");

export const subscribeToOrderNotifications = (orderId, callback) => {
  socket.onopen = () => socket.send(orderId);

  socket.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    saveNotification(orderId, notification.message);
    callback(notification);
  };
};
