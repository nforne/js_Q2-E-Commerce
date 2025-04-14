import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { getCartItems, storeTransactions } from "../utils/storage"; // Secure local storage handling
import { encryptData } from "../utils/security"; // Encryption utilities
import OrderSummary from "../components/OrderSummary";
import { processPayment } from "../services/paymentService";
import styles from "../styles/Checkout.module.css";

const Checkout = () => {
  const { user, isAuthenticated, addTransaction } = useAuth(); // Access user and authentication state
  const { cartItems, total } = useContext(CartContext);
  const navigate = useNavigate();

  // Prefill form data with authenticated user's details, or leave blank for casual users
  const [formData, setFormData] = useState({
    name: isAuthenticated && user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : "",
    address: isAuthenticated && user.addresses?.default ? user.addresses.default : "",
    email: isAuthenticated ? user.email : "",
    paymentMethod: "credit-card", // Default payment method
  });

  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState(null); // Handle errors

  // Fetch correct cart source (local storage for casual users)
  const displayedCartItems = isAuthenticated ? cartItems : getCartItems();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form input
    if (!formData.name || !formData.address || !formData.email) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!isAuthenticated) {
      alert("You must register to complete checkout!");
      return;
    }

    try {
      // Process payment
      const response = await processPayment(formData, total);
      setConfirmation(response.message);

      // Securely store transaction locally for casual users
      const newTransaction = {
        name: formData.name,
        email: formData.email,
        total,
        items: displayedCartItems,
      };

      if (!isAuthenticated) {
        storeTransactions([...getCartItems(), encryptData(newTransaction)]);
      } else {
        addTransaction(newTransaction); // Add transaction to authenticated user's history
      }

      // Navigate to confirmation page with order details
      navigate("/confirmation", {
        state: {
          name: formData.name,
          email: formData.email,
          estimatedDelivery: "3-5 business days",
          items: displayedCartItems,
          total,
        },
      });
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className={styles.checkout}>
      <h1>Checkout</h1>
      <OrderSummary cartItems={displayedCartItems} total={total} />

      {/* Billing & Shipping Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Shipping Address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        {/* Payment Selection */}
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        >
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>

        <button type="submit">Complete Payment</button>
      </form>

      {error && <p className={styles.error}>❌ {error}</p>}
      {confirmation && <p className={styles.confirmation}>{confirmation}</p>}
    </div>
  );
};

export default Checkout;
