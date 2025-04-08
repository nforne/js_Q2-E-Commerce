import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import CartItem from "../components/CartItem";
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const { cartItems, total, updateQuantity, removeItem } = useContext(CartContext);

  return (
    <div className={styles.cart}>
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <div className={styles.total}>
        <h2>Total: ${total.toFixed(2)}</h2>
        <button className={styles.checkout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
