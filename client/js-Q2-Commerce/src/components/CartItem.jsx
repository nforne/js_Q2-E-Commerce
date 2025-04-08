import styles from "../styles/CartItem.module.css";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className={styles.cartItem}>
      <img src={item.image} alt={item.name} />
      <div className={styles.details}>
        <h2>{item.name}</h2>
        <p>${item.price}</p>
        <div className={styles.actions}>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
        <button className={styles.remove} onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
