import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import OrderSummary from "../components/OrderSummary";
import { processPayment } from "../services/paymentService";
import styles from "../styles/Checkout.module.css";

const Checkout = () => {
  const { cartItems, total } = useContext(CartContext);
  const [formData, setFormData] = useState({ name: "", address: "", email: "", paymentMethod: "credit-card" });
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const response = processPayment(formData, total);
    setConfirmation(response);

    // Navigate to confirmation page with order details
    navigate("/confirmation", {
      state: {
        name: formData.name,
        email: formData.email,
        estimatedDelivery: "3-5 business days",
        items: cartItems,
        total,
      },
    });
  };

  return (
    <div className={styles.checkout}>
      <h1>Checkout</h1>
      <OrderSummary cartItems={cartItems} total={total} />

      {/* Billing & Shipping Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="text" placeholder="Shipping Address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

        {/* Payment Selection */}
        <select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>

        <button type="submit">Complete Payment</button>
      </form>

      {confirmation && <p className={styles.confirmation}>{confirmation}</p>}
    </div>
  );
};

export default Checkout;
