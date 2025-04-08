import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`${styles.navbar} ${styles[theme]}`}>
      <div className={styles.logo}>
        <Link to="/">Q2-Commerce</Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Nav Links */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : styles.hideMenu}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>

      <div className={styles.actions}>
        <ThemeToggle />
        <button className={styles.authButton}>Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
