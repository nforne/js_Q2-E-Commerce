import ProductCard from "./ProductCard";
import styles from "../styles/ProductRow.module.css";

const ProductRow = ({ title, products }) => {
  return (
    <div className={styles.row}>
      <h2>{title}</h2>
      <div className={styles.productGrid}>
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProductRow;

