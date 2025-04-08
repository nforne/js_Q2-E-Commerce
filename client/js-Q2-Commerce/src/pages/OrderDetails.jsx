import { useState, useEffect } from "react";
import { fetchOrderDetails } from "../services/transactionService";
import styles from "../styles/OrderDetails.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId).then((data) => setOrder(data));
    }
  }, [orderId]);

  return (
    <div className={styles.details}>
      <h1>Order Details</h1>
      {order ? (
        <div className={styles.orderContainer}>
          <h2>Order #{order.id}</h2>
          <p>Date: {order.date}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <p>Status: {order.status}</p>

          <h3>Items:</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price.toFixed(2)} (Qty: {item.quantity})
              </li>
            ))}
          </ul>

          {/* Navigation Buttons */}
          <button onClick={() => navigate(`/tracking?orderId=${order.id}`)}>Track Order</button>
          <button onClick={() => navigate("/contact-support")}>Contact Support</button>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetails;
