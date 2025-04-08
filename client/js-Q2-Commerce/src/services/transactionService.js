import { mockOrders } from "../mockData/mockOrders";


export const fetchOrderHistory = async () => {
  return mockOrders || [
    { id: "1001", date: "2025-03-01", total: 49.99, status: "Delivered" },
    { id: "1002", date: "2025-03-15", total: 29.99, status: "Shipped" },
    { id: "1003", date: "2025-03-20", total: 79.99, status: "Processing" }
  ];
};


export const fetchOrderDetails = async (orderId) => {
  const orderData = {
    "1001": {
      id: "1001",
      date: "2025-03-01",
      total: 49.99,
      status: "Delivered",
      items: [
        { id: "P01", name: "Wireless Earbuds", price: 29.99, quantity: 1 },
        { id: "P02", name: "Phone Case", price: 19.99, quantity: 1 }
      ]
    },
    "1002": {
      id: "1002",
      date: "2025-03-15",
      total: 29.99,
      status: "Shipped",
      items: [
        { id: "P03", name: "Charging Cable", price: 14.99, quantity: 1 },
        { id: "P04", name: "Screen Protector", price: 14.99, quantity: 1 }
      ]
    },
    "1003": {
      id: "1003",
      date: "2025-03-20",
      total: 79.99,
      status: "Processing",
      items: [
        { id: "P05", name: "Bluetooth Speaker", price: 79.99, quantity: 1 }
      ]
    }
  };

  return mockOrders.find((order) => order.id === orderId) || orderData[orderId] || null;
};
