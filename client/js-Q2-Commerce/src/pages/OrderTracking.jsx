import { useState, useEffect } from "react";
import { fetchTrackingInfo } from "../services/trackingService";
import styles from "../styles/OrderTracking.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";

const OrderTracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      fetchTrackingInfo(orderId).then((data) => setTrackingInfo(data));
    }
  }, [orderId]);

  return (
    <div className={styles.tracking}>
      <h1>Order Tracking</h1>

      {trackingInfo ? (
        <div className={styles.trackingDetails}>
          <h2>Order #{trackingInfo.id}</h2>
          <p>Estimated Delivery: {trackingInfo.estimatedDelivery}</p>
          <p className={`${styles.status} ${styles[trackingInfo.status.toLowerCase()]}`}>
            {trackingInfo.status}
          </p>

          <h3>Tracking Updates:</h3>
          <ul>
            {trackingInfo.updates.map((update, index) => (
              <li key={index}>
                <strong>{update.date}:</strong> {update.status}
              </li>
            ))}
          </ul>

          <button onClick={() => navigate(`/order-details?orderId=${trackingInfo.id}`)}>View Order Details</button>
        </div>
      ) : (
        <p>Loading tracking information...</p>
      )}
    </div>
  );
};

export default OrderTracking;
