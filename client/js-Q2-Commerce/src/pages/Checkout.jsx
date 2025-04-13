import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { getCartItems, storeTransactions } from "../utils/storage"; // Secure local storage handling
import { encryptData } from "../utils/security"; // Encryption utilities
import OrderSummary from "../components/OrderSummary";
import { processPayment } from "../services/paymentService";
import styles from "../styles/Checkout.module.css";

const Checkout = () => {
  const { user, isAuthenticated, addTransaction } = useAuth();
  const { cartItems, total } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    paymentMethod: "credit-card",
  });

  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState(null); // ✅ Added error handling

  // Fetch correct cart source (casual users retrieve encrypted local storage)
  const displayedCartItems = isAuthenticated ? cartItems : getCartItems();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate user input
    if (!formData.name || !formData.address || !formData.email) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!isAuthenticated) {
      alert("You must register to complete checkout!");
      return;
    }

    try {
      // Process payment (real API call integration)
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
        addTransaction(newTransaction);
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

      {error && <p className={styles.error}>❌ {error}</p>}
      {confirmation && <p className={styles.confirmation}>{confirmation}</p>}
    </div>
  );
};

export default Checkout;





`import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { getCartItems, storeCartItems, getTransactions, storeTransactions } from "../utils/storage"; // Secure local storage handling
import { encryptData, decryptData } from "../utils/security"; // Encryption utilities
import OrderSummary from "../components/OrderSummary";
import { processPayment } from "../services/paymentService";
import styles from "../styles/Checkout.module.css";

const Checkout = () => {
  const { user, isAuthenticated, authenticateUser, addTransaction } = useAuth();
  const { cartItems, total } = useContext(CartContext);
  const [formData, setFormData] = useState({ name: "", address: "", email: "", paymentMethod: "credit-card" });
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();

  // Fetch correct cart source (casual users retrieve encrypted local storage)
  const displayedCartItems = isAuthenticated ? cartItems : getCartItems();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // If casual user, prompt registration before proceeding
    if (!isAuthenticated) {
      alert("You must register to complete checkout!");
      return;
    }

    // Process payment for registered users
    const response = await processPayment(formData, total);
    setConfirmation(response);

    // Securely store transaction locally for casual users
    const newTransaction = { name: formData.name, email: formData.email, total, items: displayedCartItems };
    if (!isAuthenticated) {
      const encryptedTransaction = encryptData(newTransaction);
      storeTransactions([...getTransactions(), encryptedTransaction]); // Secure storage
    } else {
      addTransaction(newTransaction); // Add transaction for registered users
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
  };

  return (
    <div className={styles.checkout}>
      <h1>Checkout</h1>
      <OrderSummary cartItems={displayedCartItems} total={total} />

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

export default Checkout;`


`
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { getCartItems, migrateCasualData } from "../utils/storage"; // Import casual user data handling
import OrderSummary from "../components/OrderSummary";
import { processPayment } from "../services/paymentService";
import styles from "../styles/Checkout.module.css";

const Checkout = () => {
  const { user, isAuthenticated, authenticateUser } = useAuth();
  const { cartItems, total } = useContext(CartContext);
  const [formData, setFormData] = useState({ name: "", address: "", email: "", paymentMethod: "credit-card" });
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();

  // Fetch correct cart source
  const displayedCartItems = isAuthenticated ? cartItems : getCartItems();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // If casual user, prompt registration before proceeding
    if (!isAuthenticated) {
      alert("You must register to complete checkout!");
      return;
    }

    // Process payment for registered users
    const response = await processPayment(formData, total);
    setConfirmation(response);

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

    // If user was casual, migrate their data to backend
    await migrateCasualData(user.user_id, authenticateUser);
  };

  return (
    <div className={styles.checkout}>
      <h1>Checkout</h1>
      <OrderSummary cartItems={displayedCartItems} total={total} />

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

`