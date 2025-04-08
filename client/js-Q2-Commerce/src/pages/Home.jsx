import { useEffect, useState } from "react";
import AdCarousel from "../components/AdCarousel";
import ProductRow from "../components/ProductRow";
import styles from "../styles/Home.module.css";
import { fetchProductsByCategory } from "../services/productService";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetchProductsByCategory("featured").then((data) => setFeatured(data));
    fetchProductsByCategory("new-arrivals").then((data) => setNewArrivals(data));
    fetchProductsByCategory("best-sellers").then((data) => setBestSellers(data));
    fetchProductsByCategory("deals").then((data) => setDeals(data));
  }, []);

  return (
    <div className={styles.home}>
      {/* Rotating Advertisement Carousel */}
      <AdCarousel />

      {/* Product Rows */}
      <ProductRow title="Featured Products" products={featured} />
      <ProductRow title="New Arrivals" products={newArrivals} />
      <ProductRow title="Best Sellers" products={bestSellers} />
      <ProductRow title="Deals of the Day" products={deals} />

      {/* Sign-Up Section */}
      <div className={styles.signup}>
        <h2>Join Q2-Commerce Today!</h2>
        <p>Sign up for exclusive deals and personalized recommendations.</p>
        <button>Sign Up</button>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Q2-Commerce | <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
      </footer>
    </div>
  );
};

export default Home;
