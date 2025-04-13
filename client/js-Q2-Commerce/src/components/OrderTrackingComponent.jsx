import { useEffect, useState } from "react";
import { getOrderStatus } from "../services/trackingService";
import NotificationBell from "./NotificationBell"; // ✅ Added notification integration

const OrderTrackingComponent = ({ orderId }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const [error, setError] = useState(null); // ✅ Added error state

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      setError(null); // Reset error state before fetching
      getOrderStatus(orderId)
        .then((data) => {
          setTrackingInfo(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to retrieve tracking details. Please try again later.");
          setLoading(false);
        });
    }
  }, [orderId]);

  return (
    <div>
      <NotificationBell orderId={orderId} /> {/* ✅ Ensures notifications are triggered */}
      {loading ? (
        <p>Fetching tracking details...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : trackingInfo ? (
        <>
          <h3>Status: {trackingInfo.status}</h3>
          <p>Estimated Delivery: {trackingInfo.estimatedDelivery}</p>
        </>
      ) : (
        <p>Tracking information not available.</p>
      )}
    </div>
  );
};

export default OrderTrackingComponent;





`import { useEffect, useState } from "react";
import { getOrderStatus } from "../services/trackingService";

const OrderTrackingComponent = ({ orderId }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    if (orderId) {
      getOrderStatus(orderId).then((data) => setTrackingInfo(data));
    }
  }, [orderId]);

  return (
    <div>
      {trackingInfo ? (
        <>
          <h3>Status: {trackingInfo.status}</h3>
          <p>Estimated Delivery: {trackingInfo.estimatedDelivery}</p>
        </>
      ) : (
        <p>Loading tracking details...</p>
      )}
    </div>
  );
};

export default OrderTrackingComponent;
`