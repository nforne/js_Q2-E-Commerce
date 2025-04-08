export const getOrderNotifications = (orderId) => {
  const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${orderId}`)) || [];

  const newMockNotifications = [
    "Order received 🛒",
    "Processing started 🔄",
    "Your package is packed 📦",
    "Out for delivery 🚚",
    "Delivered 🎉"
  ];

  return [...storedNotifications, ...newMockNotifications];
};

export const saveNotification = (orderId, message) => {
  const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${orderId}`)) || [];
  const updatedNotifications = [...storedNotifications, message];
  localStorage.setItem(`notifications_${orderId}`, JSON.stringify(updatedNotifications));
};

export const simulateNotificationUpdates = (orderId, callback) => {
  const mockUpdates = [
    "🚀 Welcome back! Here's your latest order update.",
    "Your package is on its way! 📦",
    "Expected arrival: Tomorrow at 3 PM 🚚"
  ];

  mockUpdates.forEach((message, index) => {
    setTimeout(() => {
      saveNotification(orderId, message);
      callback(message);
    }, index * 3000);
  });
};
