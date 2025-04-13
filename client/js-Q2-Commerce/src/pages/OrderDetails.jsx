import { useState, useEffect } from "react";
import { fetchOrderDetails } from "../services/transactionService";
import styles from "../styles/OrderDetails.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const [error, setError] = useState(null); // ✅ Added error handling
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setError("Invalid order ID. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchOrderDetails(orderId)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to retrieve order details. Please try again later.");
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className={styles.details}>
      <h1>Order Details</h1>

      {loading ? (
        <p>Loading order details...</p>
      ) : error ? (
        <p className={styles.error}>❌ {error}</p>
      ) : order ? (
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
        <p>Order details not found.</p>
      )}
    </div>
  );
};

export default OrderDetails;



`import { useState, useEffect } from "react";
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
          <p>Total: \${order.total.toFixed(2)}</p> //---------fix
          <p>Status: {order.status}</p>

          <h3>Items:</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} - \${item.price.toFixed(2)} (Qty: {item.quantity})//--------fix
              </li>
            ))}
          </ul>

          {/* Navigation Buttons */}
          <button onClick={() => navigate(\`/tracking?orderId=\${order.id}\`)}>Track Order</button> // ------------fix
          <button onClick={() => navigate("/contact-support")}>Contact Support</button>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetails;
`