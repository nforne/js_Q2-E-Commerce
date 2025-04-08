const socket = new WebSocket("ws://localhost:8080");

export const subscribeToOrderNotifications = (orderId, callback) => {
  socket.onopen = () => socket.send(orderId);

  socket.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification);
  };
};
