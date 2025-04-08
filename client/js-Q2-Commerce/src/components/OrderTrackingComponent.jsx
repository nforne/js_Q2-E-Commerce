import { useEffect, useState } from "react";
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
