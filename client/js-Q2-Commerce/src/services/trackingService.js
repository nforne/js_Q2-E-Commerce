export const getOrderStatus = async (orderId) => {
  const trackingData = {
    "1001": { status: "Processing", estimatedDelivery: "3-5 business days" },
    "1002": { status: "Shipped", estimatedDelivery: "2-4 business days" },
    "1003": { status: "Out for Delivery", estimatedDelivery: "Today" },
    "1004": { status: "Delivered", estimatedDelivery: "Completed" }
  };

  return trackingData[orderId] || { status: "Order not found", estimatedDelivery: "N/A" };
};

export const fetchTrackingInfo = async (orderId) => {
  const trackingData = {
    "1001": {
      id: "1001",
      estimatedDelivery: "2025-04-10",
      status: "Delivered",
      updates: [
        { date: "2025-04-01", status: "Order Confirmed" },
        { date: "2025-04-03", status: "Shipped" },
        { date: "2025-04-09", status: "Out for Delivery" },
        { date: "2025-04-10", status: "Delivered" }
      ]
    },
    "1002": {
      id: "1002",
      estimatedDelivery: "2025-04-15",
      status: "Shipped",
      updates: [
        { date: "2025-04-10", status: "Order Confirmed" },
        { date: "2025-04-12", status: "Shipped" }
      ]
    },
    "1003": {
      id: "1003",
      estimatedDelivery: "2025-04-20",
      status: "Processing",
      updates: [{ date: "2025-04-18", status: "Order Confirmed" }]
    }
  };

  return trackingData[orderId] || null;
};

