import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/ProductDetails.module.css";
import { fetchProductById } from "../services/productService";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductById(productId).then((data) => setProduct(data));
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.productDetails}>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p className={styles.price}>${product.price}</p>
      <p>{product.description}</p>

      <div className={styles.actions}>
        <button className={styles.buyNow}>Buy Now</button>
        <button className={styles.addToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;
