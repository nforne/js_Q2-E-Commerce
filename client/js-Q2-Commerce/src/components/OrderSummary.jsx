import styles from "../styles/OrderSummary.module.css";

const OrderSummary = ({ cartItems, total }) => {
  return (
    <div className={styles.summary}>
      <h2>Order Summary</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>{item.name} - ${item.price} x {item.quantity}</li>
        ))}
      </ul>
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
};

export default OrderSummary;
