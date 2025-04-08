import { useState, useEffect } from "react";
import { fetchOrderHistory } from "../services/transactionService";
import styles from "../styles/OrderHistory.module.css";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderHistory().then((data) => setOrders(data));
  }, []);

  return (
    <div className={styles.history}>
      <h1>Order History</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className={styles.order}>
            <h3>Order #{order.id}</h3>
            <p>Date: {order.date}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <p>Status: {order.status}</p>

            {/* Navigation Buttons */}
            <button onClick={() => navigate(`/tracking?orderId=${order.id}`)}>Track Order</button>
            <button onClick={() => navigate(`/order-details?orderId=${order.id}`)}>View Details</button>
          </div>
        ))
      ) : (
        <p>No past orders available.</p>
      )}
    </div>
  );
};

export default OrderHistory;
