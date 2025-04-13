import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sendConfirmationEmail } from "../services/sendConfirmationEmail";
import styles from "../styles/OrderConfirmation.module.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state || {};
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null); // ✅ Added error handling

  useEffect(() => {
    if (orderDetails.email) {
      sendConfirmationEmail(orderDetails)
        .then(() => setEmailSent(true))
        .catch(() => setError("Failed to send confirmation email. Please check your email address and try again."));
    }
  }, [orderDetails]);

  return (
    <div className={styles.confirmation}>
      <h1>Order Confirmed! 🎉</h1>
      <p>Thank you for your purchase, {orderDetails.name}!</p>
      <p>Your order will arrive by {orderDetails.estimatedDelivery}.</p>

      <h2>Order Summary</h2>
      <ul>
        {orderDetails.items?.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>

      {error ? (
        <p className={styles.error}>❌ {error}</p>
      ) : emailSent ? (
        <p className={styles.success}>📧 Confirmation email sent!</p>
      ) : (
        <p>Sending email...</p>
      )}
    </div>
  );
};

export default OrderConfirmation;











`import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sendConfirmationEmail } from "../services/sendConfirmationEmail";
import styles from "../styles/OrderConfirmation.module.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state || {};
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (orderDetails.email) {
      sendConfirmationEmail(orderDetails).then(() => setEmailSent(true));
    }
  }, [orderDetails]);

  return (
    <div className={styles.confirmation}>
      <h1>Order Confirmed! 🎉</h1>
      <p>Thank you for your purchase, {orderDetails.name}!</p>
      <p>Your order will arrive by {orderDetails.estimatedDelivery}.</p>

      <h2>Order Summary</h2>
      <ul>
        {orderDetails.items?.map((item) => (
          <li key={item.id}>{item.name} - \${item.price} x {item.quantity}</li> //-----fix
        ))}
      </ul>

      {emailSent ? <p className={styles.success}>📧 Confirmation email sent!</p> : <p>Sending email...</p>}
    </div>
  );
};

export default OrderConfirmation;
`