import styles from "../styles/ProductCard.module.css";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addItem } = useContext(CartContext);

  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className={styles.price}>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
